# docs-classifier

Classifies documentation files in the `docs/` folder into categories automatically.

## Triggers

- "classify docs"
- "organize docs"
- "categorize documentation"
- "sort docs by category"
- Any task involving docs folder organization or classification

## How It Works

This skill uses a **3-layer fallback system** that works even in new projects:

### Layer 1: Universal Categories (Always Available)
7 hardcoded categories that work in any project:
- `01-frontend` - Frontend, UI, React, components
- `02-backend` - Backend, APIs, server logic
- `03-database` - Database, schemas, migrations
- `04-auth` - Authentication, authorization, security
- `05-pagamentos` - Payments, billing, subscriptions
- `06-testes` - Testing, QA, test files
- `07-deploy` - Deploy, CI/CD, DevOps
- `99-geral` - General docs (README, guides, etc.)

### Layer 2: Project-Specific Categories
If `docs/.categories.json` exists, uses those categories.

### Layer 3: Default Fallback
If no match found, defaults to `99-geral`.

## Commands

```bash
# Classify all files in docs/ folder
node .agents/skills/docs-classifier/scripts/classify.js

# Classify a specific file
node .agents/skills/docs-classifier/scripts/classify.js docs/README.md

# Scan project to generate categories.json
node .agents/skills/docs-classifier/scripts/scan-project.js

# Check if categories.json exists
node .agents/skills/docs-classifier/scripts/scan-project.js --check
```

## Quick Usage

```javascript
const { classifyFile } = require('./.agents/skills/docs-classifier/scripts/classify.js');

const category = classifyFile('docs/api/authentication.md');
console.log(category); // "04-auth"
```

## Category IDs

| ID | Name | Example Files |
|----|------|---------------|
| 01-frontend | Frontend | ui-guide.md, react-components.md |
| 02-backend | Backend | api-reference.md, endpoints.md |
| 03-database | Database | schema-design.md, migrations.md |
| 04-auth | Authentication | login-flow.md, jwt-setup.md |
| 05-pagamentos | Pagamentos | stripe-integration.md |
| 06-testes | Testes | testing-guide.md, jest-config.md |
| 07-deploy | Deploy | deployment-guide.md, ci-cd.md |
| 99-geral | Geral | README.md, getting-started.md |

## Files

- `categories-universal.json` - Universal category definitions
- `scripts/classify.js` - Main classification logic
- `scripts/scan-project.js` - Project structure scanner
- `references/naming-conventions.md` - File naming rules
- `references/examples.md` - Usage examples