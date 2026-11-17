import { GraduationCap } from "lucide-react";
import type { Education as EducationItem } from "@/types/portfolio";
import { Container, SectionHeading } from "@/components/ui/primitives";

export function Education({ items }: { items: EducationItem[] }) {
  return (
    <section id="education" className="py-16">
      <Container>
        <SectionHeading eyebrow="Education" title="Academic background" />
        <div className="space-y-4">
          {items.map((e) => (
            <div
              key={e.id}
              className="flex gap-5 rounded-xl border border-border bg-surface p-6"
            >
              <GraduationCap className="mt-1 shrink-0 text-accent" size={24} aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold">{e.degree}</h3>
                <p className="text-muted">{e.specialization}</p>
                {e.institution && <p className="mt-1">{e.institution}</p>}
                <p className="mt-2 font-mono text-sm text-muted">
                  Graduation: {e.graduationYear}
                </p>
                {e.notes && <p className="mt-3 text-muted">{e.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
