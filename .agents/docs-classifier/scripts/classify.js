#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CATEGORIES_UNIVERSAL = require('./categories-universal.json');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const CATEGORIES_FILE = path.join(DOCS_DIR, '.categories.json');

function loadUniversalCategories() {
  return CATEGORIES_UNIVERSAL.categories;
}

function loadProjectCategories() {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const content = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      return JSON.parse(content).categories || JSON.parse(content);
    }
  } catch (e) {
    console.error('Error loading project categories:', e.message);
  }
  return null;
}

function extractKeywords(filename, content = '') {
  const text = (filename + ' ' + (content || '')).toLowerCase();
  
  const allKeywords = new Set();
  
  loadUniversalCategories().forEach(cat => {
    cat.keywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) {
        allKeywords.add(cat.id);
      }
    });
  });
  
  return Array.from(allKeywords);
}

function classifyFile(filePath, projectCategories = null) {
  const filename = path.basename(filePath);
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').substring(0, 1000) : '';
  
  const matchedUniversal = extractKeywords(filename, content);
  const matchedProject = projectCategories 
    ? extractKeywords(filename, content) 
    : [];
  
  const allMatches = [...new Set([...matchedUniversal, ...matchedProject])];
  
  if (allMatches.length === 0) {
    return '99-geral';
  }
  
  return allMatches[0];
}

function categorizeFile(filename) {
  const projectCategories = loadProjectCategories();
  
  if (projectCategories) {
    const projectMatch = findMatch(filename, projectCategories);
    if (projectMatch) return projectMatch;
  }
  
  return classifyFile(filename);
}

function findMatch(filename, categories) {
  const text = filename.toLowerCase();
  
  for (const cat of categories) {
    if (cat.keywords) {
      for (const kw of cat.keywords) {
        if (text.includes(kw.toLowerCase())) {
          return cat.id;
        }
      }
    }
  }
  
  return null;
}

function classifyDocsFolder() {
  const projectCategories = loadProjectCategories();
  const results = {};
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.log('docs/ folder not found');
    return;
  }
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.txt') || item.endsWith('.json')) {
        const relativePath = path.relative(DOCS_DIR, fullPath);
        const category = classifyFile(fullPath, projectCategories);
        
        results[relativePath] = category;
      }
    }
  }
  
  walkDir(DOCS_DIR);
  
  console.log('Classification Results:');
  console.log('========================');
  
  const grouped = {};
  Object.entries(results).forEach(([file, cat]) => {
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(file);
  });
  
  Object.entries(grouped).sort().forEach(([cat, files]) => {
    console.log(`\n[${cat}]`);
    files.forEach(f => console.log(`  - ${f}`));
  });
  
  return results;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  classifyDocsFolder();
} else if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
docs-classifier - Automatic documentation classifier

Usage:
  node classify.js              Classify all docs in docs/ folder
  node classify.js <file>      Classify a specific file

Features:
  - Layer 1: 7 universal hardcoded categories
  - Layer 2: Project-specific categories from docs/.categories.json
  - Layer 3: Default to '99-geral' if no match
  `);
} else {
  const result = classifyFile(args[0]);
  console.log(`${args[0]} => ${result}`);
}

module.exports = { classifyFile, classifyDocsFolder, categorizeFile };