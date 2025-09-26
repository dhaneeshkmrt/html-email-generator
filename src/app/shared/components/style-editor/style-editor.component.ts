import { Component, Input, Output, EventEmitter, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { ComponentStyles, EmailComponent } from '../../../core/models/component.model';
import { CSSValidatorService, CSSValidationResult } from '../../../core/services/css-validator.service';

@Component({
  selector: 'app-style-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="style-editor" *ngIf="component">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Style Editor</mat-card-title>
          <mat-card-subtitle>{{ component.type | uppercase }} Component</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <!-- Typography Tab -->
            <mat-tab label="Typography">
              <div class="tab-content">
                <mat-form-field appearance="outline">
                  <mat-label>Font Family</mat-label>
                  <mat-select [(value)]="styles().fontFamily" (selectionChange)="updateStyle('fontFamily', $event.value)">
                    <mat-option value="Arial, sans-serif">Arial</mat-option>
                    <mat-option value="Georgia, serif">Georgia</mat-option>
                    <mat-option value="'Times New Roman', serif">Times New Roman</mat-option>
                    <mat-option value="Verdana, sans-serif">Verdana</mat-option>
                    <mat-option value="'Courier New', monospace">Courier New</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Font Size</mat-label>
                  <input matInput
                         type="text"
                         [(ngModel)]="styles().fontSize"
                         (blur)="updateStyle('fontSize', $event.target.value)"
                         placeholder="16px">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Font Weight</mat-label>
                  <mat-select [(value)]="styles().fontWeight" (selectionChange)="updateStyle('fontWeight', $event.value)">
                    <mat-option value="normal">Normal</mat-option>
                    <mat-option value="bold">Bold</mat-option>
                    <mat-option value="100">100</mat-option>
                    <mat-option value="300">300</mat-option>
                    <mat-option value="400">400</mat-option>
                    <mat-option value="500">500</mat-option>
                    <mat-option value="600">600</mat-option>
                    <mat-option value="700">700</mat-option>
                    <mat-option value="900">900</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Text Align</mat-label>
                  <mat-select [(value)]="styles().textAlign" (selectionChange)="updateStyle('textAlign', $event.value)">
                    <mat-option value="left">Left</mat-option>
                    <mat-option value="center">Center</mat-option>
                    <mat-option value="right">Right</mat-option>
                    <mat-option value="justify">Justify</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Text Decoration</mat-label>
                  <mat-select [(value)]="styles().textDecoration" (selectionChange)="updateStyle('textDecoration', $event.value)">
                    <mat-option value="none">None</mat-option>
                    <mat-option value="underline">Underline</mat-option>
                    <mat-option value="overline">Overline</mat-option>
                    <mat-option value="line-through">Line Through</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Line Height</mat-label>
                  <input matInput
                         type="text"
                         [(ngModel)]="styles().lineHeight"
                         (blur)="updateStyle('lineHeight', $event.target.value)"
                         placeholder="1.5">
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- Colors Tab -->
            <mat-tab label="Colors">
              <div class="tab-content">
                <div class="color-section">
                  <h4>Text Color</h4>
                  <div class="color-input-group">
                    <input type="color"
                           [value]="getColorValue(styles().color)"
                           (change)="updateStyle('color', $event.target.value)"
                           class="color-picker">
                    <mat-form-field appearance="outline">
                      <mat-label>Color Value</mat-label>
                      <input matInput
                             [(ngModel)]="styles().color"
                             (blur)="updateStyle('color', $event.target.value)"
                             placeholder="#000000">
                    </mat-form-field>
                  </div>
                </div>

                <div class="color-section">
                  <h4>Background Color</h4>
                  <div class="color-input-group">
                    <input type="color"
                           [value]="getColorValue(styles().backgroundColor)"
                           (change)="updateStyle('backgroundColor', $event.target.value)"
                           class="color-picker">
                    <mat-form-field appearance="outline">
                      <mat-label>Background Color</mat-label>
                      <input matInput
                             [(ngModel)]="styles().backgroundColor"
                             (blur)="updateStyle('backgroundColor', $event.target.value)"
                             placeholder="#ffffff">
                    </mat-form-field>
                  </div>
                </div>

                <div class="color-section">
                  <h4>Border Color</h4>
                  <div class="color-input-group">
                    <input type="color"
                           [value]="getColorValue(styles().borderColor)"
                           (change)="updateStyle('borderColor', $event.target.value)"
                           class="color-picker">
                    <mat-form-field appearance="outline">
                      <mat-label>Border Color</mat-label>
                      <input matInput
                             [(ngModel)]="styles().borderColor"
                             (blur)="updateStyle('borderColor', $event.target.value)"
                             placeholder="#cccccc">
                    </mat-form-field>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Spacing Tab -->
            <mat-tab label="Spacing">
              <div class="tab-content">
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Padding</mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="spacing-controls">
                    <mat-form-field appearance="outline">
                      <mat-label>All Sides</mat-label>
                      <input matInput
                             [(ngModel)]="styles().padding"
                             (blur)="updateStyle('padding', $event.target.value)"
                             placeholder="16px">
                    </mat-form-field>

                    <div class="individual-sides">
                      <mat-form-field appearance="outline">
                        <mat-label>Top</mat-label>
                        <input matInput
                               [(ngModel)]="styles().paddingTop"
                               (blur)="updateStyle('paddingTop', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Right</mat-label>
                        <input matInput
                               [(ngModel)]="styles().paddingRight"
                               (blur)="updateStyle('paddingRight', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Bottom</mat-label>
                        <input matInput
                               [(ngModel)]="styles().paddingBottom"
                               (blur)="updateStyle('paddingBottom', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Left</mat-label>
                        <input matInput
                               [(ngModel)]="styles().paddingLeft"
                               (blur)="updateStyle('paddingLeft', $event.target.value)">
                      </mat-form-field>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Margin</mat-panel-title>
                  </mat-expansion-panel-header>

                  <div class="spacing-controls">
                    <mat-form-field appearance="outline">
                      <mat-label>All Sides</mat-label>
                      <input matInput
                             [(ngModel)]="styles().margin"
                             (blur)="updateStyle('margin', $event.target.value)"
                             placeholder="16px">
                    </mat-form-field>

                    <div class="individual-sides">
                      <mat-form-field appearance="outline">
                        <mat-label>Top</mat-label>
                        <input matInput
                               [(ngModel)]="styles().marginTop"
                               (blur)="updateStyle('marginTop', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Right</mat-label>
                        <input matInput
                               [(ngModel)]="styles().marginRight"
                               (blur)="updateStyle('marginRight', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Bottom</mat-label>
                        <input matInput
                               [(ngModel)]="styles().marginBottom"
                               (blur)="updateStyle('marginBottom', $event.target.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Left</mat-label>
                        <input matInput
                               [(ngModel)]="styles().marginLeft"
                               (blur)="updateStyle('marginLeft', $event.target.value)">
                      </mat-form-field>
                    </div>
                  </div>
                </mat-expansion-panel>
              </div>
            </mat-tab>

            <!-- Border Tab -->
            <mat-tab label="Border">
              <div class="tab-content">
                <mat-form-field appearance="outline">
                  <mat-label>Border Width</mat-label>
                  <input matInput
                         [(ngModel)]="styles().borderWidth"
                         (blur)="updateStyle('borderWidth', $event.target.value)"
                         placeholder="1px">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Border Style</mat-label>
                  <mat-select [(value)]="styles().borderStyle" (selectionChange)="updateStyle('borderStyle', $event.value)">
                    <mat-option value="none">None</mat-option>
                    <mat-option value="solid">Solid</mat-option>
                    <mat-option value="dashed">Dashed</mat-option>
                    <mat-option value="dotted">Dotted</mat-option>
                    <mat-option value="double">Double</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Border Radius</mat-label>
                  <input matInput
                         [(ngModel)]="styles().borderRadius"
                         (blur)="updateStyle('borderRadius', $event.target.value)"
                         placeholder="4px">
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- Layout Tab -->
            <mat-tab label="Layout">
              <div class="tab-content">
                <mat-form-field appearance="outline">
                  <mat-label>Width</mat-label>
                  <input matInput
                         [(ngModel)]="styles().width"
                         (blur)="updateStyle('width', $event.target.value)"
                         placeholder="auto">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Height</mat-label>
                  <input matInput
                         [(ngModel)]="styles().height"
                         (blur)="updateStyle('height', $event.target.value)"
                         placeholder="auto">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Display</mat-label>
                  <mat-select [(value)]="styles().display" (selectionChange)="updateStyle('display', $event.value)">
                    <mat-option value="block">Block</mat-option>
                    <mat-option value="inline">Inline</mat-option>
                    <mat-option value="inline-block">Inline Block</mat-option>
                    <mat-option value="table">Table</mat-option>
                    <mat-option value="table-cell">Table Cell</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- Effects Tab -->
            <mat-tab label="Effects">
              <div class="tab-content">
                <mat-form-field appearance="outline">
                  <mat-label>Box Shadow</mat-label>
                  <input matInput
                         [(ngModel)]="styles().boxShadow"
                         (blur)="updateStyle('boxShadow', $event.target.value)"
                         placeholder="0 2px 4px rgba(0,0,0,0.1)">
                  <mat-hint>Format: offset-x offset-y blur-radius color</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Opacity</mat-label>
                  <input matInput
                         type="number"
                         min="0"
                         max="1"
                         step="0.1"
                         [(ngModel)]="styles().opacity"
                         (blur)="updateStyle('opacity', $event.target.value)"
                         placeholder="1">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Transform</mat-label>
                  <input matInput
                         [(ngModel)]="styles().transform"
                         (blur)="updateStyle('transform', $event.target.value)"
                         placeholder="translateX(0px) rotateY(0deg)">
                  <mat-hint>Email clients may not support transforms</mat-hint>
                </mat-form-field>
              </div>
            </mat-tab>

            <!-- Custom CSS Tab -->
            <mat-tab label="Custom CSS">
              <div class="tab-content">
                <div class="custom-css-section">
                  <h4>Custom Properties</h4>
                  <div class="custom-property-list">
                    <div *ngFor="let prop of customProperties(); let i = index" class="custom-property-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Property</mat-label>
                        <input matInput
                               [(ngModel)]="prop.name"
                               (blur)="updateCustomProperty(i, prop.name, prop.value)">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Value</mat-label>
                        <input matInput
                               [(ngModel)]="prop.value"
                               (blur)="updateCustomProperty(i, prop.name, prop.value)">
                      </mat-form-field>
                      <button mat-icon-button color="warn" (click)="removeCustomProperty(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>

                  <button mat-button (click)="addCustomProperty()">
                    <mat-icon>add</mat-icon>
                    Add Property
                  </button>

                  <div *ngIf="validationResult()" class="validation-results">
                    <div *ngIf="validationResult()?.errors?.length" class="errors">
                      <h5>Errors:</h5>
                      <ul>
                        <li *ngFor="let error of validationResult()?.errors">{{ error }}</li>
                      </ul>
                    </div>

                    <div *ngIf="validationResult()?.warnings?.length" class="warnings">
                      <h5>Warnings:</h5>
                      <ul>
                        <li *ngFor="let warning of validationResult()?.warnings">{{ warning }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button (click)="resetStyles()">Reset</button>
          <button mat-button (click)="generateEmailSafe()">Email Safe</button>
          <button mat-raised-button color="primary" (click)="applyStyles()">Apply</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .style-editor {
      height: 100%;
      overflow-y: auto;
    }

    .tab-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .color-section {
      margin-bottom: 24px;
    }

    .color-section h4 {
      margin: 0 0 12px 0;
      color: #333;
    }

    .color-input-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .color-picker {
      width: 50px;
      height: 40px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .spacing-controls {
      padding: 16px;
    }

    .individual-sides {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .custom-css-section {
      padding: 16px;
    }

    .custom-property-list {
      margin: 16px 0;
    }

    .custom-property-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .validation-results {
      margin-top: 16px;
      padding: 16px;
      border-radius: 4px;
      background: #f5f5f5;
    }

    .errors {
      color: #d32f2f;
      margin-bottom: 16px;
    }

    .warnings {
      color: #ff9800;
    }

    .errors ul, .warnings ul {
      margin: 8px 0;
      padding-left: 20px;
    }
  `]
})
export class StyleEditorComponent implements OnInit {
  @Input() component: EmailComponent | null = null;
  @Output() styleChange = new EventEmitter<{ componentId: string; styles: ComponentStyles }>();

  protected readonly styles = signal<ComponentStyles>({});
  protected readonly customProperties = signal<Array<{ name: string; value: string }>>([]);
  protected readonly validationResult = signal<CSSValidationResult | null>(null);

  constructor(
    private cssValidator: CSSValidatorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.component) {
      this.styles.set({ ...this.component.styles });
      this.loadCustomProperties();
    }
  }

  updateStyle(property: keyof ComponentStyles, value: string | number) {
    if (this.component) {
      const updatedStyles = { ...this.styles(), [property]: value };
      this.styles.set(updatedStyles);
      this.styleChange.emit({ componentId: this.component.id, styles: updatedStyles });
    }
  }

  getColorValue(color: string | undefined): string {
    if (!color) return '#000000';

    // Convert named colors or ensure hex format
    if (color.startsWith('#')) return color;
    if (color.startsWith('rgb')) return '#000000'; // TODO: Convert RGB to hex

    // Handle named colors
    const namedColors: Record<string, string> = {
      'red': '#ff0000',
      'green': '#008000',
      'blue': '#0000ff',
      'white': '#ffffff',
      'black': '#000000'
    };

    return namedColors[color.toLowerCase()] || '#000000';
  }

  loadCustomProperties() {
    const customStyles = this.styles().customStyles || {};
    const props = Object.entries(customStyles).map(([name, value]) => ({ name, value: value as string }));
    this.customProperties.set(props);

    if (Object.keys(customStyles).length > 0) {
      const validation = this.cssValidator.validateCustomCSS(customStyles);
      this.validationResult.set(validation);
    }
  }

  addCustomProperty() {
    const current = this.customProperties();
    this.customProperties.set([...current, { name: '', value: '' }]);
  }

  removeCustomProperty(index: number) {
    const current = this.customProperties();
    current.splice(index, 1);
    this.customProperties.set([...current]);
    this.updateCustomStyles();
  }

  updateCustomProperty(index: number, name: string, value: string) {
    const current = this.customProperties();
    current[index] = { name, value };
    this.customProperties.set([...current]);
    this.updateCustomStyles();
  }

  private updateCustomStyles() {
    const customStyles: Record<string, string> = {};

    this.customProperties().forEach(prop => {
      if (prop.name && prop.value) {
        customStyles[prop.name] = prop.value;
      }
    });

    const validation = this.cssValidator.validateCustomCSS(customStyles);
    this.validationResult.set(validation);

    if (validation.isValid && this.component) {
      const updatedStyles = { ...this.styles(), customStyles };
      this.styles.set(updatedStyles);
      this.styleChange.emit({ componentId: this.component.id, styles: updatedStyles });
    }
  }

  resetStyles() {
    if (this.component) {
      // This would need to call the EmailBuilderService to reset to default styles
      this.snackBar.open('Styles reset to default', 'Close', { duration: 3000 });
    }
  }

  generateEmailSafe() {
    if (this.component) {
      const safeStyles = this.cssValidator.generateEmailSafeCSS(this.styles());
      this.styles.set(safeStyles);
      this.styleChange.emit({ componentId: this.component.id, styles: safeStyles });
      this.snackBar.open('Converted to email-safe styles', 'Close', { duration: 3000 });
    }
  }

  applyStyles() {
    if (this.component) {
      this.styleChange.emit({ componentId: this.component.id, styles: this.styles() });
      this.snackBar.open('Styles applied successfully', 'Close', { duration: 3000 });
    }
  }
}