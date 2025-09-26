import { Injectable } from '@angular/core';
import { EmailComponent, ComponentType, ComponentStyles } from '../models/component.model';
import { CSSValidatorService } from './css-validator.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private cssValidator: CSSValidatorService) {}

  exportToHTML(components: EmailComponent[]): string {
    const htmlContent = this.generateHTMLContent(components);
    return this.wrapInEmailTemplate(htmlContent);
  }

  exportToRawHTML(components: EmailComponent[]): string {
    return this.generateHTMLContent(components);
  }

  exportToEmailSafeHTML(components: EmailComponent[]): string {
    // Generate HTML with only email-safe CSS
    const safeComponents = components.map(component => ({
      ...component,
      styles: this.cssValidator.generateEmailSafeCSS(component.styles)
    }));

    const htmlContent = this.generateHTMLContent(safeComponents);
    return this.wrapInEmailTemplate(htmlContent);
  }

  exportWithCompatibilityReport(components: EmailComponent[]): { html: string; report: any[] } {
    const compatibilityReport: any[] = [];

    const processedComponents = components.map(component => {
      const compatibility = this.cssValidator.checkEmailCompatibility(component.styles);

      if (!compatibility.compatible) {
        compatibilityReport.push({
          componentId: component.id,
          componentType: component.type,
          issues: compatibility.issues,
          appliedFallbacks: compatibility.fallbacks
        });
      }

      return {
        ...component,
        styles: this.cssValidator.generateEmailSafeCSS(component.styles)
      };
    });

    const htmlContent = this.generateHTMLContent(processedComponents);
    const html = this.wrapInEmailTemplate(htmlContent);

    return { html, report: compatibilityReport };
  }

  downloadAsFile(content: string, filename: string, contentType = 'text/html'): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateHTMLContent(components: EmailComponent[]): string {
    return components.map(component => this.componentToHTML(component)).join('\n');
  }

  private componentToHTML(component: EmailComponent): string {
    // Convert styles to email-safe CSS first
    const safeStyles = this.cssValidator.generateEmailSafeCSS(component.styles);
    const styles = this.stylesToInlineCSS(safeStyles);

    switch (component.type) {
      case ComponentType.TEXT:
        return `<p style="${styles}">${component.properties.content || ''}</p>`;

      case ComponentType.TEXTAREA: {
        const textContent = (component.properties.content || '').replace(/\n/g, '<br>');
        return `<div style="${styles}">${textContent}</div>`;
      }

      case ComponentType.LINK:
        return `<a href="${component.properties.url || '#'}" style="${styles}">${component.properties.content || 'Link'}</a>`;

      case ComponentType.IMAGE:
        return `<img src="${component.properties.src || ''}" alt="${component.properties.alt || ''}" style="${styles}">`;

      case ComponentType.CODE: {
        const codeStyles = `${styles}; background-color: #f3f4f6; padding: 12px; border-radius: 4px; font-family: monospace;`;
        return `<pre style="${codeStyles}"><code>${component.properties.content || ''}</code></pre>`;
      }

      case ComponentType.BUTTON: {
        const buttonHTML = `<a href="${component.properties.url || '#'}" style="${styles}; display: inline-block; text-decoration: none;">${component.properties.content || 'Button'}</a>`;
        return `<table cellpadding="0" cellspacing="0" border="0"><tr><td>${buttonHTML}</td></tr></table>`;
      }

      case ComponentType.DIVIDER:
        return `<hr style="${styles}">`;

      case ComponentType.CONTAINER: {
        const childrenHTML = component.children?.map(child => this.componentToHTML(child)).join('\n') || '';
        return `<div style="${styles}">${childrenHTML}</div>`;
      }

      case ComponentType.ROW: {
        const childrenHTML = component.children?.map(child => this.componentToHTML(child)).join('\n') || '';
        // Use table for email compatibility
        const cellStyles = 'vertical-align: top; padding: 0;';
        const cells = component.children?.map(child =>
          `<td style="${cellStyles}">${this.componentToHTML(child)}</td>`
        ).join('') || '';
        return `<table style="${styles}; border-collapse: collapse;" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table>`;
      }

      case ComponentType.COLUMN: {
        const childrenHTML = component.children?.map(child => this.componentToHTML(child)).join('\n') || '';
        const columns = component.properties.columns || 2;
        const columnWidth = `${100 / columns}%`;

        // Create table-based column layout for email compatibility
        const cells = component.children?.map(child =>
          `<td style="vertical-align: top; width: ${columnWidth}; padding: 0;">${this.componentToHTML(child)}</td>`
        ).join('') || '';

        return `<table style="${styles}; border-collapse: collapse; width: 100%;" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table>`;
      }

      default:
        return '';
    }
  }

  private stylesToInlineCSS(styles: Record<string, unknown>): string {
    const cssRules: string[] = [];

    // Process standard CSS properties
    Object.entries(styles).forEach(([property, value]) => {
      if (property === 'customStyles') {
        // Handle custom styles separately
        if (value && typeof value === 'object') {
          Object.entries(value as Record<string, string>).forEach(([customProp, customValue]) => {
            cssRules.push(`${this.camelToKebab(customProp)}: ${customValue}`);
          });
        }
      } else if (value !== undefined && value !== null) {
        // Convert camelCase to kebab-case and add to CSS
        cssRules.push(`${this.camelToKebab(property)}: ${value}`);
      }
    });

    return cssRules.join('; ');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  private wrapInEmailTemplate(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Template</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        table { border-collapse: collapse; }
        .email-wrapper { width: 100%; max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                ${content}
            </td>
        </tr>
    </table>
</body>
</html>`;
  }
}