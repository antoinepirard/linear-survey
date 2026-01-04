export interface Chapter {
  id: string;
  number: number;
  title: string;
  icon?: string;
  content: string;
}

export interface ManualConfig {
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

