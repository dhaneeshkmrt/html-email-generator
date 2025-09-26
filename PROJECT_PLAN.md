# HTML Email Generator - Project Plan & Checklist

## Project Overview
Angular-based web application for creating HTML email templates for weekly Angular community tips, eliminating manual HTML conversion process.

## Tech Stack
- Angular
- Angular Material
- Tailwind CSS
- ESLint
- Angular CDK (Drag & Drop)

## Core Features

### 1. Drag & Drop Component System
- [x] Universal drag-drop components (Text, TextArea, Link, Image, Code Block, Divider, Button)
- [x] Layout components (Row, Column, Container)
- [x] Nested drag-drop functionality
- [x] Component library with drag-drop interface
- [x] Canvas with proper drop zones
- [x] Theme inheritance for all components
- [ ] Individual style overrides per component
- [ ] Style inspector panel for component customization

### 2. Theme System
- [x] Base theme files (JSON/TypeScript)
- [x] Company green theme as primary
- [x] Component-specific theme mappings
- [ ] Real-time theme switching

### 3. Style Override System
- [ ] Typography controls (font family, size, weight, line-height, letter-spacing)
- [ ] Color controls (text, background, border with color picker)
- [ ] Spacing controls (padding, margin with individual side controls)
- [ ] Border controls (width, style, radius, color)
- [ ] Layout controls (alignment, width, height, display properties)
- [ ] Advanced CSS properties (box-shadow, opacity, transform, transition)
- [ ] Background properties (images, gradients, patterns)
- [ ] Custom CSS properties editor
- [ ] Email-safe CSS validation and fallback suggestions
- [ ] CSS class support and style presets

### 4. Component Library
- [x] Text Component (Headers H1-H6, paragraphs, spans)
- [x] TextArea Component (Multi-line with formatting toolbar)
- [x] Link Component (URLs, email links, styled buttons)
- [x] Image Component (Upload, resize, alignment, alt-text)
- [x] Code Component (Syntax highlighting, multiple languages)
- [x] Button Component (CTA buttons with styling)
- [x] Divider Component (Visual separators)
- [x] Container Components (Sections, columns, spacers)
- [x] Row/Column Layout Components (Grid-based layouts)

### 5. User Interface Layout
- [x] Left Panel: Component library with drag-drop elements
- [x] Center Panel: Canvas with real-time editing and preview
- [ ] Right Panel: Style inspector and theme controls
- [ ] Bottom Panel: Device preview switcher (desktop, tablet, mobile)
- [x] Header navigation and toolbar

### 6. Export & Email Compatibility
- [x] HTML generation with table-based layouts
- [x] Inline CSS conversion
- [ ] Email client compatibility checker
- [x] Multiple export formats (HTML file, raw HTML, email platform integration)
- [x] Template saving and library
- [x] LocalStorage persistence
- [x] Auto-save functionality

## Development Phases

### Phase 1: Foundation & Setup
- [x] Angular project initialization
- [x] Install dependencies (Angular Material, Tailwind, CDK)
- [x] Configure ESLint
- [x] Basic project structure setup
- [x] Routing configuration

### Phase 2: Core Architecture
- [x] Theme service implementation
- [x] Base component architecture
- [x] Drag-drop canvas setup
- [x] Basic component rendering

### Phase 3: Component Development
- [x] Individual component implementations
- [ ] Style override system
- [ ] Style inspector panel
- [x] Theme inheritance system

### Phase 4: Advanced Features
- [ ] Rich text editing
- [x] Image handling
- [x] Code syntax highlighting
- [x] Template library

### Phase 5: Export & Polish
- [x] HTML email generation engine
- [ ] Email compatibility testing
- [x] Export functionality
- [ ] User experience improvements

## Project Structure (Planned)
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── theme.service.ts
│   │   │   ├── email-builder.service.ts
│   │   │   └── export.service.ts
│   │   └── models/
│   ├── shared/
│   │   ├── components/
│   │   └── directives/
│   ├── features/
│   │   ├── email-builder/
│   │   ├── preview/
│   │   └── template-library/
│   └── assets/themes/
```

## Notes
- Focus on email client compatibility (table-based layouts, inline CSS)
- Maintain responsive design principles
- Ensure accessibility compliance
- Implement comprehensive testing strategy