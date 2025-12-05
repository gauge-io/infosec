import pic12DataVisualization from '../assets/pic-12-data-visualization.png';
import pic11InteractionDesign from '../assets/pic-11-interaction-design-prototyping.png';
import pic3MixedMethods from '../assets/pic-3-mixed-methods.png';
import pic2Ethnography from '../assets/pic-2-ethnography.png';

// Case study background images
import threatVectorsBg from '../assets/case-studies/threat-vectors-bg.png';
import internalToolsBg from '../assets/case-studies/internal-tools-bg.png';
import validatingBg from '../assets/case-studies/validating-hypotheses-bg.png';
import behaviorBg from '../assets/case-studies/behavior-bg.png';

// Case study tile images
import threatVectorsTile from '../assets/case-studies/threat-vectors-tile.png';
import internalToolsTile from '../assets/case-studies/internal-tools-tile.png';
import validatingTile from '../assets/case-studies/validating-tile.png';
import virtualWorldsTile from '../assets/case-studies/virtual-worlds-tile.png';

// Threat Vectors images
import threatVectors1Thumb from '../assets/case-studies/threat-vectors-1-thumb.png';
import threatVectors2Thumb from '../assets/case-studies/threat-vectors-2-thumb.png';
import threatVectors3Thumb from '../assets/case-studies/threat-vectors-3-thumb.png';
import threatVectors4Thumb from '../assets/case-studies/threat-vectors-4-thumb.png';
import threatVectors1 from '../assets/case-studies/threat-vectors-1.png';
import threatVectors2 from '../assets/case-studies/threat-vectors-2.png';
import threatVectors3 from '../assets/case-studies/threat-vectors-3.png';
import threatVectors4 from '../assets/case-studies/threat-vectors-4.png';

// Internal Tools images
import internalTools1Thumb from '../assets/case-studies/internal-tools-1-thumb.png';
import internalTools2Thumb from '../assets/case-studies/internal-tools-2-thumb.png';
import internalTools3Thumb from '../assets/case-studies/internal-tools-3-thumb.png';
import internalTools4Thumb from '../assets/case-studies/internal-tools-4-thumb.png';
import internalTools5Thumb from '../assets/case-studies/internal-tools-5-thumb.png';
import internalTools1 from '../assets/case-studies/internal-tools-1.png';
import internalTools2 from '../assets/case-studies/internal-tools-2.png';
import internalTools3 from '../assets/case-studies/internal-tools-3.png';
import internalTools4 from '../assets/case-studies/internal-tools-4.png';
import internalTools5 from '../assets/case-studies/internal-tools-5.png';

// Validating images
import validating1Thumb from '../assets/case-studies/validating-1-thumb.png';
import validating2Thumb from '../assets/case-studies/validating-2-thumb.png';
import validating3Thumb from '../assets/case-studies/validating-3-thumb.png';
import validating4Thumb from '../assets/case-studies/validating-4-thumb.png';
import validating1 from '../assets/case-studies/validating-1.png';
import validating2 from '../assets/case-studies/validating-2.png';
import validating3 from '../assets/case-studies/validating-3.png';
import validating4 from '../assets/case-studies/validating-4.png';
import validating5 from '../assets/case-studies/validating-5.png';
import validating6 from '../assets/case-studies/validating-6.png';

// Behavior images
import behavior1Thumb from '../assets/case-studies/behavior-1-thumb.png';
import behavior2Thumb from '../assets/case-studies/behavior-2-thumb.png';
import behavior3Thumb from '../assets/case-studies/behavior-3-thumb.png';
import behavior4Thumb from '../assets/case-studies/behavior-4-thumb.png';
import behavior5Thumb from '../assets/case-studies/behavior-5-thumb.png';
import behavior1 from '../assets/case-studies/behavior-1.png';
import behavior2 from '../assets/case-studies/behavior-2.png';
import behavior3 from '../assets/case-studies/behavior-3.png';
import behavior4 from '../assets/case-studies/behavior-4.png';
import behavior5 from '../assets/case-studies/behavior-5.png';
import behavior6 from '../assets/case-studies/behavior-6.png';
import behavior7 from '../assets/case-studies/behavior-7.png';

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudyService {
  title: string;
  description: string;
}

export interface CaseStudyContentSection {
  title?: string;
  content: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  type?: 'paragraph' | 'pullQuote';
}

export interface CaseStudyModalImage {
  src: string;
  thumbnail?: string;
  caption: string;
}

export interface CaseStudy {
  title: string;
  slug: string;
  description: string;
  intro?: string; // Longer intro paragraph for detail page
  services: string[];
  color: 'fuscia' | 'mango' | 'blue' | 'purple';
  image: string; // Main image for tiles
  backgroundImage?: string; // Full-width background image
  tileImage?: string; // Image for case study tiles
  category?: string;
  stats?: CaseStudyStat[];
  advisoryServices?: CaseStudyService[];
  contentSections?: CaseStudyContentSection[];
  modalImages?: CaseStudyModalImage[]; // Images for modal carousel
}

export const caseStudies: CaseStudy[] = [
  {
    title: "Making the Case for Internal Tools",
    slug: "making-the-case-for-internal-tools",
    description: "Redesigning internal tools through ethnographic research to improve productivity and reduce user frustration.",
    intro: "Gauge has enabled even some of the most innovative organizations to re-invest themselves in their own operational efficiency. This, in turn, helps increase employee satisfaction, reduces errors in workflow and most importantly – prevents turnover of staff.",
    services: [
      "Applied Ethnography",
      "Experience Mapping",
      "Interaction Design and Prototyping"
    ],
    color: "blue",
    image: pic11InteractionDesign,
    backgroundImage: internalToolsBg,
    tileImage: internalToolsTile,
    category: "Financial Technology",
    modalImages: [
      { src: internalTools1, thumbnail: internalTools1Thumb, caption: "Individual componet design illustrations showcased the different states of interaction." },
      { src: internalTools2, thumbnail: internalTools2Thumb, caption: "Workflows were mapped with logic and understanding of different conditions." },
      { src: internalTools3, thumbnail: internalTools3Thumb, caption: "1:1 interviews with dozens of Affirm staff and walkthroughs of current workflows (and work-arounds)." },
      { src: internalTools4, thumbnail: internalTools4Thumb, caption: "Journey maps illustrated dependencies and internal responsibilities with Affirm's personas." },
      { src: internalTools5, thumbnail: internalTools5Thumb, caption: "Gauge built a prototyping platform based upon Affirm's Storybook components to peform UX testing for a new workflow." }
    ],
    stats: [
      { value: "$23b", label: "Under management" },
      { value: "5x", label: "Personas defined" },
      { value: "129", label: "Components implemented" }
    ],
    contentSections: [
      {
        title: "Understanding of Complex Workflows",
        content: "Gauge has researched, strategized and designed different systematic workflows around role-based access, auditing and permissions for organizations within Financial Services, Developer Operations and Cybersecurity organizations. We have helped ensure that these organizations remain in compliance, take forward-thinking practices, and enable an environment with transparency and accountability at its core.\n\nErrant actions can impact many, with a mistaken approval or deletion taking down a system or service – wiping weeks of employee productivity off the books. Through a thorough understanding of how to improve a team's workflow, Gauge can help them stay productive.",
        imagePosition: 'left'
      },
      {
        title: "Being Behind the Lines",
        content: "Gauge works with those in the trenches and behind the lines, often doing the less-than-glamorous jobs of ensuring that others can shine as bright. Building out an effective set of internal tools takes the common research practices and turns them internally – employing user-centric principles, now applying them to improve the employee experience instead.",
        imagePosition: 'right'
      },
      {
        type: 'pullQuote',
        content: "...enable an environment with transparency and accountability at its core..."
      },
      {
        title: "Empathy for Difficult Roles",
        content: "Gauge understands that the products we research design are only one in a long list of tools. The nature of Operations and Administration roles are that products rarely ever exist in isolation. Instead, especially in times of crisis, the best experience is one that is completed as quickly as possible, enabling the user to move onto putting out (yet another) fire. The punchlist of a playbook is a dizzying one, and the reverence in which we treat our product's positioning and messaging is not taken lightly.\n\nWe want to improve that feeling of satisfaction around task completion. When you're teed up for success, and your organization's internal tools and systems help enable this.",
        imagePosition: 'right'
      },
      {
        title: "Discreet and Direct",
        content: "Gauge understands that there are some demographics that are impervious to traditional recruitment methods. Through internal channels and communities, Gauge is able to discreetly approach even the most reclusive, in a manner that encourages candor and collaboration.\n\nResearch methods for demographics and roles such as these requires an operational understanding of the constraints of highly technical environments. Gauge applies mixed methods of research and discussion that are both efficient and respectful of the time and inherent challenges our participants face.",
        image: internalTools3Thumb,
        imagePosition: 'left'
      },
      {
        type: 'pullQuote',
        content: "...seeing the broader picture helps all parties understand problems on a number of different levels..."
      },
      {
        title: "Mapping a Shared Journey",
        content: "Seeing the broader picture helps all parties understand problems on a number of different levels, from the individual user experience to the organizational workflow dynamics. Gauge effectively maps a shared journey, complete with legal and system constraints, regulatory requirements, and cross-functional dependencies, in order to better design the service and all of its touch points for internal teams. This comprehensive mapping process ensures that every stakeholder, from end users to system administrators, can visualize and understand how their roles intersect within the larger operational ecosystem.",
        image: internalTools5Thumb,
        imagePosition: 'right'
      },
      {
        title: "Unique to B2B Environments",
        content: "There exists a different mentality for applications that are used solely within technical business environments. Artifacts of the terminal commands are still prevalent, with keyboard shortcuts and navigation being commonplace, removing animation and subtleties that may slow down time on task. Consumer elements of virality and aesthetic are removed in favor of efficiency and effectiveness.",
        imagePosition: 'right'
      }
    ]
  },
  {
    title: "Visualizing Information Security Threat Vectors",
    slug: "visualizing-infomation-security-threat-vectors",
    description: "Helping SecOps professionals visualize and prioritize security threats through empathetic research and data visualization.",
    intro: "Gauge knows what it is like for those pushing the pixels everyday. The CISOs who perform thankless jobs, often changing organizations every eighteen months. The System Administrators, having to juggle licenses and credentials for tens of thousands of users. The Security Operations professionals, faced with a noisy burn-down queue of tickets, any of which may be revealed as immutable threats to an organization.",
    services: [
      "Survey Design and Programming",
      "Mixed Methods Studies",
      "Data Visualization"
    ],
    color: "fuscia",
    image: pic12DataVisualization,
    backgroundImage: threatVectorsBg,
    tileImage: threatVectorsTile,
    category: "Information Security",
    modalImages: [
      { src: threatVectors1, thumbnail: threatVectors1Thumb, caption: "Gauge developed a Design System for ZeroWall to visualize the potential threats, based upon survey response data." },
      { src: threatVectors2, thumbnail: threatVectors2Thumb, caption: "Each of the five segments represented threat vectors into a respondent's data." },
      { src: threatVectors3, thumbnail: threatVectors3Thumb, caption: "Velocity of attack illustrated likelyhood and frequency dimensions; mitigations were shown to portray what defense mechanisms were in place." },
      { src: threatVectors4, thumbnail: threatVectors4Thumb, caption: "These were all based on a custom designed and programmed CISO survey, collecting over a hundred variables for analysis." }
    ],
    stats: [
      { value: "125", label: "Analysis factors" },
      { value: "49", label: "Survey completions" }
    ],
    advisoryServices: [
      {
        title: "Survey Design and Programming",
        description: "Designing a survey that is empathetic to SecOps professionals takes tact. They're pressed for time, and naturally sensitive to attaching their name to anything. Gauge understands and accommodates this shared language of conditioning expectations around privacy, data handling and reporting."
      },
      {
        title: "Mixed Methods Research",
        description: "Gauge challenges the antiquated research participant experience, forcing participants having to fill out repetitious forms, and badgering email-based reminders. These artifacts belong to a different generation. Gauge employs suites that incorporate NLP to allow participants to speak naturally using the devices they already have in the palm of their hands."
      },
      {
        title: "Product Design and Prototyping",
        description: "When dealing with the security of an organization, you're not allowed to miss a beat. Gauge works with clients in cybersecurity to help them realize a more efficient way of processing the overwhelming number of threats that come into the burndown queue each and every day. Gauge isolates that which is important, and that which is just noise."
      }
    ],
    contentSections: [
      {
        title: "Humanising Risk",
        content: "Security Operations professionals often take risk assessment surveys, either for SOC2 compliance or typically when dealing with their organization's insurers. When designing this survey, it was important for Gauge to, along with the standard people, process and technology queries, position questions centering around the participant's subjective opinions. Effectively probing these emotions of fear helped understand the internal threats that relate to their risk profile – you don't protect yourself against something you don't fear. Not merely satisfied with just checking the boxes, Gauge always designs experiences with a human-centric perspective in mind.\n\nGauge challenges how we've abstracted network topographies in the past by modeling a radial representation of different threat vectors and how well an organization is doing to mitigate them. Traditional methods of drawing network maps through Visual Basic and Powerpoint have resulted in low comprehension of complex environments. Dimensions of threat impact and occurrence are best shown as motion-based elements that portray a sense of urgency. Nodes of mitigation may be in various states of completion, as our perfect defense against external threats is often anything but.",
        image: pic12DataVisualization,
        imagePosition: 'right'
      },
      {
        title: "Platform for Collaboration",
        content: "The best recommendations are not delivered in isolation. Just as a doctor doesn't ever only send email an x-ray with a diagnosis to a patient, security professionals are best consoled personally with what's working and where improvement can be made. A little empathy goes a long way. This visualization suite is intended to act as a collaborative environment to aid decision-making and discussion, built to live on well past the project's duration and continuing to provide insight.\n\nGauge very rarely – and is dragged kicking and screaming – solely delivers insights in PowerPoint / slide format. Instead, it is more important for us to create hosted, interactive displays in order to provide a center-point and reference for conversation, a living document on how organizations might improve their people, process and technologies in the future.",
        imagePosition: 'left'
      },
      {
        type: 'pullQuote',
        content: "...we've got a sense of craft and process that needs to be maintained..."
      },
      {
        title: "Built to Fail, Fast",
        content: "An agile process means we've gotta be nimble. Constantly iterating, as we've got a sense of craft and process that needs to be maintained, but strive to move at the speed that the project requires. A solid command of craft and iteration, the correct balancing of priorities, and a proper understanding of scope are all needed to fail fast and dust off again for another round. We separate ourselves from the preciousness of Design, written with a capital D.",
        imagePosition: 'right'
      },
      {
        title: "Staying Agnostic",
        content: "Gauge rarely ever boxes into a single platform for any single layer of its technology stack. Instead, we typically try to conceive of new deliverables for each project we take on. It sucks, it is hard – but we find it worth it to look at each client and each project with a fresh set of eyes. Gauge stays agile, curious and agnostic with new technologies such as Natural Language Processing, Generative Text and Images and all the bells and whistles Deep Machine Learning has promised us.",
        imagePosition: 'left'
      },
      {
        type: 'pullQuote',
        content: "...our work is offered up to further the process, not be hung behind glass..."
      },
      {
        title: "Confidence in Communication",
        content: "Whereas we take pride and confidence in the decisions we've made, our work is offered up to further the process, not be hung behind glass. We put pixels to screen in order to communicate, to get a step closer to a product that can be released in the wild. There are going to be bumps in the road, stalls in the process – especially when introducing new abstracts and concepts. Just keep listening and designing.",
        imagePosition: 'right'
      }
    ]
  },
  {
    title: "Behavior and Identity in Virtual Worlds",
    slug: "behavior-and-identity-in-virtual-worlds",
    description: "Exploring identity and interaction patterns in virtual environments through ethnographic research and prototyping.",
    intro: "Despite a global pandemic where logistics were near impossible, mere conversations and simple interactions fraught with fear – Gauge forged ahead and executed a wide-ranging mixed methods research project focused around appearance and creativity in the metaverse of a virtual world.\n\nThis research spanned across seven different countries, was authored in five languages with over six thousand participants in the corresponding quantitative survey. With dozens of stakeholders and vendors in play at any given time, juggling these kinds of logistics and operations on a global basis took a deft sense of tact.",
    services: [
      "Applied Ethnography",
      "Persona Development",
      "Interaction Design and Prototyping"
    ],
    color: "purple",
    image: pic2Ethnography,
    backgroundImage: behaviorBg,
    tileImage: virtualWorldsTile,
    category: "Gaming Research",
    modalImages: [
      { src: behavior1, thumbnail: behavior1Thumb, caption: "In the midst of a global pandemic, Gauge safely conducted hundreds of interviews in skate shops and parks around the world." },
      { src: behavior2, thumbnail: behavior2Thumb, caption: "Gauge recruited for and programmed a complex, mobile compatible survey in five languages." },
      { src: behavior3, thumbnail: behavior3Thumb, caption: "Gauge applied Qualitative and Quantitative Research methods to Electronic Arts for strategy on their upcoming release of a skateboarding title." },
      { src: behavior4, thumbnail: behavior4Thumb, caption: "Working with an illustration shop, Gauge provided survey response artifacts for which participants could provide subjective response." },
      { src: behavior5, thumbnail: behavior5Thumb, caption: "Gauge worked ethically and responsibly in their research approach with the youth market." },
      { src: behavior6, caption: "Gauge was able to analyze and segment data from over 7,000 responses from seven different countries around the world." },
      { src: behavior7, caption: "Regional variances shown through, from Brazil to Japan – each skating subculture was so unique and wonderful." }
    ],
    stats: [
      { value: "6.4k", label: "Survey Participants" },
      { value: "7", label: "Countries" },
      { value: "5", label: "Languages" }
    ],
    contentSections: [
      {
        title: "Sowing Seeds of Creativity",
        content: "The success or failure of a virtual world is whether there are those that make it an active, vibrant environment through their contributions. Without this organic creativity, there is no growth, no life. We often look at the success or failure of an environment with the lens of overall profitability and net sales – a worthy end-state to focus on. However, these outcomes occur further down the lifecycle, the after-effects of an organization's up-front investment encouraging the grinders and creators. A community that has been empowered within a digital world by their creativity will make it their own. Profit will follow.\n\nThrough fieldwork, Gauge understands that there are inherent differences in behavior from country-to-country, from region-to-region. There will be societies that are not as ready to criticize and provide negative opinion, as well as those who have no qualms about subjectively tearing it all apart. Conditioning for these responses and anticipating these variances takes experience with coordinating and executing global research studies. Gauge will guide you through these nuances – helping you prepare for the variances in different dimensions of data, making sure that our time together spent in analysis is time well spent.",
        imagePosition: 'right'
      },
      {
        title: "Different Sides of the Mirror",
        content: "Gauge helped define a research plan that drew perspectives from both sides of this business model, one that was inclusive of both sides of the spectrum of virtual capitalism – marrying those who buy and/or create, along with those who sell. We sought to better understand the downward pressures on the merchants who ride the line in maintaining their own brick-and-mortar's profitability, at the same time growing their next generation of consumers by maintaining relevance in a very cyclical industry of fashion. Conversely, Gauge took to the streets in countries around the world, talking with consumers on their purchasing and habits on both virtual and IRL appearances, how they delineated their identity in one medium over the other.",
        imagePosition: 'left'
      },
      {
        type: 'pullQuote',
        content: "...we respect the cultures that we immerse ourselves in, whether physically or digitally..."
      },
      {
        title: "Ethical Ethnography",
        content: "The post-COVID world has defined a different method of practice ethnography. Quarantines and shutdowns are impeding our ability to connect with one another. Subtleties of smiles or suggestion are hidden behind masks, challenging the researcher to connect emotionally. Gauge respects the cultures that we immerse ourselves in, whether physically or digitally. We only use local guides and fixers for logistics, offer permission and cede control to the participant to bind the interview process with how they would like the conversation to go. Through these practices, Gauge creates richer meaning in our qualitative research, as well as building positive relationships with those who help guide our intelligence.",
        imagePosition: 'right'
      },
      {
        title: "Adopting an Agile Medium",
        content: "Gauge has partnered with Great Question in order to create a Research Operations platform that can recruit, survey and fulfill using exclusively SMS texts. We acknowledge that the generation below us has eschewed the medium of email as a communication platform, and are adapting our methods accordingly. To follow suit, all of Gauge's survey design and programming are done using platforms that are mobile compatible. Gauge is staying relevant and keeping our organization's\n\nGauge knows what a poor Participant Experience feels like. We often spend our free time on the other side of the screen, completing surveys on our off-time and racking up virtual currency to spend on games and applications. We place ourselves as participants through these third-party survey experiences to be able to better cast a critical eye on how the questions flow, whether or not the branching is logical, can the experience be simplified any. The more intuitive the nature of the questions, the structure of the survey and the responsiveness of the platform, the better the quality of the resulting data will be.",
        imagePosition: 'left'
      },
      {
        title: "Delineating Differences",
        content: "After the quantitative survey was authored in five languages with over seven thousand participants, Gauge applied custom segmentation models to the respondent base, defining the early adopters – the grinders and creators who were to seed an open digital world, separate from the whales – those who would be more likely to spend later on as the commoditization of digital artifacts grew from within an ecosystem. These comparisons helped us delineate cultural style and choice preferences from one segment to the other, allowing for Gauge to make recommendations on how to position intelligence and appeal to one group versus another.",
        image: behavior3Thumb,
        imagePosition: 'right'
      },
      {
        type: 'pullQuote',
        content: "...we place ourselves as participants through these third-party survey experiences to be able to better cast a critical eye..."
      },
      {
        title: "Detecting Fraud",
        content: "Gauge incorporates best practices in detecting fraud from within quantitative data. We know that the recent boon of respondent marketplaces has offered us such a benefit in convenience and cost, but can also lead to corrupt results. In addition to all of the catches within the survey design itself, Gauge places detection of fraud as a priority in the analysis phase. Through Gauge's proprietary modeling, we detect outliers within initial classification data, participants whose answers stand out from the pack. Alerting panels and providers to participants who are less-than-faithful to the practice helps the community as a whole.",
        imagePosition: 'left'
      }
    ]
  },
  {
    title: "Validating Research Hypotheses at Scale",
    slug: "validating-research-hypotheses-at-scale",
    description: "Combining qualitative insights with quantitative validation across large populations for meaningful findings.",
    intro: "One of the most joyous aspects of living and working in the San Francisco Bay Area is being surrounded by innovative companies that have innovation baked into their DNA. This goes from the top, all the way down to the trenches of these organizations. Airbnb was no exception.\n\nAirbnb was seeing stagnation on one of their product lines and their internal research team was tasked with uncovering what some of the focus areas for quantitate research should have been. Using public reviews, as well as their provided rating-scales, Gauge was able to help Airbnb uncover what made for a positive stay in this product line.",
    services: [
      "Specialty Recruitment",
      "Mixed Methods Studies",
      "Audience Segmentation"
    ],
    color: "mango",
    image: pic3MixedMethods,
    backgroundImage: validatingBg,
    tileImage: validatingTile,
    category: "Market Research",
    modalImages: [
      { src: validating1, thumbnail: validating1Thumb, caption: "Gauge cleaned, analysed and displayed patterns from over 40m public reviews of private home stays." },
      { src: validating2, thumbnail: validating2Thumb, caption: "We built a custom portal for Airbnb to be able to navigate regional trends and patterns." },
      { src: validating3, thumbnail: validating3Thumb, caption: "Scatterplots revealed sentiment outliers on different aspects of private home stays." },
      { src: validating4, thumbnail: validating4Thumb, caption: "Topic Modeling and Sentiment Analysis allowed for purview of word association when working in such a large scale." },
      { src: validating5, caption: "Gauge used provided keywords from AIrbnb's qualitative research and compared occurence against a public review database." },
      { src: validating6, caption: "Custom portals provided the different dimensions of comparison from demographics and characteristics of the guests." }
    ],
    stats: [
      { value: "40m", label: "Public reviews parsed" },
      { value: "12", label: "Keywords for investigation" },
      { value: "5", label: "Dimensions of analysis" }
    ],
    contentSections: [
      {
        title: "Segmentation and Sentiment",
        content: "With a select number of topics for investigation, Gauge was able to query not just the frequency and usage of specific words in positive vs. negative reviews. The differentiation of specific keywords that are found in positive vs. negative reviews give a sense of how relevant these investigation areas are in finding out what makes a positive stay at an Airbnb listing.\n\nThe normally imperceptible patterns of word usage are able to be visualized through different interactive displays. Gauge employs Enterprise and Open Source libraries that allow for researchers to see in what context their hypotheses which of these keyword topic areas generated from small-scale qualitative research are trending true on a larger level.\n\nGauge rendered kind of context and hierarchy to help gain a better understanding of how language and word usage is being repeated across millions of records. Segmentation, sentiment analysis and normalization of the data were key tasks in allowing Airbnb to be able to use and share these insights internally.",
        imagePosition: 'right'
      },
      {
        type: 'pullQuote',
        content: "...It is such a delight when odd moments of humanity reveal themselves in data..."
      },
      {
        title: "The Case for Puppies",
        content: "It is such a delight when odd moments of humanity reveal themselves in data. The prevalence of domesticated animals mentioned in positive reviews was such a surprise to see arise in the scatterplot data nodes. Kittens and puppies are such a testament to the personality of the host – they've already chosen to take a creature and provide them food and lodging, extending this intimacy to an Airbnb guest just seemed natural.\n\nBy being able to see this kind of anomaly in a large-scale dataset opens up a new, generative line of investigation for research. Reconnecting with hosts and inquiring about these kinds of touch points for a guest's stay. Actionable items of creating visibility and profile around what different features and descriptions go into a listing (e.g. – kitchens and pets) help surface what could go into creating a positive stay and positive connection.",
        imagePosition: 'left'
      },
      {
        title: "Generative Topic Modeling",
        content: "Whereas starting with an initial set of queries is a sound process for research synthesis – one that helps confirm or refute hypotheses derived through qualitative methods. Within the same dataset, a generative process to can also be applied through Natural Language Processing. Through topic modeling algorithms, visualizations can render hierarchy and weighting of what are the distinct trends in the found topics of conversation, as well as how they break down within the dataset as a part of a whole.\n\nAlong with sentiment analysis, categorizations of tone and emotion was overlaid on top of these same topic hierarchies. What words are used to describe joy, sadness, frustration and anger. These generative topics start research processes anew – providing guidance of how, at scale, researchers can use written language to better understand experience.",
        imagePosition: 'right'
      },
      {
        type: 'pullQuote',
        content: "...we eschew slidewear..."
      },
      {
        title: "Democratizing Research",
        content: "Gauge is continually investing in its own suite of software visualization and investigation displays. We eschew slidewear, instead opting to create a living document that you're able to share with your own stakeholders and collaborators within your organization. Make this research a continual part of the conversation, rather than a leave-behind.\n\nWe want to share in your success. Leveling-up the maturity within your organization means investment in internal tools, including those that share research. Gauge also employs a transparent process in the assembly, operations and execution of research artifacts. This gives you full visibility on our projects together, understanding how we arrive at our recommendations and helping you level-up your career.",
        imagePosition: 'left'
      }
    ]
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}

