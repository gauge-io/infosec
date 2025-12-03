import { GoogleGenerativeAI } from '@google/generative-ai';

// Knowledge base about Gauge.io
const KNOWLEDGE_BASE = `
# Gauge.io - User Experience Consultancy

## Company Overview
Gauge.io is a user experience consultancy specializing in developer experience research, strategy and data analytics, and product and service design.

## Services Offered

### Developer Experience Research
- Specialty Recruitment: Finding and recruiting the right research participants
- Applied Ethnography: Understanding users in their natural environment
- Mixed Methods Studies: Combining qualitative and quantitative research
- Survey Design and Programming: Creating empathetic, well-designed surveys

### Strategy and Data Analytics
- Experience Mapping: Visualizing user journeys and pain points
- Audience Segmentation: Understanding different user groups
- Persona Development: Creating actionable user personas
- Community Growth and Advocacy: Building engaged user communities

### Product and Service Design
- Heuristics and UX Assessments: Evaluating product usability
- Information Architecture: Organizing information effectively
- Interaction Design and Prototyping: Creating intuitive interfaces
- Data Visualization: Making complex data understandable

## Case Studies

### 1. Visualizing Information Security Threat Vectors
**Focus:** Helping SecOps professionals visualize and prioritize security threats
**Services:** Survey Design and Programming, Mixed Methods Studies, Data Visualization
**Key Stats:** 125 analysis factors, 49 survey completions
**Approach:** Empathetic research with security professionals, humanizing risk assessment, creating radial visualizations of threat vectors
**URL:** /case-studies/visualizing-infomation-security-threat-vectors

### 2. Making the Case for Internal Tools
**Focus:** Redesigning internal tools to improve productivity
**Services:** Applied Ethnography, Experience Mapping, Interaction Design and Prototyping
**URL:** /case-studies/making-the-case-for-internal-tools

### 3. Validating Research Hypotheses at Scale
**Focus:** Combining qualitative insights with quantitative validation
**Services:** Specialty Recruitment, Mixed Methods Studies, Audience Segmentation
**URL:** /case-studies/validating-research-hypotheses-at-scale

### 4. Behavior and Identity in Virtual Worlds
**Focus:** Exploring identity and interaction patterns in virtual environments
**Services:** Applied Ethnography, Persona Development, Interaction Design and Prototyping
**URL:** /case-studies/behavior-and-identity-in-virtual-worlds

## Company Principles
Gauge.io maintains several core principles:
- Human-centric perspective in all design work
- Agile and iterative approach - "built to fail fast"
- Technology agnostic - using the best tools for each project
- Collaborative, not isolated - creating living documents and platforms for discussion
- Empathy-driven research, especially with time-pressed professionals

## Booking Meetings

### Coffee Meetings
For casual introductions and project discussions. Available at the Ferry Building in San Francisco.
**URL:** /coffee

### Podcast Introductions
For longer-form discussions about UX research, design, and industry topics.
**URL:** /podcast

## Additional Resources
- Principles page for detailed philosophy: /principles
- Case studies overview: /case-studies
- Blog with industry insights and thoughts

## Contact & Location
Based in San Francisco, with a focus on working with technical organizations and developer-focused products.
`;

// Guardrails for filtering questions
const GUARDRAILS = {
  allowedTopics: [
    'services', 'research', 'design', 'user experience', 'ux', 'case studies',
    'projects', 'portfolio', 'expertise', 'approach', 'methodology',
    'booking', 'meeting', 'coffee', 'podcast', 'introduction',
    'principles', 'philosophy', 'team', 'gauge', 'capabilities',
    'ethnography', 'data visualization', 'developer experience',
    'product design', 'strategy', 'analytics'
  ],

  blockedTopics: [
    'pricing', 'cost', 'price', 'fee', 'payment', 'budget', 'rate', 'salary',
    'inappropriate', 'offensive', 'personal', 'political', 'religion'
  ],

  redirectToBooking: [
    'detailed pricing', 'project cost', 'engagement terms', 'contract',
    'specific requirements', 'custom project'
  ]
};

// Check if question violates guardrails
function checkGuardrails(question) {
  const lowerQuestion = question.toLowerCase();

  // Check for blocked topics
  for (const blocked of GUARDRAILS.blockedTopics) {
    if (lowerQuestion.includes(blocked)) {
      if (blocked.includes('pric') || blocked.includes('cost') || blocked.includes('fee') || blocked.includes('budget') || blocked.includes('rate')) {
        return {
          allowed: false,
          response: "I can't discuss specific pricing or costs here. Every project is unique! I'd recommend booking a coffee meeting with the team to discuss your specific needs and get a tailored proposal. You can book a time at [/coffee](/coffee)."
        };
      }
      return {
        allowed: false,
        response: "I'm here to help you learn about Gauge.io's services, case studies, and approach. Let me know if you have questions about those topics!"
      };
    }
  }

  // Check for redirect topics
  for (const redirect of GUARDRAILS.redirectToBooking) {
    if (lowerQuestion.includes(redirect)) {
      return {
        allowed: false,
        response: "That's a great question that would be best discussed directly with the team! I'd recommend booking a coffee meeting to dive into the specifics of your project. You can book a time at [/coffee](/coffee)."
      };
    }
  }

  // Check if question is about allowed topics
  const hasAllowedTopic = GUARDRAILS.allowedTopics.some(topic => lowerQuestion.includes(topic));

  if (!hasAllowedTopic && lowerQuestion.length > 10) {
    // Question might be off-topic
    const offTopicKeywords = ['weather', 'sports', 'news', 'recipe', 'how to make', 'what is the capital'];
    const isOffTopic = offTopicKeywords.some(keyword => lowerQuestion.includes(keyword));

    if (isOffTopic) {
      return {
        allowed: false,
        response: "I'm specifically here to help you learn about Gauge.io's services, case studies, and approach to UX research and design. Is there anything about Gauge you'd like to know?"
      };
    }
  }

  return { allowed: true };
}

// Main handler function
export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { question } = JSON.parse(event.body);

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Question is required' })
      };
    }

    // Check guardrails
    const guardrailCheck = checkGuardrails(question);
    if (!guardrailCheck.allowed) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer: guardrailCheck.response,
          blocked: true
        })
      };
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt with knowledge base context
    const prompt = `You are a helpful AI assistant for Gauge.io, a user experience consultancy. Your role is to help potential clients learn about Gauge's services, case studies, and approach.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}

GUIDELINES:
- Be helpful, professional, and enthusiastic about Gauge's work
- Use the knowledge base to answer questions accurately
- Include relevant URLs in markdown format when referencing pages (e.g., [coffee meeting](/coffee))
- For case studies, include the URL so users can learn more
- If asked about services, explain them clearly and suggest relevant case studies
- Suggest booking a coffee or podcast meeting when appropriate
- Keep responses concise but informative (2-4 paragraphs max)
- Use markdown formatting (bold, lists, links) to make responses scannable
- If unsure about something not in the knowledge base, say so and suggest booking a meeting
- NEVER discuss pricing, costs, or fees - always redirect to booking a meeting

USER QUESTION: ${question}

Provide a helpful, accurate response based on the knowledge base:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: answer.trim(),
        blocked: false
      })
    };

  } catch (error) {
    console.error('Error processing query:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'An error occurred processing your question. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
