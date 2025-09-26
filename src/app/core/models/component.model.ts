export interface EmailComponent {
  id: string;
  type: ComponentType;
  properties: ComponentProperties;
  styles: ComponentStyles;
  children?: EmailComponent[];
}

export enum ComponentType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  LINK = 'link',
  IMAGE = 'image',
  CODE = 'code',
  BUTTON = 'button',
  DIVIDER = 'divider',
  CONTAINER = 'container'
}

export interface ComponentProperties {
  content?: string;
  url?: string;
  alt?: string;
  src?: string;
  language?: string;
  placeholder?: string;
  [key: string]: unknown;
}

export interface ComponentStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Colors
  color?: string;
  backgroundColor?: string;
  borderColor?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Border
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;

  // Layout
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  display?: string;

  [key: string]: unknown;
}