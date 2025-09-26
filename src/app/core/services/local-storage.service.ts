import { Injectable } from '@angular/core';
import { EmailTemplate } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly TEMPLATES_KEY = 'email-builder-templates';
  private readonly CURRENT_WORK_KEY = 'email-builder-current-work';
  private readonly AUTO_SAVE_KEY = 'email-builder-auto-save';

  saveTemplate(template: EmailTemplate): void {
    const templates = this.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);

    if (existingIndex >= 0) {
      templates[existingIndex] = { ...template, updatedAt: new Date() };
    } else {
      templates.push(template);
    }

    this.setItem(this.TEMPLATES_KEY, templates);
  }

  getTemplates(): EmailTemplate[] {
    const templates = this.getItem<EmailTemplate[]>(this.TEMPLATES_KEY);
    return templates ? templates.map(t => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    })) : [];
  }

  deleteTemplate(templateId: string): void {
    const templates = this.getTemplates().filter(t => t.id !== templateId);
    this.setItem(this.TEMPLATES_KEY, templates);
  }

  getTemplate(templateId: string): EmailTemplate | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === templateId) || null;
  }

  // Auto-save current work
  saveCurrentWork(template: Partial<EmailTemplate>): void {
    this.setItem(this.AUTO_SAVE_KEY, {
      ...template,
      lastSaved: new Date()
    });
  }

  getCurrentWork(): (Partial<EmailTemplate> & { lastSaved?: Date }) | null {
    const work = this.getItem<Partial<EmailTemplate> & { lastSaved?: string }>(this.AUTO_SAVE_KEY);
    return work ? {
      ...work,
      lastSaved: work.lastSaved ? new Date(work.lastSaved) : undefined
    } : null;
  }

  clearCurrentWork(): void {
    this.removeItem(this.AUTO_SAVE_KEY);
  }

  // Generic localStorage methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  // Export/Import functionality
  exportTemplates(): string {
    const templates = this.getTemplates();
    return JSON.stringify(templates, null, 2);
  }

  importTemplates(jsonData: string): boolean {
    try {
      const templates = JSON.parse(jsonData) as EmailTemplate[];
      const currentTemplates = this.getTemplates();

      // Merge templates, avoiding duplicates by ID
      const mergedTemplates = [...currentTemplates];
      templates.forEach(newTemplate => {
        const existingIndex = mergedTemplates.findIndex(t => t.id === newTemplate.id);
        if (existingIndex >= 0) {
          mergedTemplates[existingIndex] = newTemplate;
        } else {
          mergedTemplates.push(newTemplate);
        }
      });

      this.setItem(this.TEMPLATES_KEY, mergedTemplates);
      return true;
    } catch (error) {
      console.error('Error importing templates:', error);
      return false;
    }
  }
}