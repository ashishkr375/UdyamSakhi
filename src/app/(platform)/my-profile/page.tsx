'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Building, Camera, Phone, Home, Mail } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const businessFormSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters.' }).optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  type: z.string().optional(),
  state: z.string().optional(),
  udyamNumber: z.string().regex(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, { 
    message: 'Please enter a valid Udyam registration number (format: UDYAM-XX-XX-XXXXXXX).' 
  }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function MyProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: '',
      industry: '',
      stage: '',
      type: '',
      state: '',
      udyamNumber: '',
    },
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    // Fetch user data
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);

      // Set profile form values
      profileForm.reset({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
      });

      // Set business form values
      businessForm.reset({
        businessName: data.businessProfile?.businessName || '',
        industry: data.businessProfile?.industry || '',
        stage: data.businessProfile?.stage || '',
        type: data.businessProfile?.type || '',
        state: data.businessProfile?.state || '',
        udyamNumber: data.businessProfile?.udyamNumber || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          address: values.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
        },
      });

      toast.success('Profile updated successfully');
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onBusinessSubmit = async (values: BusinessFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/business-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update business profile');
      }

      toast.success('Business profile updated successfully');
      fetchUserData();
      router.refresh();
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('Failed to update business profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !userData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            My Profile
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-purple-100 dark:border-purple-900 shadow-sm">
          <Avatar className="h-24 w-24 border-2 border-pink-200 dark:border-pink-800">
            <AvatarImage src={userData.avatar?.url} />
            <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
              {userData.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{userData.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
            <Button 
              variant="outline" 
              className="mt-3 border-gray-200 dark:border-gray-700 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            >
              <Camera className="mr-2 h-4 w-4" />
              Change Avatar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900 p-1">
            <TabsTrigger 
              value="personal" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <UserCircle className="h-4 w-4" />
              Personal Information
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <Building className="h-4 w-4" />
              Business Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled
                              className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 dark:text-gray-500">
                            Email cannot be changed. Contact support if needed.
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Home className="h-3.5 w-3.5" />
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="business" className="space-y-4 mt-4">
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Business Profile
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Update your business information. This helps us tailor our services to your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...businessForm}>
                  <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                    <FormField
                      control={businessForm.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Business Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Industry</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                                  <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-purple-100 dark:border-purple-900">
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Services">Services</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Agriculture">Agriculture</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={businessForm.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Business Stage</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                                  <SelectValue placeholder="Select business stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-purple-100 dark:border-purple-900">
                                <SelectItem value="Ideation">Ideation</SelectItem>
                                <SelectItem value="Startup">Startup</SelectItem>
                                <SelectItem value="Growth">Growth</SelectItem>
                                <SelectItem value="Mature">Mature</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Business Type</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-purple-100 dark:border-purple-900">
                                <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="LLP">LLP</SelectItem>
                                <SelectItem value="Private Limited">Private Limited</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={businessForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">State</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-purple-100 dark:border-purple-900">
                                <SelectItem value="All">All India</SelectItem>
                                <SelectItem value="Delhi">Delhi</SelectItem>
                                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="Karnataka">Karnataka</SelectItem>
                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="Gujarat">Gujarat</SelectItem>
                                <SelectItem value="Telangana">Telangana</SelectItem>
                                <SelectItem value="West Bengal">West Bengal</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={businessForm.control}
                      name="udyamNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Udyam Registration Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="UDYAM-XX-XX-XXXXXXX"
                              className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 dark:text-gray-500">
                            Optional: Enter your Udyam registration number if available.
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 