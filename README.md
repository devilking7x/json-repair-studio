# JSON Repair Studio

[![Live demo](https://devilking7x.github.io/json-repair-studio/badge.svg)](https://devilking7x.github.io/json-repair-studio/) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A privacy-first JSON formatter, validator, minifier, and repair tool that runs entirely in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-8ef0c1.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)

JSON Repair Studio helps developers clean up malformed JSON without uploading sensitive data to a server. Paste JSON into the editor, choose an action, review the result, and copy or download the cleaned output.

## Why this project exists

JSON errors are often small but time-consuming to find. A trailing comma, an unquoted key, smart quotes, or a copied Markdown code fence can stop an otherwise useful payload from working. JSON Repair Studio provides a focused workspace for fixing these common problems while keeping the input local to the browser.

## Features

- **Format** valid JSON with configurable indentation.
- **Repair** common issues such as trailing commas, smart quotes, Markdown code fences, and unquoted object keys.
- **Minify** valid JSON into a compact single-line representation.
- **Validate** JSON and show the approximate line and column of parsing errors.
- **Copy** formatted output to the clipboard.
- **Download** cleaned JSON as a `.json` file.
- **Keyboard shortcuts** for fast workflows:
  - `Cmd/Ctrl + Enter` — repair JSON
  - `Cmd/Ctrl + Shift + F` — format JSON
- **Responsive interface** for desktop and mobile screens.
- **Client-side processing** with no account, API key, or application backend required.

## Privacy model

All parsing and repair operations happen in the browser. This project does not intentionally send the JSON entered into the editor to a server.

You should still review the code and your deployment configuration before using the tool with highly sensitive data. Browser extensions, hosting infrastructure, analytics configuration, or modified forks may change the privacy characteristics of a deployment.

The repair operation uses conservative heuristics. Always review generated output before using it in production, especially when the input contains nested strings, unusual escaping, or domain-specific syntax.

## Demo

Replace the placeholder below with your deployed URL after publishing:

```text
https://devilking7x.github.io/json-repair-studio/
```

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui primitives
- Lucide React icons
- Sonner notifications
- Wouter routing
- pnpm

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer

### Installation

```bash
git clone https://github.com/devilking7x/json-repair-studio.git
cd json-repair-studio
pnpm install
```

### Start the development server

```bash
pnpm dev
```

The development server will print the local URL in the terminal.

### Run checks

```bash
pnpm check
pnpm build
```

### Format the codebase

```bash
pnpm format
```

## Project structure

```text
client/
  public/                 # Small public configuration files
  src/
    components/           # Reusable UI and shadcn/ui components
    contexts/             # Theme and application contexts
    hooks/                # Reusable React hooks
    lib/                  # Shared utilities
    pages/                # Route-level pages
    App.tsx               # Application shell and routes
    index.css             # Global theme and component styles
server/                   # Static template compatibility server
shared/                   # Shared constants and types
```

The application is intentionally client-only. The `server/` directory is used by the build template and does not process or persist JSON input.

## Repair behavior

The repair action currently attempts to handle common copied-payload problems:

- Removes Markdown code fences around JSON.
- Converts curly quotation marks to standard JSON quotes.
- Removes trailing commas before `}` and `]`.
- Quotes simple unquoted object keys.
- Converts simple single-quoted values into double-quoted JSON strings.

These transformations are not a general-purpose parser. If the repaired output is important, validate it and inspect the resulting structure before using it.

## Roadmap

- Drag-and-drop JSON file import.
- JSON tree viewer with collapsible nodes.
- Search and replace inside the editor.
- JSON diff view for comparing input and output.
- More precise parser diagnostics.
- Optional shareable examples that never include private input by default.
- Additional test coverage for nested objects, escaped strings, arrays, and Unicode content.

Feature requests and implementation ideas are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Contributing

Contributions are welcome, including bug reports, documentation improvements, accessibility fixes, tests, and feature implementations.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, commit conventions, testing expectations, and pull request checklist.

## Security

Please do not open a public issue containing private JSON, credentials, API keys, access tokens, or other sensitive information. For a security concern, contact the repository maintainers privately before making any public disclosure.

## License

JSON Repair Studio is available under the [MIT License](LICENSE).

## Acknowledgements

This project uses the open-source React, Vite, TypeScript, Tailwind CSS, Lucide, and shadcn/ui ecosystems. See the project dependency manifests for the complete list of third-party packages and their licenses.

## Who it is for

This project is designed for **developers handling malformed payloads**. Its narrow first release focuses on helping them format, repair, validate, minify JSON locally. The interface uses realistic synthetic fixtures so the value is understandable without connecting a production account.

## Privacy and safety

The default experience is local-first: inputs are processed in the browser or in the user's own development environment, with no required account, API key, payment flow, or remote storage. Fixtures contain synthetic data only. Review a fork's hosting and analytics configuration before using it with sensitive information.

## Validation

The release workflow is intentionally reproducible. Run `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build` before submitting a change. Manual review should cover keyboard operation, visible focus, mobile layout, empty states, and both successful and error paths.

## Limitations

This is a focused open-source MVP rather than a hosted replacement for a production system. It does not guarantee business, legal, financial, medical, accessibility, or security compliance by itself. Validate outputs against the context in which you plan to use them.


## Live demo

Open **[JSON Repair Studio in the browser](https://devilking7x.github.io/json-repair-studio/)**. The default deployment uses GitHub Pages and does not require a custom domain.
