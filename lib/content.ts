// All portfolio content lives here. Edit this file to update the site.

export const PROFILE = {
  name: "Elisha Bariki Mlay",
  short: "Elisha Mlay",
  handle: "elisha",
  host: "dar",
  role: "Data Analyst and Revenue Assurance Specialist",
  org: "CRDB Bank",
  base: "Dar es Salaam, Tanzania",
  edu: "BSc Business Information Technology, University of Dar es Salaam",
  stack: "Oracle SQL/PL-SQL · Power BI · Excel · Python",
  langs: "Kiswahili (native), English (fluent)",
  side: "Brain Growth System (social media agency), web apps, games",
  tagline: "Data analyst · Revenue assurance · Builds things on the side",
};

export const CONTACT = {
  email: "elishamlay2@gmail.com",
  links: [
    {
      label: "linkedin",
      text: "linkedin.com/in/elisha-mlay-63921b243",
      url: "https://www.linkedin.com/in/elisha-mlay-63921b243/",
    },
    {
      label: "instagram",
      text: "@elymlay_",
      url: "https://instagram.com/elymlay_",
    },
  ],
};

export type Project = {
  id: string;
  title: string;
  status: string;
  stack: string;
  blurb: string;
  points: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "ra-pipeline",
    title: "Revenue Assurance Pipeline",
    status: "built",
    stack: "Python · pandas · NumPy · Oracle SQL · Power BI",
    blurb:
      "End-to-end charge verification on the PaySim transaction dataset, framed the way a bank revenue assurance team would run it.",
    points: [
      "Chunked ETL so the full dataset loads without exhausting memory",
      "Tariff-matrix classification of every transaction",
      "Fee reconciliation against the expected tariff",
      "Z-score anomaly detection on charges, with IQR as a cross-check",
      "Power BI deliverables for an executive audience",
    ],
  },
  {
    id: "sports-predictor",
    title: "Sports Predictor",
    status: "in progress",
    stack: "FastAPI · SQLAlchemy · clean architecture",
    blurb:
      "AI prediction platform for football and NBA outcomes that flags betting edges.",
    points: [
      "Edge detection: compares model probabilities against market odds",
      "Built in phases from a structured plan",
      "Layered backend so models, data and API stay separable",
    ],
  },
  {
    id: "bgs-dashboard",
    title: "Brain Growth System Dashboard",
    status: "proof of concept",
    stack: "Next.js · role-based portals",
    blurb:
      "Agency management dashboard for my social media agency, Brain Growth System.",
    points: [
      "Two portals with role-based access",
      "Full CRUD with client-side state",
      "Mock data set in Tanzania so the demo feels local",
    ],
  },
  {
    id: "zanz-moments",
    title: "Zanz Moments",
    status: "MVP spec",
    stack: "React · TypeScript · Vite · Tailwind · shadcn/ui",
    blurb: "Tourism and experiences web app for Zanzibar.",
    points: [
      "Home, experiences, destinations, about and contact pages",
      "Booking handed off to WhatsApp",
      "Basic /admin CRUD on mock data, Supabase planned for later",
    ],
  },
  {
    id: "draughts",
    title: "Draughts",
    status: "side project",
    stack: "Browser game · JavaScript",
    blurb: "Draughts in the browser, built feature by feature.",
    points: ["Currently mid-way through a UI and analysis overhaul"],
  },
];

export const SKILL_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Data",
    items: [
      "SQL scripting and data mining",
      "Oracle SQL and PL/SQL",
      "Data quality and master data maintenance",
    ],
  },
  {
    label: "BI and reporting",
    items: [
      "Power BI and dashboard design",
      "Daily, weekly and monthly performance reporting",
      "Excel advanced analytics and Power Query",
      "Stakeholder reporting and presentation",
    ],
  },
  {
    label: "Analysis",
    items: [
      "Business and revenue performance analysis",
      "Root cause and trend analysis",
      "Z-score anomaly detection",
      "Python (pandas, NumPy, scikit-learn)",
    ],
  },
  {
    label: "Ways of working",
    items: [
      "Process improvement and workflow automation",
      "Cross-functional collaboration",
    ],
  },
  {
    label: "Web (side projects)",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "FastAPI"],
  },
];

export type Job = {
  title: string;
  where: string;
  dates: string;
  points: string[];
};

export const EXPERIENCE: Job[] = [
  {
    title: "Data Analyst and Revenue Assurance Specialist",
    where: "CRDB Bank · Dar es Salaam",
    dates: "Mar 2025 – present",
    points: [
      "Analyze transaction and revenue performance data to find trends, gaps and revenue opportunities, and turn them into recommendations for management",
      "Use SQL/PL-SQL to extract, mine and analyze large transactional datasets under established business logic and query standards",
      "Develop and maintain Power BI dashboards and daily, weekly and monthly reporting, validating accuracy before it reaches stakeholders",
      "Designed a Z-score anomaly detection model in PL/SQL that monitors transaction data and flags irregular patterns for investigation",
      "Run root cause analysis on reporting discrepancies and data quality issues",
      "Work with Business, Finance, IT and Operations teams on process improvement and workflow automation",
    ],
  },
  {
    title: "Data Analyst and IT Support",
    where: "HUB Network Limited · Dar es Salaam",
    dates: "Jan 2024 – Oct 2024 · internship",
    points: [
      "Built dashboards and performance analytics for management teams",
      "Automated Power BI and Excel reporting, cutting report generation time by 30%",
      "Tuned SQL/PL-SQL queries for faster analytics and retrieval",
      "Prepared management reports with advanced analytical techniques",
    ],
  },
  {
    title: "IT Support and Data Analyst",
    where: "TTCL · Tanzania",
    dates: "2022 · internship",
    points: [
      "Analyzed operational data to improve workflow efficiency and cut costs",
      "Reduced errors in reporting systems by 15% through validation and quality checks",
      "Prepared performance reports and supported database troubleshooting",
    ],
  },
  {
    title: "System and Data Analyst",
    where: "Y4C HUB · University of Dar es Salaam",
    dates: "2020 – 2023",
    points: [
      "Ran statistical analysis for healthcare and supply chain projects",
      "Designed KPI tracking and performance dashboards for stakeholders",
      "Presented findings to research teams, management and external stakeholders",
      "Supported research teams with data cleaning, visualization and interpretation",
    ],
  },
  {
    title: "Founder",
    where: "Brain Growth System · social media agency",
    dates: "ongoing",
    points: [
      "Runs client social media growth work",
      "Building its internal management dashboard in Next.js",
    ],
  },
];

export const EDUCATION = [
  {
    title: "Bachelor of Science in Business Information Technology",
    where: "University of Dar es Salaam (UDSM)",
    dates: "2020 – 2023",
  },
  {
    title: "Advanced Certificate of Secondary Education",
    where: "Mwenge High School",
    dates: "2018 – 2020",
  },
];
