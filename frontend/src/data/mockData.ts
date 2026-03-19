export interface Project {
  id: string;
  title: string;
  type: string;
  techStack: string;
  description: string;
  deadline: string;
  budget?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  studentName?: string;
  studentEmail?: string;
  createdAt: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI Chatbot for College',
    type: 'AI & Machine Learning',
    techStack: 'Python, TensorFlow, Flask',
    description: 'Build an AI chatbot that answers college-related queries.',
    deadline: '2026-04-15',
    budget: '₹5,000',
    status: 'In Progress',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul@email.com',
    createdAt: '2026-03-01',
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    type: 'MERN Stack',
    techStack: 'React, Node.js, MongoDB',
    description: 'Full-stack e-commerce website with payment integration.',
    deadline: '2026-04-30',
    budget: '₹8,000',
    status: 'Pending',
    studentName: 'Priya Patel',
    studentEmail: 'priya@email.com',
    createdAt: '2026-03-10',
  },
  {
    id: '3',
    title: 'Student Management System',
    type: 'Database Projects',
    techStack: 'Java, MySQL, JDBC',
    description: 'CRUD application for managing student records.',
    deadline: '2026-03-25',
    status: 'Completed',
    studentName: 'Amit Kumar',
    studentEmail: 'amit@email.com',
    createdAt: '2026-02-20',
  },
  {
    id: '4',
    title: 'Portfolio Website',
    type: 'Web Development',
    techStack: 'Next.js, Tailwind CSS',
    description: 'Personal portfolio with blog and project showcase.',
    deadline: '2026-04-10',
    budget: '₹3,000',
    status: 'Pending',
    studentName: 'Sneha Gupta',
    studentEmail: 'sneha@email.com',
    createdAt: '2026-03-12',
  },
];

export const services = [
  { title: 'AI & Machine Learning', description: 'Deep learning, NLP, computer vision, and predictive analytics projects.', icon: 'Brain' },
  { title: 'Agentic AI', description: 'Autonomous AI agents, LangChain, CrewAI, and multi-agent systems.', icon: 'Bot' },
  { title: 'Python Projects', description: 'Data science, automation, Django, Flask, and scripting projects.', icon: 'Code2' },
  { title: 'Java Projects', description: 'Spring Boot, Android, desktop apps, and enterprise solutions.', icon: 'Coffee' },
  { title: 'MERN Stack', description: 'Full-stack web apps with MongoDB, Express, React, and Node.js.', icon: 'Layers' },
  { title: 'Web Development', description: 'Responsive websites, SPAs, PWAs with modern frameworks.', icon: 'Globe' },
  { title: 'Database Projects', description: 'SQL, NoSQL, data modeling, and database management systems.', icon: 'Database' },
  { title: 'Next.js & Django', description: 'Server-rendered apps, REST APIs, and full-stack solutions.', icon: 'Rocket' },
];

export const features = [
  { title: 'Quality Work', description: 'Every project is built with industry-standard code and best practices.', icon: 'Award' },
  { title: 'Rapid Execution', description: 'Fast turnaround times without compromising on quality.', icon: 'Zap' },
  { title: 'Project Guidance', description: 'We guide you through every step from concept to completion.', icon: 'Compass' },
  { title: 'Reliable Support', description: '24/7 support and revisions until you\'re fully satisfied.', icon: 'Shield' },
];

export const testimonials = [
  { name: 'Keshav', college: 'Chitkara University', text: 'ProjectBuddy delivered my ML project ahead of schedule. The code quality was outstanding!', rating: 5 },
  { name: 'Raghav', college: 'NIT KUK', text: 'Amazing service! They helped me with my MERN stack project and explained everything clearly.', rating: 5 },
  { name: 'Dhruv', college: 'Amity University', text: 'Reliable and professional. My Django project was exactly what I needed for my submission.', rating: 4 },
];

export const steps = [
  { step: 1, title: 'Submit Request', description: 'Fill out the project form with your requirements and deadline.' },
  { step: 2, title: 'We Analyze', description: 'Our team reviews your request and creates a development plan.' },
  { step: 3, title: 'We Deliver', description: 'Receive your completed project with documentation and support.' },
];
