#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(process.cwd(), 'docs');
const CATEGORIES_FILE = path.join(DOCS_DIR, '.categories.json');

function detectTechStack() {
  const stack = {
    frontend: false,
    backend: false,
    database: false,
    auth: false,
    payments: false,
    testing: false,
    deploy: false
  };
  
  const indicators = {
    frontend: ['package.json', 'next.config', 'vite.config', 'tailwind.config', 'src/pages', 'src/components'],
    backend: ['server.js', 'app.js', 'index.js', 'main.py', 'requirements.txt', 'pyproject.toml'],
    database: ['schema.prisma', 'migrations', '.env', 'docker-compose.yml'],
    auth: ['auth.js', 'nextauth', 'clerk', 'jwt', 'passport'],
    payments: ['stripe', 'pagarme', 'mercadopago', 'payment'],
    testing: ['jest.config', 'vitest.config', 'cypress', 'playwright.config', 'pytest.ini'],
    deploy: ['.github', 'vercel.json', 'Dockerfile', 'docker-compose', '.dockerignore']
  };
  
  const rootFiles = fs.readdirSync(process.cwd());
  
  for (const [category, files] of Object.entries(indicators)) {
    for (const file of files) {
      if (rootFiles.includes(file) || fs.existsSync(path.join(process.cwd(), file))) {
        stack[category] = true;
      }
    }
  }
  
  return stack;
}

function generateCategoriesFromProject() {
  const stack = detectTechStack();
  const categories = [];
  
  if (stack.frontend) {
    categories.push({
      id: "01-frontend",
      name: "Frontend",
      keywords: ["frontend", "ui", "react", "javascript", "component", "page", "layout", "tailwind", "css", "responsive"]
    });
  }
  
  if (stack.backend) {
    categories.push({
      id: "02-backend",
      name: "Backend",
      keywords: ["backend", "api", "server", "endpoint", "route", "controller", "service", "handler"]
    });
  }
  
  if (stack.database) {
    categories.push({
      id: "03-database",
      name: "Database",
      keywords: ["database", "schema", "model", "migration", "query", "prisma", "sql", "table", "relation"]
    });
  }
  
  if (stack.auth) {
    categories.push({
      id: "04-auth",
      name: "Authentication",
      keywords: ["auth", "login", "password", "jwt", "token", "session", "oauth", "user", "role", "permission"]
    });
  }
  
  if (stack.payments) {
    categories.push({
      id: "05-pagamentos",
      name: "Pagamentos",
      keywords: ["payment", "pagamento", "stripe", "pagarme", "checkout", "invoice", "billing", "subscription"]
    });
  }
  
  if (stack.testing) {
    categories.push({
      id: "06-testes",
      name: "Testes",
      keywords: ["test", "testing", "jest", "cypress", "spec", "mock", "coverage", "unit", "integration"]
    });
  }
  
  if (stack.deploy) {
    categories.push({
      id: "07-deploy",
      name: "Deploy",
      keywords: ["deploy", "ci", "cd", "pipeline", "github", "vercel", "docker", "build", "release"]
    });
  }
  
  categories.push({
    id: "99-geral",
    name: "Geral",
    keywords: ["readme", "getting started", "guide", "overview", "index", "introduction", "about", "changelog"]
  });
  
  return categories;
}

function scanDocsFolder() {
  console.log('Scanning project structure...\n');
  
  const stack = detectTechStack();
  console.log('Detected technologies:');
  Object.entries(stack).filter(([_, v]) => v).forEach(([k]) => console.log(`  ✓ ${k}`));
  
  console.log('\nGenerating categories.json...');
  
  const categories = generateCategoriesFromProject();
  
  const output = {
    source: "scan-project.js",
    generated: new Date().toISOString(),
    categories: categories
  };
  
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(output, null, 2));
  console.log(`\nCreated: ${CATEGORIES_FILE}`);
  console.log(`Total categories: ${categories.length}`);
  
  return output;
}

function checkCategoriesFile() {
  if (fs.existsSync(CATEGORIES_FILE)) {
    console.log('categories.json already exists');
    const content = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));
    console.log(`Categories: ${content.categories?.length || 0}`);
    return true;
  }
  return false;
}

const args = process.argv.slice(2);

if (args[0] === '--check') {
  checkCategoriesFile();
} else if (args[0] === '--regenerate') {
  scanDocsFolder();
} else {
  if (!checkCategoriesFile()) {
    scanDocsFolder();
  }
}

module.exports = { scanDocsFolder, detectTechStack, generateCategoriesFromProject };