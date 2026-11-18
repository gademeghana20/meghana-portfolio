import { Mail } from "lucide-react";
import type { SocialLinks } from "@/types/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { displayUrl } from "@/lib/social-platforms";
import { stagger } from "@/lib/utilities/stagger";

export function Contact({ social }: { social: SocialLinks }) {
  const card =
    "lift flex h-full items-center gap-4 rounded-2xl border border-border bg-surface shadow-card p-5";

  const cards = [
    social.email && (
      <a key="email" href={`mailto:${social.email}`} className={card}>
        <Mail className="shrink-0 text-accent" size={22} aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-xs text-muted">Email</span>
          <span className="block truncate text-sm">{social.email}</span>
        </span>
      </a>
    ),
    ...social.links.map((l) => (
      <a key={l.id} href={l.url} className={card} target="_blank" rel="noopener noreferrer">
        <SocialIcon platform={l.platform} className="size-[22px] shrink-0 text-accent" />
        <span className="min-w-0">
          <span className="block text-xs text-muted">{l.label}</span>
          <span className="block truncate text-sm">{displayUrl(l.url)}</span>
        </span>
      </a>
    )),
  ].filter(Boolean);

  return (
    <section id="contact" className="py-16">
      <Container>
        <SectionHeading eyebrow="Contact" title="Let's get in touch" />
        <Reveal>
          <p className="mb-8 max-w-xl text-lg text-muted">
            I&apos;m open to software engineering opportunities and conversations about
            building and AI. The best way to reach me is by email or through the links below.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={i} delay={stagger(i % 3)} className="h-full">
              {c}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
