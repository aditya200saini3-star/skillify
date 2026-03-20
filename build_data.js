const fs = require('fs');
const dbCode = fs.readFileSync('c:\\Users\\adity\\Downloads\\database.js', 'utf8');

const dummyEnv = `
  const document = {
    getElementById: () => ({ addEventListener: () => {} }),
    addEventListener: () => {}
  };
  const window = { location: { search: '' }, addEventListener: () => {} };
  const URLSearchParams = class { get() { return null; } };
  const localStorage = { getItem: () => null, setItem: () => {} };
  const location = { reload: () => {} };
  function showLoading() {}
  function displayRegularRecommendations() {}
  function displayAIRecommendations() {}
  function updateStatistics() {}
  function hideLoading() {}
  function saveResults() {}
  function shareResults() {}
  const console = { log: () => {} };
`;

const fullCode = dummyEnv + dbCode + '\nmodule.exports = courseDatabase;';
fs.writeFileSync('temp_db.js', fullCode);

const courseDatabase = require('./temp_db.js');
const formattedCourses = [];


for (const level in courseDatabase) {
  for (const category in courseDatabase[level]) {
    for (const goal in courseDatabase[level][category]) {
      const courses = courseDatabase[level][category][goal];
      
      courses.forEach(course => {
        formattedCourses.push({
          title: course.title,
          description: course.description,
          duration: course.duration,
          level: level, 
          category: category, 
          goal: goal, 
          rating: course.rating,
          provider: course.provider,
          link: course.link
        });
      });
    }
  }
}

fs.writeFileSync('backend/coursesData.json', JSON.stringify(formattedCourses, null, 2));
console.log('Successfully wrote', formattedCourses.length, 'courses to backend/coursesData.json');
fs.unlinkSync('temp_db.js');
