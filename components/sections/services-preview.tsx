import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { Service } from "@/lib/types";

type ServicesPreviewProps = {
  services: Service[];
};

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Services</p>
          <h2>From campaign visuals to film-ready AI production.</h2>
        </Reveal>

        <div className="card-grid card-grid--services">
          {services.slice(0, 4).map((service, index) => (
            <Reveal key={service._id} delay={index * 0.06}>
              <article className="card service-card">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <Link href="/services" className="button button--ghost">
            View All Services
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
