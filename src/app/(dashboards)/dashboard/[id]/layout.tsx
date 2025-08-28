import { Navigation } from "@/components/dashboard/components/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-4">
      <Navigation />
      {children}
    </div>
  );
}
