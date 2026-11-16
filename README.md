# LinkStash

A fast, customizable bookmark manager built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Organize links into color-coded categories, drag-and-drop to arrange your workspace, switch themes on the fly, and keep your data portable with JSON export/import and local persistence.

---

## Features

### Bookmark Management
- **Quick Save & Clipboard Paste**: Press `Ctrl+V` / `Cmd+V` anywhere outside text inputs to capture a copied URL straight into the **Save New Bookmark** dialog.
- **Flexible Entries**: Website URLs and notes are optional—store full web links or quick text notes, with one-click **Auto-Fill** for titles and domain descriptions.
- **Smart Defaults & Favorites**: New bookmarks default to **Uncategorized**; star important items to pin them to **Favorites**.
- **Safe Deletion**: Deleting single or bulk-selected bookmarks opens a confirmation dialog and automatically removes any category left with `0` bookmarks.

### Categories & Drag-and-Drop Workspace
- **Custom Categories**: Create color-coded categories from the sidebar or directly inline from the **Add / Edit Bookmark** dialog (`+ New Category`).
- **Drag-and-Drop Ordering**: Reorder both bookmark cards/rows (under **Custom Order**) and the sidebar **Categories** list.
- **Shared Arrange Lock**: Use the icon-only lock toggle at the top right (next to the view switcher) to lock or unlock drag reordering for both categories and bookmarks together.
- **Resizable Sidebar**: Drag the vertical sidebar divider to resize (`210px`–`440px`), or double-click the divider to reset to default width.

### Search, Views & Bulk Actions
- **Instant Search (`Ctrl+K` / `Cmd+K`)**: Filter bookmarks by title, URL, notes, or category name.
- **Grid & List Views**: Switch between card grid and compact row layouts.
- **Sorting**: Switch between **Custom Order**, **Newest First**, **Oldest First**, and **Title (A–Z)**.
- **Bulk Operations**: Select multiple bookmarks to move them between categories or delete them together.

### Themes & Appearance Customizer
- **6 Theme Presets**: *Oceanic Slate*, *Indigo Studio*, *Nordic Pine*, *Warm Paper*, *Rosewood*, and *Monochrome Ink*.
- **Light, Dark & System Modes**: Full light/dark mode support plus a quick toggle in the sidebar footer.
- **Custom Accent & Dynamic Logo**: Pick custom accent colors, corner radius presets (*Sharp*, *Balanced*, *Soft*), and card density (*Compact*, *Comfortable*), with a theme-synced app logo (plus **Original**, **Match Theme**, or custom logo tint options).

### Data Portability & Local Persistence
- **Automatic Local Storage**: Bookmarks, categories, sidebar width, arrange lock state, and appearance settings persist automatically in `localStorage`.
- **Backup & Reset**: Export or import your library as `.json`, restore sample bookmarks with **Demo**, or wipe everything with **Clear All**.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` (or `bun` / `pnpm`)

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start the development server (runs on http://localhost:3000)
npm run dev
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server on port `3000` |
| `npm run build` | Build production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type-checking (`tsc --noEmit`) |
| `npm run clean` | Remove build output (`dist`) |

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+K` / `Cmd+K` | Focus search bar |
| `Ctrl+V` / `Cmd+V` | Quick-save copied URL (when not typing in an input) |
| `Esc` | Close open modals, sidebar drawer, or clear selection |

---

## Project Structure

```text
├── index.html                   # App HTML entry point and fonts
├── package.json                 # Dependencies and npm scripts
├── vite.config.ts               # Vite + Tailwind CSS configuration
├── public/                      # Static public assets & app icon
└── src/
    ├── App.tsx                  # Main workspace, drag-and-drop, filters & modals
    ├── main.tsx                 # React root mount
    ├── index.css                # Tailwind v4 & CSS theme variable bindings
    ├── themes.ts                # Theme presets, color mode & logo color resolution
    ├── types.ts                 # TypeScript interfaces
    ├── data/
    │   └── defaults.ts          # Sample categories, bookmarks & URL helpers
    └── components/
        ├── AppearanceModal.tsx  # Theme, dark mode, accent & layout customizer
        ├── BookmarkCard.tsx     # Grid view bookmark card
        ├── BookmarkModal.tsx    # Add/Edit bookmark & inline category creator
        ├── BookmarkRow.tsx      # List view bookmark row
        ├── FaviconImage.tsx     # Website favicon loader with fallback
        └── LinkStashLogo.tsx    # Theme-adaptive app logo component
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
