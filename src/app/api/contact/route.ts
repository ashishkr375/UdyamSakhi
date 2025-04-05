import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  subject: z.string().min(1),
  category: z.string().min(1),
  message: z.string().min(10).max(1000),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = formSchema.parse(body);

    // Send email notification
    await resend.emails.send({
      from: 'support@udyamsakhi.com',
      to: 'support-team@udyamsakhi.com',
      subject: `[${validatedData.priority.toUpperCase()}] ${validatedData.subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${session.user?.email}</p>
        <p><strong>Category:</strong> ${validatedData.category}</p>
        <p><strong>Priority:</strong> ${validatedData.priority}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'support@udyamsakhi.com',
      to: session.user?.email as string,
      subject: 'We received your message - UdyamSakhi Support',
      html: `
        <h2>Thank you for contacting UdyamSakhi Support</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Category:</strong> ${validatedData.category}</p>
        <p><strong>Priority:</strong> ${validatedData.priority}</p>
        <p><strong>Your message:</strong></p>
        <p>${validatedData.message}</p>
        <p>Best regards,<br>UdyamSakhi Support Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 