import { Mail } from "lucide-react";
import type { Profile, SocialLinks } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ButtonLink, Container } from "@/components/ui/primitives";

export function Hero({
  profile,
  social,
  resumeUrl,
}: {
  profile: Profile;
  social: SocialLinks;
  resumeUrl: string | null;
}) {
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  const iconLink =
    "inline-flex size-10 items-center justify-center rounded-full border border-border text-muted hover:-translate-y-0.5 hover:border-accent hover:text-accent";

  return (
    <section id="home" className="relative overflow-hidden">
      <Container className="grid items-center gap-14 py-16 sm:py-24 md:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="rise inline-block rounded-full bg-peach-soft px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
            {profile.designation}
          </p>
          <h1 className="rise mt-6 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.4rem]" style={{ "--delay": "100ms" } as React.CSSProperties}>
            {profile.headline}
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted" style={{ "--delay": "220ms" } as React.CSSProperties}>
            {profile.intro}
          </p>

          <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--delay": "340ms" } as React.CSSProperties}>
            {resumeUrl && (
              <ButtonLink href={resumeUrl} variant="primary">
                Download Resume
              </ButtonLink>
            )}
            <ButtonLink href="#projects" variant={resumeUrl ? "secondary" : "primary"}>
              View Projects
            </ButtonLink>
            <ButtonLink href="#contact">
              <Mail size={16} aria-hidden="true" /> Contact Me
            </ButtonLink>
          </div>

          <div className="rise mt-8 flex items-center gap-3" style={{ "--delay": "460ms" } as React.CSSProperties}>
            {social.github && (
              <a href={social.github} aria-label="GitHub profile" className={iconLink} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-5" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} aria-label="LinkedIn profile" className={iconLink} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="size-5" />
              </a>
            )}
          </div>
        </div>

        {/* Photo placeholder: layered earth-tone arch until a photo is added. */}
        <div aria-hidden="true" className="rise relative mx-auto hidden w-64 md:block lg:w-72" style={{ "--delay": "250ms" } as React.CSSProperties}>
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2rem] bg-sage-soft" />
          <div className="absolute inset-0 -translate-x-2 translate-y-2 rounded-t-full rounded-b-[2rem] bg-sun-soft" />
          <div className="relative flex aspect-[3/4] items-center justify-center rounded-t-full rounded-b-[2rem] border border-border bg-rose-soft">
            <span className="font-display text-7xl text-accent">{initials}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
