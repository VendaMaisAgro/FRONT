// app/landingpage/page.tsx

import AboutSection from "@/components/landingpage/AboutSection";
import ClientSection from "@/components/landingpage/ClientSection";
import FooterLanding from "@/components/landingpage/footerlanding";
import Hero from "@/components/landingpage/Hero";
import NavbarLanding from "@/components/landingpage/Navbar";
import ProducerSection from "@/components/landingpage/ProducerSection";

export default function LandingPage() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
			<NavbarLanding />
			<Hero />
			<AboutSection />
			<ProducerSection />
			<ClientSection />
			<FooterLanding />
		</main>
	);
}
