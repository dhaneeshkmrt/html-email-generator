import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { EmailBuilderService } from '../../core/services/email-builder.service';
import { ThemeService } from '../../core/services/theme.service';
import { ExportService } from '../../core/services/export.service';
import { ComponentType, EmailComponent } from '../../core/models/component.model';

@Component({
  selector: 'app-email-builder',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="email-builder-container">
      <!-- Header Toolbar -->
      <mat-toolbar class="header-toolbar">
        <span class="title">Email Builder</span>
        <div class="toolbar-actions">
          <button mat-button (click)="clearCanvas()">
            <mat-icon>clear</mat-icon>
            Clear
          </button>
          <button mat-button (click)="exportHTML()">
            <mat-icon>download</mat-icon>
            Export HTML
          </button>
        </div>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <!-- Left Panel - Component Library -->
        <mat-sidenav mode="side" opened position="start" class="left-panel">
          <div class="panel-header">
            <h3>Components</h3>
          </div>
          <div class="component-library"
               cdkDropList
               cdkDropListSortingDisabled
               [cdkDropListData]="availableComponents"
               [cdkDropListConnectedTo]="['canvas-drop-list']">
            <div
              class="component-item"
              *ngFor="let componentType of availableComponents; trackBy: trackByType"
              cdkDrag
              [cdkDragData]="componentType"
              (cdkDragStarted)="onDragStart(componentType)"
              (cdkDragEnded)="onDragEnd()"
            >
              <mat-icon>{{ componentType.icon }}</mat-icon>
              <span>{{ componentType.label }}</span>
            </div>
          </div>
        </mat-sidenav>

        <!-- Main Content - Canvas -->
        <mat-sidenav-content class="main-content">
          <div class="canvas-container">
            <div
              class="canvas"
              cdkDropList
              id="canvas-drop-list"
              [cdkDropListData]="builderService.components()"
              (cdkDropListDropped)="onCanvasDrop($event)"
            >
              <div
                *ngFor="let component of builderService.components(); trackBy: trackById; let i = index"
                class="canvas-component"
                [class.selected]="builderService.selectedComponent()?.id === component.id"
                cdkDrag
                [cdkDragData]="component"
                (click)="selectComponent(component)"
                (keyup.enter)="selectComponent(component)"
                (keyup.space)="selectComponent(component)"
                tabindex="0"
              >
                <div class="component-content" [ngSwitch]="component.type">
                  <!-- Text Component -->
                  <p *ngSwitchCase="ComponentType.TEXT"
                     [ngStyle]="component.styles">
                    {{ component.properties.content }}
                  </p>

                  <!-- TextArea Component -->
                  <div *ngSwitchCase="ComponentType.TEXTAREA"
                       [ngStyle]="component.styles"
                       [innerHTML]="component.properties.content">
                  </div>

                  <!-- Link Component -->
                  <a *ngSwitchCase="ComponentType.LINK"
                     [href]="component.properties.url"
                     [ngStyle]="component.styles">
                    {{ component.properties.content }}
                  </a>

                  <!-- Image Component -->
                  <img *ngSwitchCase="ComponentType.IMAGE"
                       [src]="component.properties.src || '/assets/placeholder-image.svg'"
                       [alt]="component.properties.alt"
                       [ngStyle]="component.styles">

                  <!-- Code Component -->
                  <pre *ngSwitchCase="ComponentType.CODE"
                       [ngStyle]="component.styles"><code>{{ component.properties.content }}</code></pre>

                  <!-- Button Component -->
                  <a *ngSwitchCase="ComponentType.BUTTON"
                     [href]="component.properties.url"
                     [ngStyle]="component.styles"
                     class="button-component">
                    {{ component.properties.content }}
                  </a>

                  <!-- Divider Component -->
                  <hr *ngSwitchCase="ComponentType.DIVIDER"
                      [ngStyle]="component.styles">

                  <!-- Container Component -->
                  <div *ngSwitchCase="ComponentType.CONTAINER"
                       [ngStyle]="component.styles">
                    <!-- Nested components would go here -->
                  </div>
                </div>

                <!-- Component Actions -->
                <div class="component-actions" *ngIf="builderService.selectedComponent()?.id === component.id">
                  <button mat-mini-fab (click)="deleteComponent(component.id)" class="delete-btn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="builderService.components().length === 0" class="empty-state">
                <mat-icon class="empty-icon">email</mat-icon>
                <h3>Start Building Your Email</h3>
                <p>Drag components from the left panel to start building your email template.</p>
              </div>
            </div>
          </div>
        </mat-sidenav-content>

        <!-- Right Panel - Style Inspector -->
        <mat-sidenav mode="side" opened position="end" class="right-panel">
          <div class="panel-header">
            <h3>Style Inspector</h3>
          </div>
          <div class="style-inspector">
            <div *ngIf="builderService.selectedComponent(); else noSelection">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ getComponentTypeLabel(builderService.selectedComponent()!.type) }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <!-- Style controls will be implemented in the next phase -->
                  <p>Style controls coming soon...</p>
                </mat-card-content>
              </mat-card>
            </div>
            <ng-template #noSelection>
              <div class="no-selection">
                <mat-icon>style</mat-icon>
                <p>Select a component to edit its styles</p>
              </div>
            </ng-template>
          </div>
        </mat-sidenav>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .email-builder-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header-toolbar {
      background: #1976d2;
      color: white;
      z-index: 10;
    }

    .title {
      flex: 1;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }

    .sidenav-container {
      flex: 1;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }

    .left-panel, .right-panel {
      width: 280px;
      background: white;
      border-right: 1px solid #e0e0e0;
    }

    .right-panel {
      border-right: none;
      border-left: 1px solid #e0e0e0;
    }

    .panel-header {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #f5f5f5;
    }

    .panel-header h3 {
      margin: 0;
      color: #333;
    }

    .component-library {
      padding: 16px;
    }

    .component-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      cursor: grab;
      transition: all 0.2s;
    }

    .component-item:hover {
      background: #e9ecef;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .component-item.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .main-content {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }

    .canvas-container {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .canvas {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      min-height: 400px;
      padding: 24px;
    }

    .canvas-component {
      position: relative;
      margin-bottom: 16px;
      border: 2px solid transparent;
      border-radius: 4px;
      padding: 8px;
      transition: all 0.2s;
    }

    .canvas-component:hover {
      border-color: #e0e0e0;
    }

    .canvas-component.selected {
      border-color: #1976d2;
      background: rgba(25, 118, 210, 0.05);
    }

    .canvas-component.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .component-content {
      pointer-events: none;
    }

    .component-actions {
      position: absolute;
      top: -12px;
      right: -12px;
      display: flex;
      gap: 4px;
    }

    .delete-btn {
      background: #f44336 !important;
      color: white;
      width: 24px;
      height: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .style-inspector {
      padding: 16px;
    }

    .no-selection {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-selection mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .button-component {
      display: inline-block;
      text-decoration: none;
    }

    .cdk-drop-list-receiving .cdk-drag {
      background: rgba(25, 118, 210, 0.1);
    }

    /* Drag and Drop Global Styles */
    ::ng-deep .cdk-drag-preview {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
      border-radius: 6px !important;
      z-index: 9999 !important;
      position: fixed !important;
      background: white !important;
      padding: 12px !important;
      border: 2px solid #1976d2 !important;
      opacity: 0.9 !important;
    }

    ::ng-deep .cdk-drag-placeholder {
      background: rgba(25, 118, 210, 0.1);
      border: 2px dashed #1976d2;
      border-radius: 6px;
      min-height: 48px;
      margin: 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
      font-weight: 500;
    }

    ::ng-deep .cdk-drag-placeholder::after {
      content: 'Drop component here';
    }

    ::ng-deep .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class EmailBuilderComponent {
  protected readonly builderService = inject(EmailBuilderService);
  protected readonly themeService = inject(ThemeService);
  private readonly exportService = inject(ExportService);

  protected readonly ComponentType = ComponentType;

  protected readonly availableComponents = [
    { type: ComponentType.TEXT, label: 'Text', icon: 'text_fields' },
    { type: ComponentType.TEXTAREA, label: 'Paragraph', icon: 'subject' },
    { type: ComponentType.LINK, label: 'Link', icon: 'link' },
    { type: ComponentType.IMAGE, label: 'Image', icon: 'image' },
    { type: ComponentType.CODE, label: 'Code Block', icon: 'code' },
    { type: ComponentType.BUTTON, label: 'Button', icon: 'smart_button' },
    { type: ComponentType.DIVIDER, label: 'Divider', icon: 'horizontal_rule' },
    { type: ComponentType.CONTAINER, label: 'Container', icon: 'crop_free' }
  ];

  onDragStart(componentType: { type: ComponentType }): void {
    const component = this.builderService.createComponentFromType(componentType.type);
    this.builderService.setDraggedComponent(component);
  }

  onDragEnd(): void {
    this.builderService.setDraggedComponent(null);
  }

  onCanvasDrop(event: CdkDragDrop<EmailComponent[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within canvas
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Adding from component library
      const componentType = event.item.data;
      if (componentType && componentType.type) {
        const newComponent = this.builderService.createComponentFromType(componentType.type);
        this.builderService.addComponent(newComponent, event.currentIndex);
      }
    }
  }

  selectComponent(component: EmailComponent): void {
    this.builderService.selectComponent(component);
  }

  deleteComponent(componentId: string): void {
    this.builderService.removeComponent(componentId);
  }

  clearCanvas(): void {
    this.builderService.clearCanvas();
  }

  exportHTML(): void {
    const components = this.builderService.components();
    const html = this.exportService.exportToHTML(components);
    this.exportService.downloadAsFile(html, 'email-template.html');
  }

  getComponentTypeLabel(type: ComponentType): string {
    const component = this.availableComponents.find(c => c.type === type);
    return component?.label || type;
  }

  trackByType(index: number, item: { type: ComponentType }): ComponentType {
    return item.type;
  }

  trackById(index: number, item: EmailComponent): string {
    return item.id;
  }
}