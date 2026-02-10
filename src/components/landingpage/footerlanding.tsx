import logoW from "@/assets/logoW.svg";
import { footerSections } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";

export default function FooterLanding() {
  return (
    <footer id="footer" className="bg-primary-dark py-8">
      <ul className="grid grid-cols-1 mb-8 justify-items-center gap-4 sm:gap-0 md:grid-cols-3">
        {footerSections.map((g, _) => {
          return (
            <li key={_} className="w-full text-center md:text-left md:w-auto">
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
        <li className="w-full text-center md:text-left md:w-auto">
          <h4 className="text-white font-semibold text-xl mb-2">Contatos</h4>
          <ul className="text-neutral-100 space-y-2">
            <li>
              <a
                href="mailto:vendamaisagro@gmail.com"
                className="hover:underline"
              >
                vendamaisagro@gmail.com
              </a>
            </li>
            <li className="text-sm text-neutral-300">Resposta em até 48h</li>
            <li className="pt-2">
              <a
                href="mailto:vendamaisagro@gmail.com"
                className="bg-white text-primary-dark px-3 py-1.5 text-sm rounded font-medium hover:bg-neutral-100 transition-colors inline-block"
              >
                Fale Conosco
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <div className="flex justify-center border-t border-b border-gray-5/10 py-8">
        <Image src={logoW} alt="Logo Venda+ na cor branca" className="w-44" />
      </div>
      <p className="text-center mt-6 text-sm text-white">
        © 2026 Venda+ Agromarket
      </p>
    </footer>
  );
}
