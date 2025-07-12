const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const skills = [
  // Programming & Development
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD', 'DevOps', 'Linux', 'Bash',
  
  // Design & Creative
  'UI/UX Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch',
  'Video Editing', 'Animation', '3D Modeling', 'Blender', 'After Effects', 'Premiere Pro',
  'Photography', 'Digital Marketing', 'Content Creation', 'Social Media Management',
  
  // Business & Management
  'Project Management', 'Agile', 'Scrum', 'Product Management', 'Business Analysis',
  'Digital Marketing', 'SEO', 'SEM', 'Email Marketing', 'Content Marketing',
  'Sales', 'Customer Service', 'Leadership', 'Team Management', 'Strategic Planning',
  
  // Data & Analytics
  'Data Analysis', 'Machine Learning', 'Deep Learning', 'Data Science', 'Statistics',
  'Excel', 'Power BI', 'Tableau', 'R', 'MATLAB', 'SQL', 'Big Data', 'Analytics',
  
  // Languages
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese',
  'Korean', 'Arabic', 'Hindi', 'Russian', 'Dutch', 'Swedish', 'Translation',
  
  // Other Skills
  'Public Speaking', 'Writing', 'Copywriting', 'Technical Writing', 'Blogging',
  'Music Production', 'Guitar', 'Piano', 'Singing', 'Teaching', 'Tutoring',
  'Fitness Training', 'Yoga', 'Meditation', 'Cooking', 'Baking', 'Gardening',
  'Accounting', 'Finance', 'Investment', 'Legal Research', 'Law', 'Medicine',
  'Nursing', 'Psychology', 'Counseling', 'Architecture', 'Engineering'
];

async function main() {
  console.log('Seeding database with skills...');
  
  // Create skills if they don't exist
  for (const skillName of skills) {
    const existingSkill = await prisma.skill.findFirst({
      where: { name: skillName }
    });
    
    if (!existingSkill) {
      await prisma.skill.create({
        data: { 
          name: skillName,
          description: `Learn or teach ${skillName}`,
          category: 'TECHNOLOGY' // default category
        }
      });
    }
  }
  
  console.log(`Created ${skills.length} skills`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
