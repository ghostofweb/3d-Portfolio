export interface ProjectTag {
  id: number;
  name: string;
  path: string;
}

export interface Project {
  title: string;
  desc: string;
  href: string;
  logo: string;
  tags: ProjectTag[];
}
