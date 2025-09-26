import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _currentTheme = signal<Theme>(this.getDefaultTheme());

  readonly currentTheme = this._currentTheme.asReadonly();

  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
  }

  getThemeById(id: string): Theme | undefined {
    const themes = this.getAvailableThemes();
    return themes.find(theme => theme.id === id);
  }

  getAvailableThemes(): Theme[] {
    return [
      this.getDefaultTheme(),
      this.getCompanyGreenTheme()
    ];
  }

  private getDefaultTheme(): Theme {
    return {
      name: 'Default',
      id: 'default',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f9fafb',
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          disabled: '#d1d5db'
        },
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      typography: {
        fontFamily: {
          primary: 'Inter, system-ui, sans-serif',
          secondary: 'Georgia, serif',
          monospace: 'Monaco, monospace'
        },
        fontSize: {
          xs: '12px',
          sm: '14px',
          base: '16px',
          lg: '18px',
          xl: '20px',
          '2xl': '24px',
          '3xl': '30px',
          '4xl': '36px'
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px'
      },
      components: {
        button: {
          default: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: '500',
            textAlign: 'center',
            border: 'none'
          }
        },
        text: {
          default: {
            color: '#111827',
            fontSize: '16px',
            lineHeight: '1.5',
            fontFamily: 'Inter, system-ui, sans-serif'
          }
        },
        link: {
          default: {
            color: '#3b82f6',
            textDecoration: 'underline'
          }
        },
        container: {
          default: {
            backgroundColor: '#ffffff',
            padding: '16px'
          }
        }
      }
    };
  }

  private getCompanyGreenTheme(): Theme {
    const defaultTheme = this.getDefaultTheme();
    return {
      ...defaultTheme,
      name: 'Company Green',
      id: 'company-green',
      colors: {
        ...defaultTheme.colors,
        primary: '#059669',
        accent: '#10b981',
        success: '#065f46'
      },
      components: {
        ...defaultTheme.components,
        button: {
          default: {
            ...defaultTheme.components.button.default,
            backgroundColor: '#059669'
          }
        },
        link: {
          default: {
            ...defaultTheme.components.link.default,
            color: '#059669'
          }
        }
      }
    };
  }
}