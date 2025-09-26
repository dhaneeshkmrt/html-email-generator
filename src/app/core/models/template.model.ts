import { EmailComponent } from './component.model';

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  components: EmailComponent[];
  theme: string;
  metadata: TemplateMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateMetadata {
  author?: string;
  category?: string;
  tags?: string[];
  version?: string;
  isPublic?: boolean;
}