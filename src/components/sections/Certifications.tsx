import { Award, ExternalLink } from "lucide-react";
import type { Certification } from "@/types/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/utilities/stagger";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Certifications({ items }: { items: Certification[] }) {
  return (
    <section id="certifications" className="py-16">
      <Container>
        <SectionHeading eyebrow="Certifications" title="Certifications & achievements" />
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-muted">
            Certifications and achievements will appear here.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={stagger(i % 2)} className="h-full">
                  <div className="lift flex h-full gap-4 rounded-2xl border border-border bg-surface shadow-card p-5">
                    <Award className="mt-0.5 shrink-0 text-accent" size={20} aria-hidden="true" />
                    <div>
                      <h3 className="font-medium">{c.title}</h3>
                      <p className="text-sm text-muted">
                        {c.issuer}
                        {c.date ? ` · ${c.date}` : ""}
                      </p>
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-accent">
                          <span className="link-underline">View credential</span>
                          <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
