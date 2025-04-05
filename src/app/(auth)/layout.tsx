export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[450px] p-6 space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">UdyamSakhi</h1>
          <p className="text-sm text-muted-foreground">
            Empowering Women Entrepreneurs
          </p>
        </div>
        {children}
      </div>
    </div>
  );
} 