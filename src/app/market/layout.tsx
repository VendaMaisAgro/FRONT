// src/app/layout.tsx
import SessionProvider from "@/providers/sessionProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Venda+",
  description: "Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
