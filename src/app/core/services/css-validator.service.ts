import { Injectable } from '@angular/core';
import { ComponentStyles } from '../models/component.model';

export interface CSSValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface EmailCompatibilityResult {
  compatible: boolean;
  issues: string[];
  fallbacks: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class CSSValidatorService {

  // CSS properties that are generally safe for email clients
  private readonly emailSafeProperties = new Set([
    'background-color', 'color', 'font-family', 'font-size', 'font-weight',
    'line-height', 'text-align', 'text-decoration', 'padding', 'margin',
    'border', 'border-width', 'border-style', 'border-color', 'border-radius',
    'width', 'height', 'display', 'vertical-align', 'text-transform'
  ]);

  // CSS properties with limited email client support
  private readonly limitedSupportProperties = new Map([
    ['box-shadow', 'Use border instead for better compatibility'],
    ['transform', 'Not supported in most email clients'],
    ['animation', 'Not supported in email clients'],
    ['transition', 'Not supported in email clients'],
    ['position', 'Limited support, avoid absolute/fixed positioning'],
    ['flex', 'Limited support, use table-based layouts instead'],
    ['grid', 'Not supported, use table-based layouts instead']
  ]);

  // Common CSS property patterns
  private readonly cssPropertyPattern = /^[a-z-]+$/i;
  private readonly cssValuePattern = /^[^{};"'\\]+$/;

  validateCustomCSS(customStyles: Record<string, string>): CSSValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    for (const [property, value] of Object.entries(customStyles)) {
      // Validate property name
      if (!this.cssPropertyPattern.test(property)) {
        errors.push(`Invalid CSS property name: "${property}"`);
        continue;
      }

      // Validate value
      if (!this.cssValuePattern.test(value)) {
        errors.push(`Invalid CSS value for "${property}": "${value}"`);
        continue;
      }

      // Check for potentially dangerous values
      if (this.isDangerousValue(value)) {
        warnings.push(`Potentially unsafe CSS value for "${property}": "${value}"`);
      }

      // Check for email compatibility
      if (!this.emailSafeProperties.has(property)) {
        if (this.limitedSupportProperties.has(property)) {
          warnings.push(`Limited email client support for "${property}". ${this.limitedSupportProperties.get(property)}`);
        } else {
          warnings.push(`Property "${property}" may not be supported in email clients`);
        }
      }
    }

    // Provide suggestions
    if (customStyles['display'] === 'flex') {
      suggestions.push('Consider using table-based layout instead of flexbox for better email compatibility');
    }

    if (customStyles['position'] && ['absolute', 'fixed'].includes(customStyles['position'])) {
      suggestions.push('Avoid absolute/fixed positioning in emails. Use relative positioning or table layouts');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  checkEmailCompatibility(styles: ComponentStyles): EmailCompatibilityResult {
    const issues: string[] = [];
    const fallbacks: Record<string, string> = {};

    // Check for modern CSS features that need fallbacks
    if (styles.boxShadow) {
      issues.push('Box-shadow has limited email client support');
      fallbacks['border'] = '1px solid #ddd';
    }

    if (styles.borderRadius && parseInt(styles.borderRadius) > 0) {
      issues.push('Border-radius may not work in older email clients (Outlook 2007-2016)');
    }

    if (styles.transform) {
      issues.push('CSS transforms are not supported in email clients');
      delete fallbacks['transform'];
    }

    if (styles.display === 'flex' || styles.display === 'grid') {
      issues.push('Modern layout methods (flex/grid) not supported in email clients');
      fallbacks['display'] = 'table-cell';
    }

    if (styles.backgroundImage) {
      issues.push('Background images may be blocked by default in many email clients');
      fallbacks['background-color'] = styles.backgroundColor || '#f0f0f0';
    }

    return {
      compatible: issues.length === 0,
      issues,
      fallbacks
    };
  }

  generateEmailSafeCSS(styles: ComponentStyles): ComponentStyles {
    const safeStyles: ComponentStyles = { ...styles };

    // Remove unsupported properties
    delete safeStyles.animation;
    delete safeStyles.animationName;
    delete safeStyles.animationDuration;
    delete safeStyles.animationTimingFunction;
    delete safeStyles.animationDelay;
    delete safeStyles.animationIterationCount;
    delete safeStyles.animationDirection;
    delete safeStyles.animationFillMode;
    delete safeStyles.animationPlayState;
    delete safeStyles.transition;
    delete safeStyles.transitionProperty;
    delete safeStyles.transitionDuration;
    delete safeStyles.transitionTimingFunction;
    delete safeStyles.transitionDelay;
    delete safeStyles.transform;
    delete safeStyles.transformOrigin;

    // Convert modern layout to table-based
    if (safeStyles.display === 'flex') {
      safeStyles.display = 'table';
    }

    if (safeStyles.display === 'grid') {
      safeStyles.display = 'table';
    }

    // Ensure inline-block for buttons
    if (safeStyles.display === 'inline-flex') {
      safeStyles.display = 'inline-block';
    }

    return safeStyles;
  }

  private isDangerousValue(value: string): boolean {
    // Check for potentially dangerous CSS values
    const dangerousPatterns = [
      /javascript:/i,
      /data:/i,
      /expression\(/i,
      /<script/i,
      /on\w+\s*=/i
    ];

    return dangerousPatterns.some(pattern => pattern.test(value));
  }

  getSuggestions(property: string, value: string): string[] {
    const suggestions: string[] = [];

    switch (property) {
      case 'font-family':
        if (!value.includes('Arial') && !value.includes('sans-serif')) {
          suggestions.push('Include a web-safe fallback font like Arial or sans-serif');
        }
        break;

      case 'background-color':
        if (value.startsWith('#') && value.length === 4) {
          suggestions.push('Use 6-digit hex colors for better compatibility');
        }
        break;

      case 'width':
      case 'height':
        if (value.includes('vh') || value.includes('vw')) {
          suggestions.push('Viewport units may not work in email clients, use px or % instead');
        }
        break;

      case 'padding':
      case 'margin':
        if (value.includes('rem') || value.includes('em')) {
          suggestions.push('Use px instead of relative units for more predictable spacing in emails');
        }
        break;
    }

    return suggestions;
  }

  validateCSSProperty(property: string, value: string): { isValid: boolean; message?: string } {
    // Basic validation for CSS property-value pairs
    if (!property || !value) {
      return { isValid: false, message: 'Property and value are required' };
    }

    if (!this.cssPropertyPattern.test(property)) {
      return { isValid: false, message: 'Invalid CSS property format' };
    }

    if (!this.cssValuePattern.test(value)) {
      return { isValid: false, message: 'Invalid CSS value format' };
    }

    if (this.isDangerousValue(value)) {
      return { isValid: false, message: 'Potentially unsafe CSS value' };
    }

    return { isValid: true };
  }
}