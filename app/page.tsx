import { BookingPanel } from "@/components/sections/booking-panel";
import { ClientsStrip } from "@/components/sections/clients-strip";
import { FeaturedWorkShowcase } from "@/components/sections/featured-work-showcase";
import { HomeHero } from "@/components/sections/home-hero";
import { SignatureServices } from "@/components/sections/signature-services";
import { getFeaturedProjects } from "@/lib/content";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <main className="home-cinematic">
      <HomeHero />
      <ClientsStrip />
      <SignatureServices />
      <section>
        <FeaturedWorkShowcase projects={featuredProjects} />
        <div className="container" style={{ textAlign: "center" }}>
          <Link href="/work" className="button">
            View Full Archive
          </Link>
        </div>
      </section>
      <BookingPanel />
    </main>
  );
}
