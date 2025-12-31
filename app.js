// ===================================
// AI-Powered Resume Analyzer JavaScript
// ===================================

// Global Variables
let selectedFile = null;
let analysisResults = null;

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_JOB_DESC_LENGTH = 50;
const ALLOWED_EXTENSIONS = ['pdf', 'docx'];

// Common Skills Database
const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
  'HTML', 'CSS', 'SQL', 'Git', 'Docker', 'AWS', 'Azure', 'Kubernetes',
  'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'Agile', 'Scrum',
  'CI/CD', 'Jenkins', 'Testing', 'Jest', 'Cypress', 'Vue.js', 'Angular',
  'Express', 'Django', 'Spring Boot', 'Machine Learning', 'Data Analysis',
  'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'
];

// Skill Synonyms
const skillSynonyms = {
  'JavaScript': ['JS', 'ECMAScript', 'ES6'],
  'TypeScript': ['TS'],
  'React': ['React.js', 'ReactJS'],
  'Node.js': ['Node', 'NodeJS'],
  'Python': ['Py'],
  'Frontend': ['Front-end', 'Front End', 'UI Developer'],
  'Backend': ['Back-end', 'Back End', 'Server-side'],
  'Full Stack': ['Full-stack', 'Fullstack'],
  'Database': ['DB', 'Data Storage'],
  'DevOps': ['Dev Ops', 'Development Operations']
};

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileDisplay = document.getElementById('fileDisplay');
const removeFileBtn = document.getElementById('removeFile');
const fileError = document.getElementById('fileError');
const fileErrorMessage = document.getElementById('fileErrorMessage');
const jobDescription = document.getElementById('jobDescription');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const validationAlert = document.getElementById('validationAlert');
const validationList = document.getElementById('validationList');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');

// ===================================
// File Upload Handling
// ===================================

// Drag and Drop Events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// File Input Change
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// Remove File Button
removeFileBtn.addEventListener('click', () => {
  clearFile();
});

// Handle File Selection
function handleFile(file) {
  const validation = validateFile(file);
  
  if (!validation.valid) {
    showFileError(validation.error);
    clearFile();
    return;
  }
  
  hideFileError();
  selectedFile = file;
  displayFile(file);
  updateValidation();
  showResetButton();
}

// Validate File
function validateFile(file) {
  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PDF or DOCX file.'
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit. Please upload a smaller file.'
    };
  }
  
  return { valid: true };
}

// Display File
function displayFile(file) {
  const fileName = file.name;
  const fileSize = formatFileSize(file.size);
  
  document.querySelector('.file-name').textContent = fileName;
  document.querySelector('.file-size').textContent = fileSize;
  
  document.querySelector('.drop-zone-content').classList.add('d-none');
  fileDisplay.classList.remove('d-none');
}

// Clear File
function clearFile() {
  selectedFile = null;
  fileInput.value = '';
  document.querySelector('.drop-zone-content').classList.remove('d-none');
  fileDisplay.classList.add('d-none');
  hideFileError();
  updateValidation();
}

// Show File Error
function showFileError(message) {
  fileErrorMessage.textContent = message;
  fileError.classList.remove('d-none');
  dropZone.classList.add('error');
}

// Hide File Error
function hideFileError() {
  fileError.classList.add('d-none');
  dropZone.classList.remove('error');
}

// Format File Size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ===================================
// Job Description Handling
// ===================================

jobDescription.addEventListener('input', (e) => {
  const length = e.target.value.length;
  charCount.textContent = length;
  updateValidation();
  
  if (e.target.value.length > 0) {
    showResetButton();
  }
});

// ===================================
// Validation
// ===================================

function updateValidation() {
  const issues = [];
  
  if (!selectedFile) {
    issues.push('Please upload your resume');
  }
  
  const jobDescLength = jobDescription.value.length;
  if (jobDescLength < MIN_JOB_DESC_LENGTH) {
    const remaining = MIN_JOB_DESC_LENGTH - jobDescLength;
    issues.push(`Job description needs at least ${remaining} more characters`);
  }
  
  if (issues.length > 0 && (selectedFile || jobDescLength > 0)) {
    showValidationAlert(issues);
    analyzeBtn.disabled = true;
  } else {
    hideValidationAlert();
    analyzeBtn.disabled = issues.length > 0;
  }
}

function showValidationAlert(issues) {
  validationList.innerHTML = issues.map(issue => 
    `<li><span class="badge bg-warning text-dark me-2">!</span>${issue}</li>`
  ).join('');
  validationAlert.classList.remove('d-none');
}

function hideValidationAlert() {
  validationAlert.classList.add('d-none');
}

// ===================================
// Analysis Logic
// ===================================

analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile || jobDescription.value.length < MIN_JOB_DESC_LENGTH) {
    return;
  }
  
  // Show loading state
  emptyState.classList.add('d-none');
  resultsSection.classList.add('d-none');
  loadingState.classList.remove('d-none');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Perform analysis
  analysisResults = performAnalysis(selectedFile.name, jobDescription.value);
  
  // Display results
  displayResults(analysisResults);
  
  // Hide loading, show results
  loadingState.classList.add('d-none');
  resultsSection.classList.remove('d-none');
  resultsSection.classList.add('animate-fade-in');
  
  // Scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});

// Perform Analysis
function performAnalysis(fileName, jobDesc) {
  // Extract skills from job description
  const jobSkills = extractSkills(jobDesc);
  
  // Simulate resume content
  const resumeContent = `
    Software Engineer with experience in ${commonSkills.slice(0, 8).join(', ')}.
    Proficient in web development, database management, and cloud technologies.
    Strong problem-solving and communication skills.
  `;
  
  const resumeSkills = extractSkills(resumeContent);
  const synonymMatches = findSynonymMatches(resumeContent, jobDesc);
  
  // Find matched and missing skills
  const matched = jobSkills.filter(skill => 
    resumeSkills.some(rSkill => rSkill.toLowerCase() === skill.toLowerCase())
  );
  
  const missing = jobSkills.filter(skill => 
    !resumeSkills.some(rSkill => rSkill.toLowerCase() === skill.toLowerCase())
  );
  
  // Calculate score
  const atsScore = calculateScore(matched.length, jobSkills.length);
  const scoreCategory = getScoreCategory(atsScore);
  
  // Generate evaluations
  const experienceEvaluation = generateExperienceEvaluation(atsScore);
  const educationEvaluation = generateEducationEvaluation(atsScore + 5);
  
  // Generate issues and recommendations
  const formattingIssues = generateFormattingIssues(atsScore);
  const improvementRecommendations = generateRecommendations(missing, atsScore, formattingIssues.length > 0);
  
  return {
    atsScore,
    scoreCategory,
    skillMatch: {
      matched,
      missing,
      synonymMatches
    },
    experienceEvaluation,
    educationEvaluation,
    formattingIssues,
    improvementRecommendations
  };
}

// Extract Skills
function extractSkills(text) {
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return foundSkills;
}

// Find Synonym Matches
function findSynonymMatches(resumeText, jobDescText) {
  const matches = [];
  const lowerResume = resumeText.toLowerCase();
  const lowerJob = jobDescText.toLowerCase();
  
  for (const [mainSkill, synonyms] of Object.entries(skillSynonyms)) {
    for (const synonym of synonyms) {
      if (lowerResume.includes(synonym.toLowerCase()) && 
          lowerJob.includes(mainSkill.toLowerCase())) {
        matches.push(`${synonym} matched with ${mainSkill}`);
        break;
      }
      if (lowerResume.includes(mainSkill.toLowerCase()) && 
          lowerJob.includes(synonym.toLowerCase())) {
        matches.push(`${mainSkill} matched with ${synonym}`);
        break;
      }
    }
  }
  
  return matches;
}

// Calculate Score
function calculateScore(matched, required) {
  if (required === 0) return 75;
  const baseScore = (matched / required) * 100;
  const variance = Math.random() * 10 - 5;
  return Math.min(100, Math.max(0, Math.round(baseScore + variance)));
}

// Get Score Category
function getScoreCategory(score) {
  if (score >= 90) return 'Strong match';
  if (score >= 75) return 'Good match';
  if (score >= 60) return 'Moderate match';
  return 'Low match';
}

// Generate Experience Evaluation
function generateExperienceEvaluation(score) {
  if (score >= 90) return 'Highly Relevant';
  if (score >= 75) return 'Relevant';
  if (score >= 60) return 'Partially Relevant';
  return 'Not Relevant';
}

// Generate Education Evaluation
function generateEducationEvaluation(score) {
  if (score >= 90) return 'Exceeds Requirements';
  if (score >= 75) return 'Meets Requirements';
  if (score >= 60) return 'Partially Meets';
  return 'Does Not Meet';
}

// Generate Formatting Issues
function generateFormattingIssues(score) {
  if (score >= 85) return [];
  
  const possibleIssues = [
    'Inconsistent date formatting detected',
    'Multiple font styles used - recommend using 1-2 fonts maximum',
    'Bullet points not aligned consistently',
    'Section headers lack visual hierarchy',
    'Contact information could be more prominent',
    'Excessive use of bold text reduces impact',
    'Line spacing inconsistent between sections'
  ];
  
  const numIssues = score >= 70 ? 1 : score >= 60 ? 2 : 3;
  return possibleIssues.slice(0, numIssues);
}

// Generate Recommendations
function generateRecommendations(missingSkills, score, hasFormattingIssues) {
  const recommendations = [];
  
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3).join(', ');
    recommendations.push(`Add relevant experience with: ${topMissing}`);
  }
  
  if (score < 80) {
    recommendations.push('Quantify achievements with specific metrics and numbers');
    recommendations.push('Tailor professional summary to match job requirements more closely');
  }
  
  if (hasFormattingIssues) {
    recommendations.push('Improve document formatting for better ATS compatibility');
  }
  
  if (score < 70) {
    recommendations.push('Include more keywords from the job description naturally');
    recommendations.push('Add relevant certifications or training if available');
  }
  
  recommendations.push('Use action verbs to start bullet points (e.g., Led, Developed, Implemented)');
  
  return recommendations;
}

// ===================================
// Display Results
// ===================================

function displayResults(results) {
  // Display Score
  displayScore(results.atsScore, results.scoreCategory);
  
  // Display Matched Skills
  displayMatchedSkills(results.skillMatch.matched);
  
  // Display Missing Skills
  displayMissingSkills(results.skillMatch.missing);
  
  // Display Synonym Matches
  displaySynonymMatches(results.skillMatch.synonymMatches);
  
  // Display Evaluations
  displayEvaluations(results.experienceEvaluation, results.educationEvaluation);
  
  // Display Formatting Issues
  displayFormattingIssues(results.formattingIssues);
  
  // Display Recommendations
  displayRecommendations(results.improvementRecommendations);
}

// Display Score
function displayScore(score, category) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreCategory = document.getElementById('scoreCategory');
  const progressCircle = document.getElementById('progressCircle');
  
  // Set score value
  scoreValue.textContent = score;
  scoreCategory.textContent = category;
  
  // Set color based on score
  let colorClass, strokeColor;
  if (score >= 90) {
    colorClass = 'score-strong';
    strokeColor = '#10B981';
  } else if (score >= 75) {
    colorClass = 'score-good';
    strokeColor = '#2563EB';
  } else if (score >= 60) {
    colorClass = 'score-moderate';
    strokeColor = '#F59E0B';
  } else {
    colorClass = 'score-low';
    strokeColor = '#EF4444';
  }
  
  scoreValue.className = 'score-value ' + colorClass;
  scoreCategory.className = 'score-category mt-3 mb-0 ' + colorClass;
  
  // Animate circular progress
  const radius = 70;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;
  progressCircle.style.stroke = strokeColor;
  
  setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
  }, 100);
}

// Display Matched Skills
function displayMatchedSkills(skills) {
  const container = document.getElementById('matchedSkills');
  
  if (skills.length === 0) {
    container.innerHTML = '<p class="text-muted small mb-0">No matching skills found</p>';
    return;
  }
  
  container.innerHTML = skills.map(skill => 
    `<span class="skill-badge skill-matched">
      <i class="bi bi-check-circle"></i>${skill}
    </span>`
  ).join('');
}

// Display Missing Skills
function displayMissingSkills(skills) {
  const card = document.getElementById('missingSkillsCard');
  const container = document.getElementById('missingSkills');
  
  if (skills.length === 0) {
    card.classList.add('d-none');
    return;
  }
  
  card.classList.remove('d-none');
  container.innerHTML = skills.map(skill => 
    `<span class="skill-badge skill-missing">
      <i class="bi bi-x-circle"></i>${skill}
    </span>`
  ).join('');
}

// Display Synonym Matches
function displaySynonymMatches(matches) {
  const card = document.getElementById('synonymCard');
  const container = document.getElementById('synonymMatches');
  
  if (matches.length === 0) {
    card.classList.add('d-none');
    return;
  }
  
  card.classList.remove('d-none');
  container.innerHTML = matches.map(match => 
    `<li>
      <i class="bi bi-check-circle text-primary"></i>
      <span>${match}</span>
    </li>`
  ).join('');
}

// Display Evaluations
function displayEvaluations(experience, education) {
  const experienceElem = document.getElementById('experienceEval');
  const educationElem = document.getElementById('educationEval');
  
  experienceElem.textContent = experience;
  experienceElem.className = 'badge-eval ' + getEvaluationClass(experience);
  
  educationElem.textContent = education;
  educationElem.className = 'badge-eval ' + getEvaluationClass(education);
}

function getEvaluationClass(evaluation) {
  if (evaluation.includes('Highly') || evaluation.includes('Exceeds')) {
    return 'eval-exceeds';
  }
  if (evaluation.includes('Relevant') || evaluation.includes('Meets')) {
    return 'eval-meets';
  }
  if (evaluation.includes('Partially')) {
    return 'eval-partial';
  }
  return 'eval-not-meet';
}

// Display Formatting Issues
function displayFormattingIssues(issues) {
  const card = document.getElementById('formattingCard');
  const container = document.getElementById('formattingIssues');
  
  if (issues.length === 0) {
    card.classList.add('d-none');
    return;
  }
  
  card.classList.remove('d-none');
  container.innerHTML = issues.map(issue => 
    `<li>
      <i class="bi bi-exclamation-triangle text-warning"></i>
      <span>${issue}</span>
    </li>`
  ).join('');
}

// Display Recommendations
function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendations');
  
  container.innerHTML = recommendations.map(rec => 
    `<li>${rec}</li>`
  ).join('');
}

// ===================================
// Reset Functionality
// ===================================

resetBtn.addEventListener('click', () => {
  // Clear file
  clearFile();
  
  // Clear job description
  jobDescription.value = '';
  charCount.textContent = '0';
  
  // Clear results
  analysisResults = null;
  
  // Hide results and show empty state
  resultsSection.classList.add('d-none');
  loadingState.classList.add('d-none');
  emptyState.classList.remove('d-none');
  
  // Hide reset button
  resetBtn.classList.add('d-none');
  
  // Update validation
  updateValidation();
});

function showResetButton() {
  resetBtn.classList.remove('d-none');
}

// ===================================
// Initialize
// ===================================

// Set initial state
updateValidation();
