export interface ExperienceGroup {
  label?: string;
  href?: string;
  description?: string;
  points: string[];
}

export interface ExperienceRole {
  title: string;
  duration?: string;
  summary?: string;
  groups: ExperienceGroup[];
}

export interface Experience {
  id: number;
  company: string;
  logo: string;
  location: string;
  duration: string;
  roles: ExperienceRole[];
}
