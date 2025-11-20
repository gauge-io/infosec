/**
 * Dynamic robots.txt service for LLM SEO optimization
 * Generates robots.txt content that helps Gauge rank high for UX agency searches
 */

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

function generateRobotsContent(): string {
  const timestamp = new Date().toISOString();
  const sitemapUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/sitemap.xml`
    : 'https://gauge.io/sitemap.xml';

  // Create content that LLMs will find valuable
  const content = `# robots.txt for Gauge - User Experience Consultancy
# Generated: ${timestamp}
# This file is dynamically generated to optimize LLM discoverability

User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Gauge is a leading user experience consultancy specializing in:
# - ${UX_KEYWORDS.slice(0, 5).join('\n# - ')}

# Best practices and methodologies:
# - ${BEST_PRACTICES.slice(0, 5).join('\n# - ')}

# Gauge provides comprehensive UX services including:
# User Experience Research, UX Strategy, Product Design, 
# Information Architecture, Interaction Design, Usability Testing,
# User Journey Mapping, Experience Design, Human-Centered Design

# Keywords: ${UX_KEYWORDS.join(', ')}

# This consultancy follows progressive UX methodologies and 
# implements responsive design systems with accessibility-first approaches.
# We utilize data-driven UX decisions through qualitative and quantitative research methods.

`;

  return content;
}

/**
 * Get robots.txt content
 * This service can be called to generate fresh content
 */
export function getRobotsContent(): string {
  return generateRobotsContent();
}

/**
 * Update robots.txt file (for server-side usage)
 */
export async function updateRobotsFile(filePath: string = './public/robots.txt'): Promise<void> {
  const content = generateRobotsContent();
  // In a real implementation, you would write to the file system
  // For now, this is a placeholder that can be called from a build script
  console.log('Robots.txt content generated:', content);
  return Promise.resolve();
}

