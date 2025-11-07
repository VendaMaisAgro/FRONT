// components/Navbar.tsx
"use client";

import logo from "@/assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
	{ label: "Sobre", href: "#sobre" },
	{ label: "Produtor", href: "#produtor" },
	{ label: "Cliente", href: "#cliente" },
	{ label: "Contatos", href: "#footer" },
];

export default function NavbarLanding() {
	const [activeSection, setActiveSection] = useState<string>("sobre-nos");

	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "0px 0px -60% 0px",
			threshold: 0,
		};
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					setActiveSection(entry.target.id);
				}
			});
		}, observerOptions);

		navItems.forEach((item) => {
			const el = document.getElementById(item.href.slice(1));
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center h-16 justify-center sm:justify-between">
					{/* Logo */}
					<Link href="/landingpage" className="hidden sm:block">
						<Image src={logo} alt="Venda+ Agromarket logo" className="w-32" />
					</Link>

					{/* Nav Links */}
					<ul className="flex space-x-8">
						{navItems.map(({ label, href }) => {
							const sectionId = href.slice(1);
							const isActive = activeSection === sectionId;
							return (
								<li key={href}>
									<Link
										href={href}
										onClick={() => setActiveSection(sectionId)}
										className={`
                      relative pb-1 transition
                      ${
												isActive
													? "text-green-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-green-600"
													: "text-gray-700 hover:text-green-600"
											}
                    `}
									>
										{label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</nav>
	);
}
