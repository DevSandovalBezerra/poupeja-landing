# Usage Examples

## Basic Classification

### Classify a Single File
```bash
node .agents/skills/docs-classifier/scripts/classify.js docs/api/users.md
```

Output: `docs/api/users.md => 02-backend`

### Classify All Docs
```bash
node .agents/skills/docs-classifier/scripts/classify.js
```

Output:
```
[01-frontend]
  - ui/components.md
  - react/hooks.md

[02-backend]
  - api/rest.md
  - services/payment.md

[04-auth]
  - login-flow.md
  - jwt-setup.md
```

## Project Scanning

### Generate categories.json from Project
```bash
node .agents/skills/docs-classifier/scripts/scan-project.js
```

This detects:
- Frontend (package.json, next.config.js, src/components)
- Backend (server.js, requirements.txt)
- Database (schema.prisma, docker-compose.yml)
- Auth (auth.js, nextauth)
- Payments (stripe, pagarme)
- Testing (jest.config, pytest.ini)
- Deploy (.github, Dockerfile)

## Programmatic Usage

### Import Classification Function
```javascript
const { classifyFile, classifyDocsFolder } = require('./.agents/skills/docs-classifier/scripts/classify.js');

// Classify single file
const category = classifyFile('docs/stripe-integration.md');
console.log(category); // "05-pagamentos"

// Classify entire docs folder
const results = classifyDocsFolder();
```

### Custom Category Detection
```javascript
const { categorizeFile } = require('./.agents/skills/docs-classifier/scripts/classify.js');

// Uses 3-layer fallback automatically
const result = categorizeFile('my-doc.md');
```

## Integration with Agents

### Automatic Classification on Save
When an agent saves a new doc, automatically classify it:

```javascript
const { classifyFile } = require('./.agents/skills/docs-classifier/scripts/classify.js');

function onDocSave(filepath) {
  const category = classifyFile(filepath);
  console.log(`Saved to category: ${category}`);
}
```

## Troubleshooting

### No categories.json exists
The skill automatically falls back to Layer 1 universal categories.

### File not matching any category
Defaults to `99-geral` (General).

### Keywords not working
Check that keywords are lowercase in `categories-universal.json`.