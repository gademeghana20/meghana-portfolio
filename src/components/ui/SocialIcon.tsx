import {
  AtSign,
  Camera,
  CodeXml,
  Globe,
  Link as LinkIcon,
  PenLine,
  Trophy,
  Video,
  type LucideIcon,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";

// Brand logos exist only for GitHub and LinkedIn; other platforms get a
// meaningful generic icon (the link's own label always names the platform).
const generic: Record<string, LucideIcon> = {
  website: Globe,
  blog: PenLine,
  x: AtSign,
  instagram: Camera,
  youtube: Video,
  leetcode: CodeXml,
  hackerrank: CodeXml,
  kaggle: Trophy,
  stackoverflow: CodeXml,
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  if (platform === "github") return <GithubIcon className={className} />;
  if (platform === "linkedin") return <LinkedinIcon className={className} />;
  const Icon = generic[platform] ?? LinkIcon;
  return <Icon className={className} aria-hidden="true" />;
}
