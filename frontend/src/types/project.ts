export interface ProjectTag {
  id: number;
  name: string;
  path: string;
}

export interface ProjectShot {
  src: string;
  caption?: string;
}

export interface ProjectVideo {
  src: string;
  poster?: string;
}

export interface Project {
  slug: string;
  title: string;
  desc: string;
  summary: string;
  href: string;
  logo: string;
  cover: string;
  tags: ProjectTag[];
  video?: ProjectVideo;
  shots: ProjectShot[];
}
