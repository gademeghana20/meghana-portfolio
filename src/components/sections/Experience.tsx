import type { Experience as ExperienceItem } from "@/types/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading, Tag } from "@/components/ui/primitives";

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <section id="experience" className="py-16">
      <Container>
        <SectionHeading eyebrow="Experience" title="Professional experience" />
        <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
          {items.map((e) => (
            <li key={e.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-2 size-3 rounded-full border-2 border-accent bg-background sm:-left-[39px]"
              />
              <Reveal>
              <div className="lift rounded-2xl border border-border bg-surface shadow-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold">{e.role}</h3>
                  <p className="font-mono text-sm text-muted">
                    {e.startDate} – {e.endDate ?? "Present"}
                  </p>
                </div>
                <p className="mt-1 text-accent">{e.company}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-accent">
                  {e.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.technologies.map((t) => (
                    <li key={t}>
                      <Tag>{t}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
