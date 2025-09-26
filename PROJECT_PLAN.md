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
- [ ] Universal drag-drop components (Text, TextArea, Link, Image, Code Block, Divider, Button)
- [ ] Theme inheritance for all components
- [ ] Individual style overrides per component
- [ ] Style inspector panel for component customization

### 2. Theme System
- [ ] Base theme files (JSON/TypeScript)
- [ ] Company green theme as primary
- [ ] Component-specific theme mappings
- [ ] Real-time theme switching

### 3. Style Override System
- [ ] Typography controls (font family, size, weight, line-height, letter-spacing)
- [ ] Color controls (text, background, border with color picker)
- [ ] Spacing controls (padding, margin with individual side controls)
- [ ] Border controls (width, style, radius, color)
- [ ] Layout controls (alignment, width, height, display properties)

### 4. Component Library
- [ ] Text Component (Headers H1-H6, paragraphs, spans)
- [ ] TextArea Component (Multi-line with formatting toolbar)
- [ ] Link Component (URLs, email links, styled buttons)
- [ ] Image Component (Upload, resize, alignment, alt-text)
- [ ] Code Component (Syntax highlighting, multiple languages)
- [ ] Container Components (Sections, columns, spacers)

### 5. User Interface Layout
- [ ] Left Panel: Component library with drag-drop elements
- [ ] Center Panel: Canvas with real-time editing and preview
- [ ] Right Panel: Style inspector and theme controls
- [ ] Bottom Panel: Device preview switcher (desktop, tablet, mobile)

### 6. Export & Email Compatibility
- [ ] HTML generation with table-based layouts
- [ ] Inline CSS conversion
- [ ] Email client compatibility checker
- [ ] Multiple export formats (HTML file, raw HTML, email platform integration)
- [ ] Template saving and library

## Development Phases

### Phase 1: Foundation & Setup
- [ ] Angular project initialization
- [ ] Install dependencies (Angular Material, Tailwind, CDK)
- [ ] Configure ESLint
- [ ] Basic project structure setup
- [ ] Routing configuration

### Phase 2: Core Architecture
- [ ] Theme service implementation
- [ ] Base component architecture
- [ ] Drag-drop canvas setup
- [ ] Basic component rendering

### Phase 3: Component Development
- [ ] Individual component implementations
- [ ] Style override system
- [ ] Style inspector panel
- [ ] Theme inheritance system

### Phase 4: Advanced Features
- [ ] Rich text editing
- [ ] Image handling
- [ ] Code syntax highlighting
- [ ] Template library

### Phase 5: Export & Polish
- [ ] HTML email generation engine
- [ ] Email compatibility testing
- [ ] Export functionality
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