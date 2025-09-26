import { Injectable, signal, effect } from '@angular/core';
import { EmailComponent, ComponentType, ComponentProperties, ComponentStyles } from '../models/component.model';
import { EmailTemplate } from '../models/template.model';
import { LocalStorageService } from './local-storage.service';
import { CSSValidatorService } from './css-validator.service';

@Injectable({
  providedIn: 'root'
})
export class EmailBuilderService {
  private readonly _components = signal<EmailComponent[]>([]);
  private readonly _selectedComponent = signal<EmailComponent | null>(null);
  private readonly _draggedComponent = signal<EmailComponent | null>(null);
  private readonly _currentTemplate = signal<EmailTemplate | null>(null);

  readonly components = this._components.asReadonly();
  readonly selectedComponent = this._selectedComponent.asReadonly();
  readonly draggedComponent = this._draggedComponent.asReadonly();
  readonly currentTemplate = this._currentTemplate.asReadonly();

  constructor(
    private localStorageService: LocalStorageService,
    private cssValidator: CSSValidatorService
  ) {
    // Auto-save effect
    effect(() => {
      const components = this._components();
      if (components.length > 0) {
        this.autoSave();
      }
    });

    // Load any existing work on initialization
    this.loadCurrentWork();
  }

  addComponent(component: EmailComponent, index?: number): void {
    const components = this._components();
    if (index !== undefined) {
      components.splice(index, 0, component);
    } else {
      components.push(component);
    }
    this._components.set([...components]);
  }

  removeComponent(componentId: string): void {
    const components = this._components().filter(comp => comp.id !== componentId);
    this._components.set(components);

    if (this._selectedComponent()?.id === componentId) {
      this._selectedComponent.set(null);
    }
  }

  updateComponent(componentId: string, updates: Partial<EmailComponent>): void {
    const components = this._components().map(comp =>
      comp.id === componentId ? { ...comp, ...updates } : comp
    );
    this._components.set(components);
  }

  selectComponent(component: EmailComponent | null): void {
    this._selectedComponent.set(component);
  }

  setDraggedComponent(component: EmailComponent | null): void {
    this._draggedComponent.set(component);
  }

  moveComponent(fromIndex: number, toIndex: number): void {
    const components = [...this._components()];
    const [removed] = components.splice(fromIndex, 1);
    components.splice(toIndex, 0, removed);
    this._components.set(components);
  }

  clearCanvas(): void {
    this._components.set([]);
    this._selectedComponent.set(null);
  }

  createComponentFromType(type: ComponentType): EmailComponent {
    const component: EmailComponent = {
      id: this.generateId(),
      type,
      properties: this.getDefaultPropertiesForType(type) as ComponentProperties,
      styles: this.getDefaultStylesForType(type) as ComponentStyles
    };

    // Initialize children array for layout components
    if (type === ComponentType.CONTAINER || type === ComponentType.ROW || type === ComponentType.COLUMN) {
      component.children = [];
    }

    return component;
  }

  exportToTemplate(name: string, description?: string): EmailTemplate {
    return {
      id: this.generateId(),
      name,
      description,
      components: this._components(),
      theme: 'default',
      metadata: {
        category: 'custom',
        tags: ['email', 'template']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Template management methods
  saveTemplate(name: string, description?: string): EmailTemplate {
    const template = this.exportToTemplate(name, description);
    this.localStorageService.saveTemplate(template);
    this._currentTemplate.set(template);
    return template;
  }

  loadTemplate(template: EmailTemplate): void {
    this._components.set(template.components);
    this._selectedComponent.set(null);
    this._currentTemplate.set(template);
    this.localStorageService.clearCurrentWork();
  }

  getSavedTemplates(): EmailTemplate[] {
    return this.localStorageService.getTemplates();
  }

  deleteTemplate(templateId: string): void {
    this.localStorageService.deleteTemplate(templateId);
  }

  // Auto-save functionality
  private autoSave(): void {
    const template = {
      name: 'Auto-saved work',
      components: this._components(),
      theme: 'default'
    };
    this.localStorageService.saveCurrentWork(template);
  }

  private loadCurrentWork(): void {
    const savedWork = this.localStorageService.getCurrentWork();
    if (savedWork && savedWork.components && savedWork.components.length > 0) {
      this._components.set(savedWork.components);
    }
  }

  // Layout helper methods
  addComponentToContainer(containerId: string, component: EmailComponent): void {
    const components = this._components();
    const updatedComponents = this.addComponentToContainerRecursively(components, containerId, component);
    this._components.set(updatedComponents);
  }

  private addComponentToContainerRecursively(components: EmailComponent[], containerId: string, newComponent: EmailComponent): EmailComponent[] {
    return components.map(component => {
      if (component.id === containerId) {
        return {
          ...component,
          children: [...(component.children || []), newComponent]
        };
      }
      if (component.children) {
        return {
          ...component,
          children: this.addComponentToContainerRecursively(component.children, containerId, newComponent)
        };
      }
      return component;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultPropertiesForType(type: ComponentType): ComponentProperties {
    switch (type) {
      case ComponentType.TEXT:
        return { content: 'Sample text' };
      case ComponentType.TEXTAREA:
        return { content: 'Sample paragraph text...' };
      case ComponentType.LINK:
        return { content: 'Click here', url: 'https://example.com' };
      case ComponentType.IMAGE:
        return { src: '', alt: 'Image description' };
      case ComponentType.CODE:
        return { content: 'console.log("Hello World");', language: 'javascript' };
      case ComponentType.BUTTON:
        return { content: 'Button Text', url: '#' };
      case ComponentType.DIVIDER:
        return {};
      case ComponentType.CONTAINER:
        return {};
      case ComponentType.ROW:
        return {
          alignment: 'stretch',
          justification: 'start',
          columnGap: '16px'
        } as ComponentProperties;
      case ComponentType.COLUMN:
        return {
          columns: 2,
          columnGap: '16px',
          rowGap: '16px'
        } as ComponentProperties;
      default:
        return {} as ComponentProperties;
    }
  }

  // Enhanced styling methods
  updateComponentStyle(componentId: string, styleProperty: keyof ComponentStyles, value: string | number): void {
    const component = this.findComponentById(componentId);
    if (component) {
      const updatedStyles = { ...component.styles, [styleProperty]: value };
      this.updateComponent(componentId, { styles: updatedStyles });
    }
  }

  updateComponentCustomStyles(componentId: string, customStyles: Record<string, string>): void {
    const component = this.findComponentById(componentId);
    if (component) {
      // Validate custom styles
      const validation = this.cssValidator.validateCustomCSS(customStyles);

      if (validation.isValid) {
        const updatedStyles = {
          ...component.styles,
          customStyles: { ...component.styles.customStyles, ...customStyles }
        };
        this.updateComponent(componentId, { styles: updatedStyles });
      } else {
        console.warn('Invalid custom styles:', validation.errors);
        throw new Error(`Invalid CSS: ${validation.errors.join(', ')}`);
      }
    }
  }

  applyStylePreset(componentId: string, preset: ComponentStyles): void {
    const component = this.findComponentById(componentId);
    if (component) {
      // Merge preset with existing styles
      const mergedStyles = { ...component.styles, ...preset };
      this.updateComponent(componentId, { styles: mergedStyles });
    }
  }

  resetComponentStyles(componentId: string): void {
    const component = this.findComponentById(componentId);
    if (component) {
      const defaultStyles = this.getDefaultStylesForType(component.type);
      this.updateComponent(componentId, { styles: defaultStyles });
    }
  }

  copyStylesBetweenComponents(sourceId: string, targetId: string): void {
    const sourceComponent = this.findComponentById(sourceId);
    const targetComponent = this.findComponentById(targetId);

    if (sourceComponent && targetComponent) {
      this.updateComponent(targetId, { styles: { ...sourceComponent.styles } });
    }
  }

  generateEmailSafeStyles(componentId: string): void {
    const component = this.findComponentById(componentId);
    if (component) {
      const safeStyles = this.cssValidator.generateEmailSafeCSS(component.styles);
      this.updateComponent(componentId, { styles: safeStyles });
    }
  }

  private findComponentById(id: string, components?: EmailComponent[]): EmailComponent | null {
    const componentsToSearch = components || this._components();

    for (const component of componentsToSearch) {
      if (component.id === id) {
        return component;
      }

      if (component.children) {
        const found = this.findComponentById(id, component.children);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  private getDefaultStylesForType(type: ComponentType): ComponentStyles {
    switch (type) {
      case ComponentType.TEXT:
      case ComponentType.TEXTAREA:
        return {
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#111827',
          margin: '0 0 16px 0'
        } as ComponentStyles;
      case ComponentType.LINK:
        return {
          color: '#3b82f6',
          textDecoration: 'underline',
          fontSize: '16px'
        } as ComponentStyles;
      case ComponentType.BUTTON:
        return {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          textAlign: 'center',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500'
        } as ComponentStyles;
      case ComponentType.DIVIDER:
        return {
          borderTop: '1px solid #e5e7eb',
          margin: '24px 0',
          width: '100%'
        } as ComponentStyles;
      case ComponentType.CONTAINER:
        return {
          backgroundColor: '#ffffff',
          padding: '16px',
          margin: '0 0 16px 0'
        } as ComponentStyles;
      case ComponentType.ROW:
        return {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: '16px',
          width: '100%',
          margin: '0 0 16px 0'
        } as ComponentStyles;
      case ComponentType.COLUMN:
        return {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          width: '100%',
          margin: '0 0 16px 0'
        } as ComponentStyles;
      default:
        return {} as ComponentStyles;
    }
  }
}