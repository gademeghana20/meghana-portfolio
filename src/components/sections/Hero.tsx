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

  return (
    <section id="home" className="relative">
      <Container className="grid items-center gap-12 py-20 sm:py-28 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-sm text-accent">{profile.designation}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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

          <div className="mt-8 flex items-center gap-4 text-muted">
            {social.github && (
              <a href={social.github} aria-label="GitHub profile" className="hover:text-accent" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-6" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} aria-label="LinkedIn profile" className="hover:text-accent" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="size-6" />
              </a>
            )}
          </div>
        </div>

        {/* Photo placeholder: replaced by an uploaded photo from the admin later. */}
        <div
          aria-hidden="true"
          className="hidden size-56 items-center justify-center rounded-full border border-border bg-surface text-6xl font-semibold text-accent md:flex"
        >
          {initials}
        </div>
      </Container>
    </section>
  );
}
