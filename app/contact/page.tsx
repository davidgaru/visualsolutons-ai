import { BookingPanel } from "@/components/sections/booking-panel";
import { PageHero } from "@/components/ui/page-hero";

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Start your next project."
        description="Book a call with our team."
      />
      <BookingPanel />
    </main>
  );
}
