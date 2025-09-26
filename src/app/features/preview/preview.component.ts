import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { EmailBuilderService } from '../../core/services/email-builder.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="preview-container">
      <!-- Header Toolbar -->
      <mat-toolbar class="header-toolbar">
        <span class="title">Email Preview</span>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="device-selector">
            <mat-label>Device</mat-label>
            <mat-select [(value)]="selectedDevice">
              <mat-option value="desktop">Desktop</mat-option>
              <mat-option value="tablet">Tablet</mat-option>
              <mat-option value="mobile">Mobile</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-button routerLink="/email-builder">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button (click)="exportHTML()">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
      </mat-toolbar>

      <!-- Preview Content -->
      <div class="preview-content">
        <div class="preview-wrapper" [ngClass]="'device-' + selectedDevice">
          <div class="preview-frame">
            <div [innerHTML]="previewHTML" class="email-content"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-container {
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
      align-items: center;
      gap: 16px;
    }

    .device-selector {
      width: 120px;
    }

    .device-selector ::ng-deep .mat-mdc-form-field-infix {
      color: white;
    }

    .device-selector ::ng-deep .mat-mdc-select-arrow {
      color: white;
    }

    .preview-content {
      flex: 1;
      background: #f5f5f5;
      padding: 24px;
      overflow: auto;
    }

    .preview-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .preview-frame {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .device-desktop .preview-frame {
      width: 600px;
      min-height: 400px;
    }

    .device-tablet .preview-frame {
      width: 480px;
      min-height: 400px;
    }

    .device-mobile .preview-frame {
      width: 320px;
      min-height: 400px;
    }

    .email-content {
      padding: 24px;
      font-family: Arial, sans-serif;
    }
  `]
})
export class PreviewComponent {
  protected readonly builderService = inject(EmailBuilderService);
  private readonly exportService = inject(ExportService);
  private readonly sanitizer = inject(DomSanitizer);

  protected selectedDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  get previewHTML(): SafeHtml {
    const components = this.builderService.components();
    const html = this.exportService.exportToRawHTML(components);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  exportHTML(): void {
    const components = this.builderService.components();
    const html = this.exportService.exportToHTML(components);
    this.exportService.downloadAsFile(html, 'email-template.html');
  }
}