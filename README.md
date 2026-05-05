# note-vault

A fast, offline-first note system that runs entirely in the browser.

## Features

- **Offline-first** - All data stored locally in IndexedDB, works without internet
- **Full-text search** - Fuzzy search across titles, content, and tags
- **Categories** - Organize notes with color-coded categories
- **Tags** - Add multiple tags to notes for flexible organization
- **Pin notes** - Keep important notes at the top
- **Dark mode** - Toggle between light and dark themes
- **Import/Export** - Backup and restore your data as JSON
- **Keyboard shortcuts** - `Cmd/Ctrl+K` to search, `Cmd/Ctrl+N` for new note

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework with static export
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [MiniSearch](https://lucaong.github.io/minisearch/) - Full-text search

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/dedenbangkit/note-vault.git
cd note-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/note-vault](http://localhost:3000/note-vault) in your browser.

### Build for Production

```bash
npm run build
```

Static files are generated in the `out/` directory, ready to deploy to any static hosting.

## Data Storage

All notes and categories are stored in your browser's IndexedDB. Data never leaves your device unless you explicitly export it.

### Export Format

```json
{
  "schema_version": 1,
  "exported_at": "2024-01-15T10:30:00.000Z",
  "notes": [...],
  "categories": [...]
}
```

See `example-backup.json` for a complete example.

## License

[AGPL-3.0](LICENSE)
