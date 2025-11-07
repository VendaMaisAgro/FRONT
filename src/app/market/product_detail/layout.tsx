// app/detalhamento_produto/page.tsx
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

export default function ProductDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
