import {
  Brain,
  Code2,
  Database,
  LayoutTemplate,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SkillCategory, SkillLevel } from "@/types/portfolio";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { cn } from "@/lib/utilities/cn";

const icons: Record<SkillCategory["icon"], LucideIcon> = {
  code: Code2,
  layout: LayoutTemplate,
  server: Server,
  database: Database,
  brain: Brain,
  wrench: Wrench,
};

// Each level has its own palette tone, so the meaning never depends on color alone:
// solid rose = professional, butter = projects, dashed sage = familiar.
const levelStyle: Record<SkillLevel, string> = {
  professional: "border-accent/40 bg-rose-soft text-foreground",
  project: "border-transparent bg-sun-soft text-foreground",
  familiar: "border-dashed border-accent/40 bg-sage-soft text-foreground",
};

const legend: Array<[SkillLevel, string]> = [
  ["professional", "Used professionally"],
  ["project", "Used in projects"],
  ["familiar", "Familiar"],
];

export function Skills({ categories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="py-16">
      <Container>
        <SectionHeading eyebrow="Skills" title="Technical skills" />

        <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {legend.map(([level, label]) => (
            <li key={level} className="flex items-center gap-2">
              <span className={cn("inline-block h-3 w-5 rounded border", levelStyle[level])} />
              {label}
            </li>
          ))}
        </ul>

        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((c) => {
            const Icon = icons[c.icon];
            return (
              <div key={c.id} className="rounded-2xl border border-border bg-surface shadow-card p-6">
                <h3 className="flex items-center gap-2.5 font-medium">
                  <Icon size={18} className="text-accent" aria-hidden="true" />
                  {c.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <li
                      key={s.name}
                      className={cn("rounded-md border px-2.5 py-1 text-sm", levelStyle[s.level])}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
