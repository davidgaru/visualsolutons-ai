import { PageHero } from "@/components/ui/page-hero";

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This is a starter policy template. Replace with final legal copy before production launch."
      />

      <section className="section">
        <div className="container legal-copy">
          <p>
            Visual Solutions AI collects contact details submitted through forms only for project communication.
            We do not sell personal data.
          </p>
          <p>
            You may request data deletion at any time by contacting us through the official company email.
          </p>
        </div>
      </section>
    </main>
  );
}
