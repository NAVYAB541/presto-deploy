# Presto – Interactive Presentation Web App

A browser-based presentation editor built with React.js and JavaScript.
Create, edit, and deliver slide decks with live previews, dynamic theming,
and a fully responsive interface.

## Features

- **Slide editor** — create and reorder slides with real-time previews
- **Dynamic theming** — custom CSS properties for per-deck colour and font theming
- **Reusable component library** — modular React components for consistent UI
- **Accessibility-first design** — keyboard navigable, screen reader friendly
- **Responsive layouts** — CSS Flexbox/Grid across all viewport sizes
- **Containerised deployment** — Docker + Jenkins CI/CD pipeline
- **Infrastructure as code** — Terraform for cloud provisioning on AWS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, JavaScript, CSS, Vite |
| DevOps | Docker, Jenkins, Terraform |
| Cloud | AWS |
| CI/CD | Automated pipelines |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run locally
```bash
git clone https://github.com/NAVYAB541/presto-deploy.git
cd presto-deploy/frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Run with Docker
```bash
docker-compose up
```

## Project Structure
```
presto-deploy/
├── frontend/        # React application
├── backend/         # API server
├── assets/          # Static assets
└── util/            # Shared utilities
```
