import "./globals.css";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/ui-shell/app-shell";
import { SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";

export const metadata = {
  title: "Credo",
  description: "Credo operations workspace",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialSidebarCollapsed = cookieStore.get(SIDEBAR_COOKIE_KEY)?.value === "1";

  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className={`${plusJakartaSans.variable} h-full`}>
        <AppShell initialSidebarCollapsed={initialSidebarCollapsed}>{children}</AppShell>
      </body>
    </html>
  );
}
