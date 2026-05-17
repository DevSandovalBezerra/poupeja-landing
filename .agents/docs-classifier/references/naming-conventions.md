# Document Naming Conventions

## File Naming Rules

### General Guidelines
- Use lowercase with hyphens: `getting-started.md`
- Be descriptive but concise: `stripe-checkout-integration.md`
- Include category prefix when helpful: `01-frontend-react-components.md`

### Recommended Patterns

| Category | Pattern | Example |
|----------|---------|---------|
| Frontend | `{topic}.md` | components.md, styling-guide.md |
| Backend | `{topic}.md` | api-endpoints.md, middleware.md |
| Database | `{topic}.md` | schema.md, migrations.md |
| Auth | `{topic}.md` | login-flow.md, jwt-setup.md |
| Payments | `{provider}-{topic}.md` | stripe-webhooks.md |
| Testing | `{type}-guide.md` | unit-testing.md, e2e-tests.md |
| Deploy | `{platform}-{topic}.md` | vercel-deploy.md |

## Folder Structure

```
docs/
├── 01-frontend/          # Frontend docs
│   ├── components/
│   └── styling/
├── 02-backend/          # Backend docs
│   ├── api/
│   └── services/
├── 03-database/        # Database docs
├── 04-auth/            # Auth docs
├── 05-pagamentos/     # Payment docs
├── 06-testes/          # Testing docs
├── 07-deploy/         # Deployment docs
└── 99-geral/          # General docs
```

## Categories.json Structure

```json
{
  "categories": [
    {
      "id": "01-frontend",
      "name": "Frontend",
      "keywords": ["frontend", "ui", "react", "component"]
    }
  ]
}
```

## Best Practices

1. **Keep it simple** - Use obvious keywords
2. **Be consistent** - Same pattern across all docs
3. **Think of search** - Name files how you'd search for them
4. **Avoid duplicates** - One doc per topic