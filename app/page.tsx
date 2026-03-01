import { BookingPanel } from "@/components/sections/booking-panel";
import { ClientsStrip } from "@/components/sections/clients-strip";
import { HomeHero } from "@/components/sections/home-hero";
import { SignatureServices } from "@/components/sections/signature-services";
import { WorkPreview } from "@/components/sections/work-preview";
import { getProjects } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main className="home-cinematic">
      <HomeHero />
      <ClientsStrip />
      <SignatureServices />
      <WorkPreview projects={projects} />
      <BookingPanel />
    </main>
  );
}
