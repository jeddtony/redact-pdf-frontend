# Frontend — RedactFlow

React + TypeScript frontend for PDF redaction, built with Vite and Tailwind CSS.

## Requirements

- Node.js 18+
- npm 9+

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API base URL

The frontend points to the backend at `http://localhost:8000` by default. If your backend runs elsewhere, update the base URL in `src/api/client.ts`.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # App entry point
    ├── App.tsx               # Router setup
    ├── index.css             # Tailwind base styles
    ├── api/
    │   └── client.ts         # Axios instance and API calls
    ├── components/
    │   ├── FileUpload.tsx     # PDF drag-and-drop upload
    │   ├── PDFPreview.tsx     # Rendered PDF preview
    │   ├── WordSelector.tsx   # Entity selection UI
    │   └── SharePanel.tsx     # Shareable link panel
    └── pages/
        ├── Home.tsx           # Main redaction workflow
        └── SharedView.tsx     # View a shared redacted PDF
```
