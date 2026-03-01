import { PageHero } from "@/components/ui/page-hero";

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="This is a starter terms template. Replace with final legal copy before production launch."
      />

      <section className="section">
        <div className="container legal-copy">
          <p>
            All content on this site belongs to Visual Solutions AI unless otherwise stated. Unauthorized usage is prohibited.
          </p>
          <p>
            Project timelines, deliverables, and usage rights are defined per signed agreement and override this general page.
          </p>
        </div>
      </section>
    </main>
  );
}
