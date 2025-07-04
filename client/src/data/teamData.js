// Team member data with proper image paths and fallback handling
export const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Lead AI Engineer",
    image: "/team/sarah.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Expert in machine learning and natural language processing with 8+ years of experience. Passionate about making AI accessible to everyone.",
    linkedin: "#",
    github: "#",
    email: "sarah@resumeanalyzer.com",
    testimonialRole: "Software Engineer",
    testimonialCompany: "Tech Corp"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    image: "/team/michael.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Passionate about creating user-centric solutions that solve real-world problems. Focused on delivering exceptional user experiences.",
    linkedin: "#",
    github: "#",
    email: "michael@resumeanalyzer.com",
    testimonialRole: "Marketing Manager",
    testimonialCompany: "Digital Solutions"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Designer",
    image: "/team/emily.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Dedicated to crafting beautiful, intuitive experiences that users love. Specializes in accessibility and user research.",
    linkedin: "#",
    github: "#",
    email: "emily@resumeanalyzer.com",
    testimonialRole: "UX Designer",
    testimonialCompany: "Creative Studio"
  }
];

// Helper function to get team member by ID
export const getTeamMember = (id) => {
  return teamMembers.find(member => member.id === id);
};

// Helper function to get all team members
export const getAllTeamMembers = () => {
  return teamMembers;
};

// Helper function to generate testimonials from team data
export const getTestimonials = () => {
  const testimonialContent = [
    "The AI analysis helped me identify key areas for improvement. I got my dream job within 2 weeks!",
    "Incredible insights! The analysis highlighted skills I didn't even realize were valuable.",
    "Professional, accurate, and incredibly helpful. This tool is a game-changer for job seekers."
  ];

  return teamMembers.map((member, index) => ({
    name: member.name,
    role: member.testimonialRole,
    company: member.testimonialCompany,
    content: testimonialContent[index] || "Amazing tool that helped me improve my resume significantly!",
    rating: 5,
    avatar: member.image
  }));
}; 