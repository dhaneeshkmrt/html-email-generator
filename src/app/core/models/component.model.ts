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
  CONTAINER = 'container',
  ROW = 'row',
  COLUMN = 'column'
}

export interface ComponentProperties {
  content?: string;
  url?: string;
  alt?: string;
  src?: string;
  language?: string;
  placeholder?: string;
  // Layout properties
  columns?: number;
  columnGap?: string;
  rowGap?: string;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  justification?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  [key: string]: unknown;
}

export interface ComponentStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  textShadow?: string;

  // Colors
  color?: string;
  backgroundColor?: string;
  borderColor?: string;

  // Advanced Border Properties
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderTopStyle?: string;
  borderRightStyle?: string;
  borderBottomStyle?: string;
  borderLeftStyle?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // Background Properties
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundClip?: string;
  backgroundOrigin?: string;

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

  // Layout & Positioning
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  display?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string | number;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  visibility?: 'visible' | 'hidden' | 'collapse';

  // Flexbox Properties
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flex?: string;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  order?: string | number;

  // Grid Properties
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridTemplate?: string;
  gap?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  gridColumnStart?: string;
  gridColumnEnd?: string;
  gridRowStart?: string;
  gridRowEnd?: string;
  justifyItems?: 'stretch' | 'start' | 'end' | 'center';
  placeSelf?: string;
  justifySelf?: 'stretch' | 'start' | 'end' | 'center';

  // Visual Effects
  opacity?: string | number;
  boxShadow?: string;
  filter?: string;
  backdropFilter?: string;
  transform?: string;
  transformOrigin?: string;
  perspective?: string;
  perspectiveOrigin?: string;

  // Transition & Animation
  transition?: string;
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  transitionDelay?: string;
  animation?: string;
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDelay?: string;
  animationIterationCount?: string;
  animationDirection?: string;
  animationFillMode?: string;
  animationPlayState?: string;

  // Table Properties (for email compatibility)
  tableLayout?: 'auto' | 'fixed';
  borderCollapse?: 'separate' | 'collapse';
  borderSpacing?: string;
  captionSide?: 'top' | 'bottom';
  emptyCells?: 'show' | 'hide';

  // List Properties
  listStyleType?: string;
  listStylePosition?: 'inside' | 'outside';
  listStyleImage?: string;
  listStyle?: string;

  // Custom CSS Properties
  customStyles?: Record<string, string>;

  [key: string]: unknown;
}