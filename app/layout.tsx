import "./globals.css";
import { cookies } from "next/headers";
import { AppShell } from "@/components/ui-shell/app-shell";
import { SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";

export const metadata = {
  title: "Credo",
  description: "Credo operations workspace",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = cookieStore.get(SIDEBAR_COOKIE_KEY)?.value === "1";

  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className="h-full overflow-hidden">
        <AppShell initialSidebarCollapsed={initialSidebarCollapsed}>{children}</AppShell>
      </body>
    </html>
  );
}
