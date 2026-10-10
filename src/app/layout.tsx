import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ClientAppShell } from "@/components/ClientAppShell";

export const metadata: Metadata = {
  title: "CivicSense — From Citizen Voice to City Action",
  description:
    "Smart City & Civic Tech platform connecting citizens with municipal services through AI complaint understanding, location intelligence, and incident consolidation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <LanguageProvider>
            <ClientAppShell>{children}</ClientAppShell>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
