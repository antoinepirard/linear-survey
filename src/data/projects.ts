export interface Project {
  year: string;
  projectName: string;
  category?: string;
  description?: string;
  previewImage?: string;
  previewVideo?: string;
  hoverPreviewImage?: string;
}

export const projects: Project[] = [
  {
    year: "2024",
    projectName: "Transpoco",
    category: "Fleet Management",
    previewImage: "/Assets/Images/thumbn-transpoco.jpg",
    previewVideo: "/Assets/Videos/transpoco.webm",
    description:
      "Fleet management and logistics platform for transportation companies.",
  },
  {
    year: "2025",
    projectName: "Rasayel",
    category: "Customer Support Platform",
    previewImage: "/Assets/Images/thumbn-rasayel.jpg",
    previewVideo: "/Assets/Videos/reporting-highquality.webm",
    description:
      "Customer support platform integrating WhatsApp, email, and other channels.",
  },
  {
    year: "2025",
    projectName: "Ravell",
    category: "Product Design",
    previewImage: "/Assets/Images/thumbn-ravell.jpg",
    hoverPreviewImage: "/Assets/Images/ravell (1).jpg",
    description:
      "Building Ravell, the non-linear planner for creative teams and individuals.",
  },
  {
    year: "2024",
    projectName: "GoVocal",
    category: "Civic Engagement",
    previewImage: "/Assets/Images/thumbn-govocal.jpg",
    hoverPreviewImage: "/Assets/Images/govocal-preview.jpg",
    description:
      "Citizen participation platform for democratic engagement and community feedback.",
  },
  {
    year: "2025",
    projectName: "Schedule Campaigns",
    category: "Marketing",
    previewImage: "/case-studies/rasayel-big-picture/schedule campaigns.png",
  },
  {
    year: "2025",
    projectName: "HubSpot Properties On Mobile App",
    category: "Integration",
  },
  {
    year: "2025",
    projectName: "Import CSV as campaign audience",
    category: "Marketing",
    previewImage: "/case-studies/rasayel-big-picture/campaign-csv-import.png",
  },
  {
    year: "2025",
    projectName: "Property syncing (Pipedrive)",
    category: "Integration",
    previewImage: "/case-studies/rasayel-big-picture/propertysync.jpg",
  },
  {
    year: "2025",
    projectName: "WhatsApp Carousels",
    category: "WhatsApp Natives",
    previewImage: "/case-studies/rasayel-big-picture/carousels.jpg",
  },
  {
    year: "2025",
    projectName: "HubSpot Bot nodes",
    category: "Chatbot",
  },
  {
    year: "2025",
    projectName: "Mobile app v2",
    category: "Mobile",
  },
  {
    year: "2025",
    projectName: "WhatsApp Flows",
    category: "WhatsApp Natives",
    previewImage: "/case-studies/rasayel-big-picture/whatsapp-flows.png",
  },
  {
    year: "2025",
    projectName: "Monitoring dashboard",
    category: "Analytics",
  },
  {
    year: "2025",
    projectName: "Detect email domain when joining workspace",
    category: "Onboarding & Activation",
    previewImage:
      "/case-studies/rasayel-big-picture/detect-email-domain-when-joining.png",
  },
  {
    year: "2024",
    projectName: "Unassigned inbox: Switch between user or team unassigned",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Team Assignment when starting outbound campaigns",
    category: "Outbound",
    previewImage:
      "/case-studies/rasayel-big-picture/tea-assignment-campaigns.png",
  },
  {
    year: "2024",
    projectName: "Billing & paywalls",
    category: "Onboarding & Activation",
    previewImage: "/case-studies/rasayel-big-picture/billing & paywalls.png",
  },
  {
    year: "2024",
    projectName: "Improve HS activity logging formatting",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Companies: Auto fill domain based on name",
    category: "Rasayel Objects",
  },
  {
    year: "2024",
    projectName: "Emojis on WA inbound",
    category: "WhatsApp Natives",
  },
  {
    year: "2024",
    projectName: "Rebuilding Exports",
    category: "Import & Export",
  },
  {
    year: "2024",
    projectName: "Quick Templates",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: 'Unread count for "assigned to me"',
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Filter template composer by all/mine",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Company v1",
    category: "Rasayel Objects",
  },
  {
    year: "2024",
    projectName: "WA Interactive CTA URL button",
    category: "Inbox",
    previewImage:
      "/case-studies/rasayel-big-picture/wa-interactive-cta-button.png",
  },
  {
    year: "2024",
    projectName: "Calendly Integration Buttons",
    category: "Integration",
    previewImage: "/case-studies/rasayel-big-picture/calendly-integration.png",
  },
  {
    year: "2024",
    projectName: "More & Mixed Buttons",
    category: "WhatsApp Natives",
  },
  {
    year: "2024",
    projectName: "Primary teams & assignment",
    category: "Assignment",
  },
  {
    year: "2024",
    projectName: "Onboarding Redesign",
    category: "Onboarding & Activation",
  },
  {
    year: "2024",
    projectName: "Property syncing",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Signature to messages",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Unanswered Inbox Filter",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: 'Fix "Waiting longest" sorting',
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Emojis reactions on notes",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "FE Property editing",
    category: "Contact Management",
  },
  {
    year: "2024",
    projectName: "Sequences",
    category: "Automations",
  },
  {
    year: "2024",
    projectName: "Follow ups (formerly Snooze)",
    category: "UI/UX",
  },
  {
    year: "2024",
    projectName: "Activities v0.1 - Reminders & Mentions",
    category: "Notifications",
  },
  {
    year: "2024",
    projectName: "App Redesign v2.1",
    category: "UI/UX",
  },
  {
    year: "2024",
    projectName: "Salesforce v0.1",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "[Workflow Bots] AI smart capture node",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Filtering Rebuild",
    category: "UI/UX",
  },
  {
    year: "2024",
    projectName: "HubSpot: Ownership & Assignment",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Contacts Table Redesign",
    category: "Contact Management",
  },
  {
    year: "2024",
    projectName: "Flexible Chatbot Flow Builder",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Versioning Bots",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Odoo Integration",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Zoho CRM",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "In Chat Errors",
    category: "UI/UX",
  },
  {
    year: "2024",
    projectName: "Stage change trigger sending message",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Chatbot Owner Assignment Node",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Chatbot Pipedrive Person/Lead/Deal identification node",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Template Carousels",
    category: "WhatsApp Natives",
  },
  {
    year: "2024",
    projectName: "In-Pipedrive messaging",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Sales Notifications",
    category: "Notifications",
  },
  {
    year: "2024",
    projectName: "Bot analytics",
    category: "Analytics",
  },
  {
    year: "2024",
    projectName: "Inbox Composer Rework",
    category: "Inbox",
  },
  {
    year: "2024",
    projectName: "Support AI in Chatbots",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Pipedrive v0.2",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Pipedrive v0.1",
    category: "Integration",
  },
  {
    year: "2024",
    projectName: "Chatbot Improvements",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Templates Creation Improvements",
    category: "UI/UX",
  },
  {
    year: "2023",
    projectName: "System variables",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Filtering & Sorting",
    category: "Inbox",
  },
  {
    year: "2023",
    projectName: "Dissociated/Grouped Nodes",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Chatbot Fallbacks",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "WhatsApp Flows v0.1",
    category: "WhatsApp Natives",
  },
  {
    year: "2023",
    projectName: "Properties in Template Variables",
    category: "Inbox",
  },
  {
    year: "2023",
    projectName: "Views Grouping/Reordering",
    category: "Inbox",
  },
  {
    year: "2023",
    projectName: "Conversational AI",
    category: "AI",
  },
  {
    year: "2023",
    projectName: "Pipedrive activity logging",
    category: "Integration",
  },
  {
    year: "2023",
    projectName: "Sending Proactive Messages UX",
    category: "Outbound",
  },
  {
    year: "2023",
    projectName: "Contact Importing (csv & hubspot)",
    category: "Contact Management",
  },
  {
    year: "2023",
    projectName: "Team Conversation Visibility",
    category: "Permissions",
  },
  {
    year: "2023",
    projectName: "Filtering conversations by properties",
    category: "Inbox",
  },
  {
    year: "2023",
    projectName: "Templates v2",
    category: "Inbox",
  },
  {
    year: "2023",
    projectName: "Hubspot v1",
    category: "Integration",
  },
  {
    year: "2023",
    projectName: "Assignment Methods (last busy, etc)",
    category: "Assignment",
  },
  {
    year: "2023",
    projectName: "Agents & Teams presence",
    category: "Team Management",
  },
  {
    year: "2023",
    projectName: "Proactive Triggers",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Fallback v1",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Knowledge for AI Assistant",
    category: "AI",
  },
  {
    year: "2023",
    projectName: "Customer Input Capture",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "HTTP Requests v2",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Free Canvas v1",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Branching v1",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "HTTP Actions v1",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Tags 2.0",
    category: "Organization",
  },
  {
    year: "2023",
    projectName: "Teams Permissions",
    category: "Permissions",
  },
  {
    year: "2023",
    projectName: "Partner Dashboard",
    category: "Analytics",
  },
  {
    year: "2023",
    projectName: "Design System v2",
    category: "UI/UX",
  },
  {
    year: "2023",
    projectName: "Intent Detection",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Template Messages",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Message Carousels",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Canvas Notes",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Note Mentions",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Sidebar Action Groups",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Node Navigation",
    category: "Chatbot",
  },
  {
    year: "2023",
    projectName: "Command Bar Improvements",
    category: "Chatbot",
  },
  {
    year: "2024",
    projectName: "Localisation",
    category: "Internationalization",
  },
  {
    year: "2022",
    projectName: "Channel Health",
    category: "System Health",
  },
  {
    year: "2022",
    projectName: "Onboarding v2",
    category: "Onboarding & Activation",
  },
  {
    year: "2022",
    projectName: "User Importing v0",
    category: "User Management",
  },
  {
    year: "2022",
    projectName: "HubSpot Workflow Actions",
    category: "Integration",
  },
  {
    year: "2022",
    projectName: "Resolving conversations v2",
    category: "Inbox",
  },
  {
    year: "2022",
    projectName: "Permissions v1",
    category: "Permissions",
  },
  {
    year: "2022",
    projectName: "Chatbot v0",
    category: "Chatbot",
  },
  {
    year: "2022",
    projectName: "Better Search",
    category: "Search",
  },
  {
    year: "2022",
    projectName: "Contact page filters",
    category: "Contact Management",
  },
  {
    year: "2022",
    projectName: "Statuses 2.0",
    category: "Status Management",
  },
  {
    year: "2022",
    projectName: "Improved collaboration (notes)",
    category: "Inbox",
  },
  {
    year: "2022",
    projectName: "Reporting",
    category: "Analytics",
  },
  {
    year: "2022",
    projectName: "Widget",
    category: "Onboarding & Activation",
  },
  {
    year: "2024",
    projectName: "WhatsApp Embedded Signup",
    category: "WhatsApp Natives",
  },
  {
    year: "2022",
    projectName: "Inbox Rules",
    category: "Inbox",
  },
  {
    year: "2022",
    projectName: "Resolving conversations",
    category: "Inbox",
  },
  {
    year: "2022",
    projectName: "Views",
    category: "UI/UX",
  },
  {
    year: "2022",
    projectName: "Campaigns",
    category: "Marketing",
  },
  {
    year: "2022",
    projectName: "Product Analytics",
    category: "Analytics",
  },
  {
    year: "2022",
    projectName: "WhatsApp Cloud API",
    category: "WhatsApp Natives",
  },
  {
    year: "2022",
    projectName: "Onboarding flow",
    category: "Onboarding & Activation",
  },
  {
    year: "2022",
    projectName: "Email (IMAP/SMTP)",
    category: "Messaging Channels",
  },
  {
    year: "2022",
    projectName: "Zapier integration",
    category: "Integration",
  },
  {
    year: "2022",
    projectName: "Platform Redesign",
    category: "UI/UX",
  },
];
