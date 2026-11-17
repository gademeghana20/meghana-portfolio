import { ArrowUp, Mail } from "lucide-react";
import type { SocialLinks } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/primitives";
import { CopyrightYear } from "./CopyrightYear";

export function Footer({ name, social }: { name: string; social: SocialLinks }) {
  const iconLink = "text-muted transition-colors hover:text-accent";

  return (
    <footer className="mt-24 border-t border-border py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-medium">{name}</p>
          <p className="mt-1 text-sm text-muted">
            © <CopyrightYear /> {name}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-5">
          {social.github && (
            <a href={social.github} className={iconLink} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-5" />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} className={iconLink} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <LinkedinIcon className="size-5" />
            </a>
          )}
          {social.email && (
            <a href={`mailto:${social.email}`} className={iconLink} aria-label="Email">
              <Mail className="size-5" aria-hidden="true" />
            </a>
          )}
          <a
            href="#home"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent"
          >
            <ArrowUp size={14} aria-hidden="true" /> Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
