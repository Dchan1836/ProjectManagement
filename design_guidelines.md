# Project Management Application Design Guidelines

## Design Approach: Microsoft Fluent Design System
**Rationale**: Fluent excels at productivity applications with information-dense interfaces. Its depth system, subtle animations, and professional aesthetic align perfectly with project management needs. We'll adapt Fluent's principles while integrating Syncfusion components seamlessly.

## Core Design Principles
- **Clarity over decoration**: Information hierarchy is paramount
- **Spatial efficiency**: Maximize workspace for Gantt/Kanban views
- **Contextual depth**: Use subtle shadows to establish UI layers
- **Purposeful whitespace**: Breathing room without wasting screen real estate

## Typography System
**Font Stack**: Inter (via Google Fonts CDN)
- **Navigation/Headers**: 600 weight, 14-16px
- **Body/Tasks**: 400 weight, 14px
- **Labels/Metadata**: 500 weight, 12px
- **Data/Numbers**: 500 weight, mono-spaced variant for alignment

## Layout & Spacing
**Tailwind Units**: Use 2, 3, 4, 6, 8, 12, 16 as primary spacing scale
- **App Shell**: Fixed sidebar (64px collapsed, 240px expanded), top navigation (56px height)
- **Content Padding**: p-6 for main workspace, p-4 for cards, p-3 for compact elements
- **Card Spacing**: gap-4 between cards, gap-6 between major sections

## Application Structure

### Top Navigation Bar (h-14)
Fixed position, spans full width above sidebar:
- Left: Workspace switcher dropdown, project name/breadcrumb
- Center: View toggle pills (Gantt | Kanban | List) with active state indicator
- Right: Search bar (w-64), notifications bell, quick-add task button, user avatar menu

### Left Sidebar Navigation
Collapsible (hover to expand):
- Dashboard icon + label
- Projects list with folder tree structure
- My Tasks section
- Team members
- Settings
- Collapse/expand toggle at bottom

### Main Workspace Area
Full remaining viewport with appropriate padding:

**Gantt View**:
- Toolbar above chart: date range picker, zoom controls, filter dropdown, export button
- Syncfusion Gantt occupies full content area with generous height
- Timeline header with clear date labels
- Task dependency lines clearly visible

**Kanban Board**:
- Column headers: Backlog, To Do, In Progress, Review, Done (customizable)
- Add card button in each column header
- Syncfusion Kanban with vertical scroll per column
- Card design: compact with task title, assignee avatar, due date badge, priority indicator dot

**List View**:
- Table header with sortable columns: Task Name, Assignee, Due Date, Priority, Status, Progress
- Expandable rows for subtasks
- Inline editing capabilities
- Bulk action toolbar appears on selection

### Right Panel (Contextual, 320px)
Slides in when task/project selected:
- Task details header with title, edit, and close button
- Tabs: Details | Activity | Comments
- Rich form fields for task properties
- Assignee selection with avatar display
- Date pickers with calendar popover
- Priority and status dropdowns
- Description textarea
- Attachment upload area with file list
- Comment thread with timestamp and user avatars

## Component Library

### Cards
Subtle border, minimal shadow (shadow-sm), rounded corners (rounded-lg), white background

### Buttons
- **Primary**: Solid fill, medium weight text, px-4 py-2, rounded-md
- **Secondary**: Border outline, transparent background
- **Icon buttons**: Square 8x8 or 10x10, centered icon, subtle hover background
- **Pills** (view toggles): Rounded-full, compact padding

### Form Elements
- **Inputs**: Border, rounded-md, px-3 py-2, focus ring
- **Dropdowns**: Match input styling, chevron icon, max-height with scroll
- **Date pickers**: Calendar icon, popover on click
- **Checkboxes**: Rounded-sm, checked state with checkmark

### Status Indicators
- **Priority**: Colored dots (High=red, Medium=yellow, Low=green) with 2px size
- **Progress bars**: Thin (h-1.5), rounded-full, background with fill overlay
- **Badges**: Rounded-full, px-2 py-0.5, small text, status-colored backgrounds

### Icons
**Heroicons** (outline style) via CDN for consistency with Fluent aesthetic

## Images

**No Hero Image**: This is a productivity application, not a marketing site. The interface itself is the hero.

**Avatar Images**: Use throughout for user assignments and comments (32px standard, 24px compact)
**Empty States**: Custom illustrations for empty project lists, no tasks views (centered, 200x200px, simple line art style)
**Project Thumbnails**: Optional 16:9 thumbnails in project cards (if applicable)

## Responsive Behavior
- **Desktop (1280px+)**: Full three-column layout (sidebar, main, right panel)
- **Tablet (768-1279px)**: Collapsible sidebar, right panel as modal overlay
- **Mobile (<768px)**: Bottom tab bar navigation, single view stack, sheet modals

## Animations
**Minimal and purposeful only**:
- Sidebar expand/collapse: 200ms ease
- Panel slide-in: 250ms ease-out
- Dropdown open: 150ms ease
- Task card drag: smooth transform
- No decorative animations

This design creates a professional, efficient workspace that prioritizes functionality while maintaining visual polish through Fluent's proven patterns.