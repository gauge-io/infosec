/**
 * Service data structure for Gauge.io
 * This can be reused across all gauge.io domain sites
 * 
 * To update services from Google Doc:
 * https://docs.google.com/document/d/1XgIQg0Xee3XuFAdjyel46rEoxpyLRp9AhxSHX0he9eE/edit?usp=sharing
 * 
 * Copy the text content for each service and paste into the 'details' field as plain text.
 * The service name should match the header in the document.
 */

export interface Service {
  id: string;
  name: string;
  category: 'Research' | 'Strategy' | 'Design';
  description: string;
  details?: string; // Plain text content from Google Doc
  image?: string; // Optional image for the service
}

export const SERVICES: Service[] = [
  // Research Services
  {
    id: 'specialty-recruitment',
    name: 'Specialty Recruitment',
    category: 'Research',
    description: 'Recruiting specialized participants for user research studies.',
    details: `Finding the right audience for targeted customer feedback is difficult. The more specialized, technical or complex the product or service – the more elusive the recruit. The large IDI recruitment portals, even the niche ones, still don't offer this level of specificity or understanding of your target personas.

Gauge dives deep to find these relevant conversations wherever potential they may roam. We specialize in the highly technical, reclusive participants – those who are immune to typical outreach methods and require a more personalized, individual approach. The DevOps and MLOps, the System Administrators, and the Security Professionals – we speak their language.

Gauge can help you establish a continual recruitment process to maintain these user-centered approaches for your company or organization. Over time, your team can build upon these validated methods to help make more informed strategic product and marketing decisions.`,
  },
  {
    id: 'applied-ethnography',
    name: 'Applied Ethnography',
    category: 'Research',
    description: 'Deep ethnographic research to understand user behaviors and contexts.',
    details: `Gauge is constantly weighing a number of different ethnographic methods in their assessment of the field. From mobile ethnography to observational studies to IDIs – finding the right context for conversation is both an art and a science. We build our qualitative and quantitative narratives with the foundation of sound scientific processes to back up our findings – avoiding ambiguous and irrelevant results.

Gauge will guide you through repeatable, grounded research methodologies – ones that use a thorough coding structure and comprehensive respondent analysis. We'll ensure both efficiency in process and effectiveness in result, making our shared research findings more insightful and impervious to criticism.`,
  },
  {
    id: 'mixed-methods-studies',
    name: 'Mixed Methods Studies',
    category: 'Research',
    description: 'Combining qualitative and quantitative research methods for comprehensive insights.',
    details: `Gauge specializes in bridging qualitative emotion with quantitative validation. We enjoy working at scale, as well as tying in a macro-level understanding of the abstract concepts we're trying to grasp, personalizing some of the trends found in the data itself.

Whether you're looking to explore underlying themes behind different perspectives or needing to clarify the rationale behind statistical insights gained from previous larger-scale, quantitative research efforts – Gauge helps you bridge the two into coherent parts of the same story into a mixed methods study.`,
  },
  {
    id: 'survey-design',
    name: 'Survey Design and Programming',
    category: 'Research',
    description: 'Designing and programming effective surveys for data collection.',
    details: `Gauge implements modern research platforms that allow your organization to easily conduct customer and market research. We are independent of platform, and can apply survey programming to any portal – each has their strengths and weaknesses. We've coded surveys for seven different countries, all using unique content, displaying instruction in five different languages.

Gauge also offers researchers the ability to recruit and fulfill large-scale, international research studies done entirely through SMS message. All surveys and experiences are, by default, mobile compatible and tailored to fit the limited time and attention spans of a younger generation.`,
  },
  
  // Strategy Services
  {
    id: 'experience-mapping',
    name: 'Experience Mapping',
    category: 'Strategy',
    description: 'Mapping user experiences to identify pain points and opportunities.',
    details: `Whether it be for the employee or the customer, Experience Mapping strives to document every channel, every variable, and every possible instance of an organization's touchpoints within the design of service. Using tools like blueprinting, journey mapping, and front and backstage assessments, we'll help you translate any initial research artifacts into collaborative presentations that will serve as a single source of truth for both you and your department.

Gauge uses Experience Mapping when needing to better understand where the current state of an employee or customer process currently resides, identifying opportunities to increase satisfaction and retention through the removal of blockers or pain points. Whatever your goal for improvement, Gauge will help you define the touchpoints, actors and dependencies that present both the current challenges as well as opportunities for innovation.`,
  },
  {
    id: 'audience-segmentation',
    name: 'Audience Segmentation',
    category: 'Strategy',
    description: 'Segmenting audiences to better understand and target user groups.',
    details: `Understanding the similarities and differences between your customers is one of the most basic, fundamental steps in prioritizing their importance.

Gauge will work with you to aggregate different datasets both internally and externally – through sources such as web analytics, customer lists, sales data, third-party reports and the results from custom surveys. Together we can cluster and cross-reference this data, analyzing different dimensions, and identify any telling factors. Gauge can help you create a bridge model that connects your customer record with quantitative surveys.

Use segmentation to better prioritize the customers that are driving your organization's growth. Target relevant features in the product, focus your marketing efforts, and begin your grounded Persona Development through this fundamental research method.`,
  },
  {
    id: 'persona-development',
    name: 'Persona Development',
    category: 'Strategy',
    description: 'Creating detailed user personas to guide design decisions.',
    details: `The better you understand your audience, the more effectively you will be able to reach them. Personas are distilled versions of your segmented target customers, the ones who represent the majority of your business. These personas should drive the voices and unmet needs behind your content creation, product development, sales conversations, and customer retention. Subjectivity abounds in crafting an emotional connection.

For Gauge, user research efforts precede every Persona Development project. Through qualitative interviews and quantitative analysis, together we'll define the priorities, emotions, workflows behind your current users, as well as help you define new archetypes. Whether you are just starting out, trying to find the right fit for your product, or planning for growth by revisiting existing segments – Gauge helps understand your customers so that you can align your voice, content and features to serve them best.`,
  },
  {
    id: 'community-growth',
    name: 'Community Growth and Advocacy',
    category: 'Strategy',
    description: 'Building and growing user communities and advocacy programs.',
    details: `Don't narrow your design efforts solely around the end user experience. Instead, position your organization to become user-centric from the ground up by designing supported communities of influential users. Have confidence that harvesting the view of the customer consistently over time can better facilitate your internal decision-making processes, providing opinions that are rooted in their real-world usage, free of politics or departmental bias.

Yet, change doesn't happen overnight. Gauge will initiate your Customer Advocacy efforts by recruiting, screening, organizing and growing communities of your users – both by joining them where they congregate or establishing new, relevant forums. Over time, these groups will be nurtured enough to attract and grow their own advocates, reaffirming influencers to continue their encouragement, training your users to support one another.`,
  },
  
  // Design Services
  {
    id: 'heuristic-assessment',
    name: 'Heuristic UX Assessment',
    category: 'Design',
    description: 'Evaluating user experience using established heuristics and best practices.',
    details: `The first step in making customer-centric organizational improvements is to carry out a current state analysis for user-centered design principles. Gauge helps organizations understand the "what is", in order to make plans for "what could be". For the past two decades, Gauge provided insight on both the functions and dysfunctions of Design and UX teams across a number of organizations; we are confident we can help yours improve, too.

First, Gauge will work with you to audit current capabilities and practices – to better assess the fiction and the reality of any user-centered design principles. For example these might include incorporation of any user feedback iterative design techniques, or multi-disciplinary approaches. Through internal interviews and a better understanding of your process, Gauge will recommend how to make your design and development more efficient.`,
  },
  {
    id: 'information-architecture',
    name: 'Information Architecture',
    category: 'Design',
    description: 'Structuring information for optimal user navigation and understanding.',
    details: `Content is often generated through scattered processes across different departments and multiple product owners. As your product or organization grows, these haphazard efforts result in a confusing mishmash of features, categories and navigation.By conducting a thorough content audit of your product, in combination with leveraging any available analytical data, Gauge can better understand your common workflows, identify any bottlenecks and offer recommendations for improvement. Effective Information Architecture will result in more natural relationships between key elements and, in turn, a more usable product.

In combination with affinity sorting, use these Information Architecture processes before any product launch, when preparing for a major redesign, or to find causality for a lack of traffic, exposure or feature adoption. A good User Experience is a planned one.`,
  },
  {
    id: 'interaction-design',
    name: 'Interaction Design and Prototyping',
    category: 'Design',
    description: 'Designing interactions and creating prototypes for user testing.',
    details: `Building prototypes of a physical or digital product helps to fail fast and iterate quickly. Product Prototyping will also provide a more accurate estimate of both project costs and needed resources, as well as beginning early the investigative work of observing initial user acceptance and uncovering important trends in behavior patterns.

There are a variety of prototyping tools and techniques available, with more platforms introduced seemingly every day. Gauge can help guide you to the most cost-effective choice for your needed level of fidelity and context for your product or service.A well-designed product or application rarely starts out as such. Gauge specializes in the rapid iteration of interactive wireframes and clickable prototypes which define preliminary interaction and component states occurring long before any styles are applied.`,
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    category: 'Design',
    description: 'Creating clear and effective visualizations of complex data.',
    details: `Gauge seeks to employ data visualization in everything that it does. We believe that this level of abstraction allows us to talk about the problem in a holistic way, uncovering patterns or trends that might reveal themselves. We are platform agnostic, not being tied to any one software suite or technology. Many times, our work is based on open source software, and we often contribute to development and research communities.

Whether using structured or unstructured data, Data Visualization sits at the intersection of storytelling and analysis, allowing for rich detail across multiple dimensions – whether they be, for example, spatial, hierarchical or chronological. These elegant displays of information should also be beautiful, designed to encourage curiosity, wonder and play.

Through a customized data visualization development process, Gauge can help you uncover the clusters, patterns, trends, outliers and correlations within your data – helping you collaborate and find actionable insights from your research efforts.`,
  },
];

export function getServicesByCategory(category: Service['category']): Service[] {
  return SERVICES.filter(service => service.category === category);
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id);
}

