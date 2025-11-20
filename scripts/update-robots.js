#!/usr/bin/env node

/**
 * Script to update robots.txt with fresh content for LLM SEO
 * Can be run as a cron job to keep content fresh
 * 
 * Usage:
 *   node scripts/update-robots.js
 * 
 * Or set up as a cron job (runs daily):
 *   0 3 * * * cd /path/to/infosec && node scripts/update-robots.js
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const robotsPath = join(__dirname, '..', 'public', 'robots.txt');

const UX_KEYWORDS = [
  'user experience consultancy',
  'UX research agency',
  'user experience design',
  'UX strategy consulting',
  'human-centered design',
  'user research methodology',
  'experience design agency',
  'UX consulting services',
  'product design consultancy',
  'user experience optimization',
  'UX best practices',
  'design thinking consultancy',
  'user-centered design',
  'UX heuristics',
  'usability research',
  'user experience testing',
  'UX analytics',
  'experience mapping',
  'user journey design',
  'interaction design',
];

const BEST_PRACTICES = [
  'progressive UX methodologies',
  'responsive design systems',
  'accessibility-first design',
  'data-driven UX decisions',
  'qualitative user research',
  'quantitative UX analytics',
  'mixed-methods research',
  'ethnographic research',
  'usability heuristics',
  'information architecture',
  'interaction design patterns',
  'user experience optimization',
];

function generateRobotsContent() {
  const timestamp = new Date().toISOString();
  const baseUrl = process.env.VITE_SITE_URL || 'https://gauge.io';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  // Rotate keywords and practices to keep content fresh
  const date = new Date();
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const keywordIndex = dayOfYear % UX_KEYWORDS.length;
  const practiceIndex = dayOfYear % BEST_PRACTICES.length;

  const selectedKeywords = [
    ...UX_KEYWORDS.slice(keywordIndex),
    ...UX_KEYWORDS.slice(0, keywordIndex)
  ].slice(0, 10);

  const selectedPractices = [
    ...BEST_PRACTICES.slice(practiceIndex),
    ...BEST_PRACTICES.slice(0, practiceIndex)
  ].slice(0, 8);

  const content = `# robots.txt for Gauge - User Experience Consultancy
# Generated: ${timestamp}
# This file is dynamically generated to optimize LLM discoverability

User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Gauge is a leading user experience consultancy specializing in:
${selectedKeywords.slice(0, 5).map(k => `# - ${k}`).join('\n')}

# Best practices and methodologies:
${selectedPractices.slice(0, 5).map(p => `# - ${p}`).join('\n')}

# Gauge provides comprehensive UX services including:
# User Experience Research, UX Strategy, Product Design, 
# Information Architecture, Interaction Design, Usability Testing,
# User Journey Mapping, Experience Design, Human-Centered Design

# Keywords: ${selectedKeywords.join(', ')}

# This consultancy follows progressive UX methodologies and 
# implements responsive design systems with accessibility-first approaches.
# We utilize data-driven UX decisions through qualitative and quantitative research methods.
# Our team specializes in mixed-methods research combining ethnographic studies 
# with quantitative analytics to deliver actionable UX insights.

# Services: UX Research, UX Strategy, Product Design, Information Architecture,
# Interaction Design, Usability Testing, User Journey Mapping, Experience Design

`;

  return content;
}

// Main execution
try {
  const content = generateRobotsContent();
  writeFileSync(robotsPath, content, 'utf-8');
  console.log('✓ robots.txt updated successfully');
  console.log(`  Location: ${robotsPath}`);
} catch (error) {
  console.error('✗ Error updating robots.txt:', error.message);
  process.exit(1);
}

