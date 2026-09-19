# Contributing to JSON Repair Studio

Thank you for considering a contribution to JSON Repair Studio. Contributions of all sizes are welcome: bug reports, documentation improvements, accessibility fixes, test cases, user-interface improvements, and new functionality.

## Before you start

Please search existing issues and pull requests before opening a new one. For a significant feature, open an issue first so the proposed behavior can be discussed before implementation begins.

Do not include private JSON, credentials, API keys, access tokens, customer data, or other sensitive information in issues, pull requests, screenshots, test fixtures, or commit history.

## Development setup

### Requirements

- Node.js 20 or newer
- pnpm 10 or newer
- Git

### Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/json-repair-studio.git
cd json-repair-studio
pnpm install
```

### Start the application

```bash
pnpm dev
```

The project uses a Vite development server. The terminal output contains the local preview URL.

## Branches

Create a focused branch from the default branch:

```bash
git checkout -b feat/json-diff-view
git checkout -b fix/trailing-comma-string
```

Use these prefixes where possible:

- `feat/` for a new feature
- `fix/` for a bug fix
- `docs/` for documentation
- `test/` for test coverage
- `refactor/` for internal changes with no behavior change
- `chore/` for maintenance work

## Local checks

Before opening a pull request, run:

```bash
pnpm check
pnpm build
pnpm format
```

If your change affects user behavior, manually verify the relevant flow in the browser. At minimum, check both a desktop-width and a mobile-width viewport when changing layout or responsive styles.

For repair logic, test both positive and negative cases. A useful test matrix includes:

- Valid nested objects and arrays.
- Trailing commas.
- Unquoted keys.
- Smart quotes.
- Markdown code fences.
- Escaped quotes inside string values.
- Empty objects and arrays.
- Unicode text.
- Invalid input that must remain an error instead of being silently changed.

## Code style

- Use TypeScript for application code.
- Prefer small, focused React components.
- Keep user-facing copy clear and concise.
- Preserve keyboard accessibility and visible focus states.
- Use existing design tokens and shared UI primitives before adding new styles.
- Avoid adding a dependency for a small utility that can be implemented safely with existing platform APIs.
- Do not add server-side storage or network processing for JSON input without an explicit privacy review.
- Never commit secrets, local environment files, generated build output, or personal data.

## Commit messages

Use a short imperative commit subject. A Conventional Commit prefix is recommended:

```text
feat: add JSON diff panel
fix: preserve escaped quotes during repair
06 docs: improve local setup instructions
chore: update Vite configuration
```

Keep each commit focused. Avoid combining unrelated formatting changes with feature work.

## Pull request checklist

Before submitting a pull request, confirm that:

- [ ] The change has a clear user or maintainer benefit.
- [ ] The branch is focused on one issue or feature.
- [ ] `pnpm check` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm format` has been run.
- [ ] New behavior has a test or a clear manual verification note.
- [ ] The UI remains usable with keyboard navigation.
- [ ] Responsive behavior was checked when relevant.
- [ ] README or roadmap documentation was updated when behavior changed.
- [ ] No secrets or sensitive sample data are included.
- [ ] The pull request description explains what changed and why.

## Pull request description template

Please include:

1. **Summary** — What changed?
2. **Motivation** — What user problem does it solve?
3. **Implementation** — What is the important technical approach?
4. **Verification** — Which commands and manual flows were checked?
5. **Screenshots** — Include before/after screenshots for visual changes.
6. **Limitations** — What is intentionally not included?

## Reporting bugs

Use the issue tracker and include:

- A short, specific title.
- Steps to reproduce the problem.
- Expected behavior.
- Actual behavior.
- Browser and operating system.
- A minimal, sanitized JSON example if needed.
- Console errors or screenshots when relevant.

Never paste real secrets or private payloads into a public issue.

## Suggesting features

A useful feature request explains the problem before proposing the solution. Include the target user, the current workaround, expected behavior, and any privacy or accessibility considerations.

Small, focused feature proposals are easier to review than broad requests to redesign the entire application.

## Review process

Maintainers may request changes to scope, copy, accessibility, performance, privacy, or test coverage. Please keep review conversations focused on the code and the user experience. Once the required checks pass and the change is approved, a maintainer will merge the pull request.

## Code of Conduct

By participating in this project, you agree to keep discussions respectful, constructive, and inclusive. Harassment, discrimination, personal attacks, and deliberate disruption are not acceptable.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE) that covers this project.
