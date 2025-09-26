import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { EmailTemplate } from '../../core/models/template.model';
import { EmailBuilderService } from '../../core/services/email-builder.service';

@Component({
  selector: 'app-template-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="template-library-container">
      <!-- Header Toolbar -->
      <mat-toolbar class="header-toolbar">
        <span class="title">Template Library</span>
        <div class="toolbar-actions">
          <button mat-button (click)="saveCurrentTemplate()">
            <mat-icon>save</mat-icon>
            Save Current
          </button>
          <button mat-button routerLink="/email-builder">
            <mat-icon>add</mat-icon>
            New Template
          </button>
        </div>
      </mat-toolbar>

      <!-- Templates Grid -->
      <div class="templates-content">
        <mat-grid-list cols="3" rowHeight="300px" gutterSize="24px">
          <!-- Default Templates -->
          <mat-grid-tile *ngFor="let template of defaultTemplates(); trackBy: trackById">
            <mat-card class="template-card">
              <div class="template-preview">
                <mat-icon class="preview-icon">email</mat-icon>
              </div>
              <mat-card-header>
                <mat-card-title class="template-title">{{ template.name }}</mat-card-title>
                <mat-card-subtitle>{{ template.description }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions align="end">
                <button mat-button (click)="loadTemplate(template)">
                  <mat-icon>edit</mat-icon>
                  Use Template
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-grid-tile>

          <!-- Custom Templates -->
          <mat-grid-tile *ngFor="let template of customTemplates(); trackBy: trackById">
            <mat-card class="template-card custom">
              <div class="template-preview">
                <mat-icon class="preview-icon">description</mat-icon>
              </div>
              <mat-card-header>
                <mat-card-title class="template-title">{{ template.name }}</mat-card-title>
                <mat-card-subtitle>{{ template.description }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions align="end">
                <button mat-button (click)="loadTemplate(template)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-button color="warn" (click)="deleteTemplate(template.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-grid-tile>

          <!-- Add New Template Card -->
          <mat-grid-tile>
            <mat-card class="template-card add-new" (click)="createNewTemplate()">
              <div class="add-new-content">
                <mat-icon class="add-icon">add_circle_outline</mat-icon>
                <h3>Create New Template</h3>
                <p>Start from scratch</p>
              </div>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <!-- Empty State -->
        <div *ngIf="customTemplates().length === 0 && defaultTemplates().length === 0" class="empty-state">
          <mat-icon class="empty-icon">folder_open</mat-icon>
          <h3>No Templates Yet</h3>
          <p>Create your first email template to get started.</p>
          <button mat-raised-button color="primary" (click)="createNewTemplate()">
            <mat-icon>add</mat-icon>
            Create Template
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-library-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header-toolbar {
      background: #1976d2;
      color: white;
    }

    .title {
      flex: 1;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }

    .templates-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: #fafafa;
    }

    .template-card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .template-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .template-card.custom {
      border-left: 4px solid #4caf50;
    }

    .template-preview {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      margin: 16px;
      border-radius: 8px;
    }

    .preview-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #999;
    }

    .template-title {
      font-size: 16px;
      font-weight: 600;
    }

    .add-new {
      border: 2px dashed #ccc;
      background: transparent;
    }

    .add-new:hover {
      border-color: #1976d2;
      background: rgba(25, 118, 210, 0.05);
    }

    .add-new-content {
      text-align: center;
      color: #666;
    }

    .add-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #1976d2;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #666;
    }

    .empty-icon {
      font-size: 96px;
      width: 96px;
      height: 96px;
      margin-bottom: 24px;
      opacity: 0.5;
    }
  `]
})
export class TemplateLibraryComponent {
  private readonly builderService = inject(EmailBuilderService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly defaultTemplates = signal<EmailTemplate[]>([
    {
      id: 'newsletter-basic',
      name: 'Newsletter Basic',
      description: 'Simple newsletter template with header and content sections',
      components: [],
      theme: 'default',
      metadata: { category: 'newsletter', tags: ['basic', 'newsletter'] },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'announcement',
      name: 'Announcement',
      description: 'Template for announcements and updates',
      components: [],
      theme: 'company-green',
      metadata: { category: 'announcement', tags: ['announcement', 'update'] },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  protected readonly customTemplates = signal<EmailTemplate[]>(this.builderService.getSavedTemplates());

  loadTemplate(template: EmailTemplate): void {
    this.builderService.loadTemplate(template);
    this.router.navigate(['/email-builder']);
  }

  deleteTemplate(templateId: string): void {
    this.builderService.deleteTemplate(templateId);
    this.customTemplates.set(this.builderService.getSavedTemplates());
  }

  saveCurrentTemplate(): void {
    const components = this.builderService.components();
    if (components.length === 0) {
      return;
    }

    const templateName = prompt('Enter template name:', 'Custom Template');
    if (templateName && templateName.trim()) {
      const template = this.builderService.saveTemplate(templateName.trim(), 'Saved from current work');
      this.customTemplates.set(this.builderService.getSavedTemplates());
      alert(`Template "${template.name}" saved successfully!`);
    }
  }

  createNewTemplate(): void {
    this.builderService.clearCanvas();
    this.router.navigate(['/email-builder']);
  }

  trackById(index: number, template: EmailTemplate): string {
    return template.id;
  }
}