import logoW from "@/assets/logoW.svg";
import { footerSections } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";

export default function FooterLanding() {
  return (
    <footer id="footer" className="bg-primary-dark py-8">
      <ul className="grid grid-cols-1 mb-8 justify-items-center gap-4 sm:gap-0 sm:grid-cols-2">
        {footerSections.map((g, _) => {
          return (
            <li key={_} className="w-1/2">
              <h4 className="text-white font-semibold text-xl mb-2">
                {g.group}
              </h4>
              <ul className="text-neutral-100 space-y-2">
                {g.sections.map((s, _) => {
                  return (
                    <li key={_}>
                      <Link href={s.href} className="hover:underline">
                        {s.section}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center border-t border-b border-gray-5/10 py-8">
        <Image src={logoW} alt="Logo Venda+ na cor branca" className="w-44" />
      </div>
      <p className="text-center mt-6 text-sm text-white">
        © 2025 Venda+ Agromarket
      </p>
    </footer>
  );
}
