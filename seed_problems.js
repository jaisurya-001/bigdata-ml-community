import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const problems = [
  {
    "id": "PS01",
    "title": "Smart Student Performance & Placement Prediction System",
    "domain": "Smart Education & Student Analytics",
    "description": "Develop a Big Data Analytics and Machine Learning solution to analyze student academic, attendance,\ntechnical skills, aptitude, certifications, and training data.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify meaningful patterns and relationships between academic and skill parameters.\n● Machine Learning: Build and evaluate a placement-readiness prediction model.\n● Dashboard: Display performance, skill gaps, predictions, and insights.\n● Recommendations: Generate suitable improvement suggestions based on analysis.\n🔎",
    "requirements": [
      "Identify key factors affecting placement readiness.",
      "Predict placement readiness levels.",
      "Identify individual skill gaps.",
      "Generate data-driven recommendations.",
      "Present insights through a dashboard/visualizations."
    ],
    "pipeline": "Raw Data → Preprocessing → Analytics → ML Prediction → Skill Gap → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Key insights & patterns"
      },
      {
        "component": "ML Model",
        "output": "Placement-readiness prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Visual insights & predictions"
      },
      {
        "component": "Recommendation",
        "output": "Data-driven skill-gap suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 3 ==="
      }
    ]
  },
  {
    "id": "PS02",
    "title": "Student Dropout Risk Prediction & Early Intervention System",
    "domain": "Smart Education & Student Analytics",
    "description": "Educational institutions maintain large volumes of data on attendance, internal marks, fee payments,\nbacklogs, and counselling records. Develop a Big Data Analytics and Machine Learning solution to\nidentify students at risk of discontinuing their studies.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify academic and behavioural patterns associated with dropout.\n● Machine Learning: Build and evaluate a dropout-risk classification model.\n● Dashboard: Display risk levels, affected students, and contributing factors.\n● Recommendations: Generate early intervention and counselling suggestions.\n🔎",
    "requirements": [
      "Analyze attendance, academic and behavioural trends.",
      "Identify key factors contributing to dropout risk.",
      "Predict dropout risk levels for each student.",
      "Highlight students requiring immediate counselling.",
      "Present risk insights through a dashboard/visualizations."
    ],
    "pipeline": "Raw Data → Preprocessing → Risk Analytics → ML Prediction → Alert → Intervention 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Dropout pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Dropout risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Risk monitoring dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Intervention suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 4 ==="
      }
    ]
  },
  {
    "id": "PS03",
    "title": "Student Attendance Analytics & Absenteeism Prediction System",
    "domain": "Smart Education & Student Analytics",
    "description": "Attendance records collected across semesters, subjects, and sessions form a valuable data source. Develop\na Big Data Analytics and Machine Learning solution to analyze attendance behaviour and predict\nabsenteeism.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify absenteeism trends across subjects, periods, and student groups.\n● Machine Learning: Build and evaluate an attendance shortage prediction model.\n● Dashboard: Display attendance trends, defaulter lists, and predictions.\n● Recommendations: Generate corrective actions for students falling short of attendance.\n🔎",
    "requirements": [
      "Analyze subject-wise and semester-wise attendance patterns.",
      "Identify chronic absenteeism and irregular trends.",
      "Predict future attendance shortage for students.",
      "Correlate attendance with academic performance.",
      "Present attendance insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Attendance Analytics → ML Prediction → Alert → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Attendance trend insights"
      },
      {
        "component": "ML Model",
        "output": "Shortage prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Attendance dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Corrective action suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 5 ==="
      }
    ]
  },
  {
    "id": "PS04",
    "title": "Smart Course & Elective Recommendation System",
    "domain": "Smart Education & Student Analytics",
    "description": "Students often struggle to select electives that match their strengths and career goals. Develop a Big Data\nAnalytics and Machine Learning solution to recommend suitable courses using past academic and interest\ndata.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify subject relationships and student interest patterns.\n● Machine Learning: Build and evaluate an elective performance prediction model.\n● Dashboard: Display student strengths, predicted scores, and suggested courses.\n● Recommendations: Generate personalised elective and course recommendations.\n🔎",
    "requirements": [
      "Analyze subject-wise strengths and weaknesses of students.",
      "Identify relationships between prior subjects and elective performance.",
      "Predict expected performance in available electives.",
      "Recommend the most suitable electives for each student.",
      "Present recommendations through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Analytics → ML Prediction → Matching → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Subject strength insights"
      },
      {
        "component": "ML Model",
        "output": "Elective performance prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Recommendation dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Personalised course suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 6 ==="
      }
    ]
  },
  {
    "id": "PS05",
    "title": "Examination Result Analytics & Grade Prediction System",
    "domain": "Smart Education & Student Analytics",
    "description": "Examination departments generate large volumes of result data across subjects, batches, and semesters.\nDevelop a Big Data Analytics and Machine Learning solution to analyze results and predict student\ngrades.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify performance trends across subjects, batches, and departments.\n● Machine Learning: Build and evaluate a grade prediction model.\n● Dashboard: Display pass percentage, subject analysis, and predicted grades.\n● Recommendations: Generate remedial coaching and improvement suggestions.\n🔎",
    "requirements": [
      "Analyze pass percentage and subject-wise performance trends.",
      "Identify difficult subjects and weak performing groups.",
      "Predict end-semester grades using internal assessment data.",
      "Compare batch-wise and department-wise performance.",
      "Present result insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Result Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Result & trend insights"
      },
      {
        "component": "ML Model",
        "output": "Grade prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Result analytics dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Remedial action suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 7 ==="
      }
    ]
  },
  {
    "id": "PS06",
    "title": "Student Skill Gap Analysis & Certification Recommendation System",
    "domain": "Smart Education & Student Analytics",
    "description": "Students acquire skills through courses, certifications, workshops, and projects. Develop a Big Data\nAnalytics and Machine Learning solution to map student skills against industry requirements and\nrecommend certifications.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify skill distribution and demand-supply gaps.\n● Machine Learning: Build and evaluate a skill readiness prediction model.\n● Dashboard: Display skill profiles, gaps, and readiness scores.\n● Recommendations: Generate certification and training recommendations.\n🔎",
    "requirements": [
      "Analyze existing skill profiles of students.",
      "Compare student skills with industry job requirements.",
      "Predict skill readiness levels for target job roles.",
      "Identify missing skills and priority learning areas.",
      "Present skill insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Skill Mapping → ML Prediction → Gap Analysis → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Skill distribution insights"
      },
      {
        "component": "ML Model",
        "output": "Skill readiness prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Skill gap dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Certification suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 8 ==="
      }
    ]
  },
  {
    "id": "PS07",
    "title": "Online Learning Engagement & E-Content Analytics System",
    "domain": "Smart Education & Student Analytics",
    "description": "Online learning platforms record video views, quiz attempts, assignment submissions, and login activity.\nDevelop a Big Data Analytics and Machine Learning solution to analyze learner engagement and predict\ncourse completion.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify engagement patterns across content, time, and learner groups.\n● Machine Learning: Build and evaluate a course completion prediction model.\n● Dashboard: Display engagement levels, content usage, and predictions.\n● Recommendations: Generate content improvement and learner re-engagement suggestions.\n🔎",
    "requirements": [
      "Analyze login, video and assignment activity patterns.",
      "Identify highly engaged and disengaged learners.",
      "Predict course completion probability.",
      "Identify content that learners frequently abandon.",
      "Present engagement insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Engagement Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Engagement insights"
      },
      {
        "component": "ML Model",
        "output": "Completion prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Engagement dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Content improvement suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 9 ==="
      }
    ]
  },
  {
    "id": "PS08",
    "title": "Faculty Feedback & Teaching Quality Analytics System",
    "domain": "Smart Education & Student Analytics",
    "description": "Institutions collect large volumes of student feedback each semester. Develop a Big Data Analytics and\nMachine Learning solution to analyze feedback data and assess teaching quality objectively.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify feedback patterns across faculty, subjects, and departments.\n● Machine Learning: Build and evaluate a teaching quality rating prediction model.\n● Dashboard: Display feedback trends, ratings, and comparisons.\n● Recommendations: Generate faculty development and training suggestions.\n🔎",
    "requirements": [
      "Analyze feedback scores across parameters and subjects.",
      "Identify strengths and improvement areas in teaching.",
      "Predict overall teaching quality ratings.",
      "Correlate feedback with student performance outcomes.",
      "Present feedback insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Feedback Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Feedback trend insights"
      },
      {
        "component": "ML Model",
        "output": "Teaching quality prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Feedback dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Faculty improvement suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 10 ==="
      }
    ]
  },
  {
    "id": "PS09",
    "title": "Library & Learning Resource Usage Analytics System",
    "domain": "Smart Education & Student Analytics",
    "description": "Library systems store issue-return records, digital resource access logs, and user details. Develop a Big Data\nAnalytics and Machine Learning solution to analyze resource usage and predict future demand.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify usage trends across resources, departments, and time periods.\n● Machine Learning: Build and evaluate a resource demand prediction model.\n● Dashboard: Display usage statistics, demand trends, and predictions.\n● Recommendations: Generate procurement and resource allocation suggestions.\n🔎",
    "requirements": [
      "Analyze book and e-resource usage patterns.",
      "Identify most demanded and least used resources.",
      "Predict future demand for books and resources.",
      "Identify reading patterns of different student groups.",
      "Present usage insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Usage Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Resource usage insights"
      },
      {
        "component": "ML Model",
        "output": "Demand prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Library usage dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Procurement suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 11 ==="
      }
    ]
  },
  {
    "id": "PS10",
    "title": "Admission Trend Analysis & Enrollment Prediction System",
    "domain": "Smart Education & Student Analytics",
    "description": "Admission data covering applications, cut-off marks, regions, categories, and branch preferences grows every\nyear. Develop a Big Data Analytics and Machine Learning solution to analyze admission trends and\npredict enrollment.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify admission and preference patterns across years and regions.\n● Machine Learning: Build and evaluate an enrollment prediction model.\n● Dashboard: Display admission trends, forecasts, and branch comparisons.\n● Recommendations: Generate admission planning and outreach suggestions.\n🔎",
    "requirements": [
      "Analyze branch-wise and region-wise admission trends.",
      "Identify factors influencing student branch preference.",
      "Predict expected enrollment numbers for upcoming years.",
      "Identify branches at risk of under-enrollment.",
      "Present admission insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Admission Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Admission trend insights"
      },
      {
        "component": "ML Model",
        "output": "Enrollment prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Admission dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Planning suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 12 ==="
      },
      {
        "component": "2.",
        "output": "Healthcare & Wellness Analytics"
      }
    ]
  },
  {
    "id": "PS11",
    "title": "Diabetes Risk Prediction & Patient Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Health check-up records contain glucose levels, BMI, blood pressure, age, and lifestyle details. Develop a Big\nData Analytics and Machine Learning solution to analyze patient data and predict diabetes risk.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between clinical parameters and diabetes risk.\n● Machine Learning: Build and evaluate a diabetes risk prediction model.\n● Dashboard: Display risk levels, patient groups, and key indicators.\n● Recommendations: Generate lifestyle and preventive care suggestions.\n🔎",
    "requirements": [
      "Analyze clinical and lifestyle parameters of patients.",
      "Identify key factors contributing to diabetes risk.",
      "Predict diabetes risk levels for individuals.",
      "Segment patients into low, moderate, and high risk groups.",
      "Present health insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Health Analytics → ML Prediction → Risk Grouping → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Health risk insights"
      },
      {
        "component": "ML Model",
        "output": "Diabetes risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Patient risk dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Preventive care suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 13 ==="
      }
    ]
  },
  {
    "id": "PS12",
    "title": "Heart Disease Prediction & Cardiac Risk Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Cardiac screening generates data on cholesterol, blood pressure, ECG results, chest pain type, and patient\nhistory. Develop a Big Data Analytics and Machine Learning solution to assess cardiac risk.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify patterns among cardiac indicators and patient outcomes.\n● Machine Learning: Build and evaluate a heart disease prediction model.\n● Dashboard: Display risk scores, indicator importance, and patient groups.\n● Recommendations: Generate screening and follow-up suggestions.\n🔎",
    "requirements": [
      "Analyze cardiac test parameters and patient history.",
      "Identify the most influential risk indicators.",
      "Predict heart disease risk for each patient.",
      "Compare risk across age and gender groups.",
      "Present cardiac insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Clinical Analytics → ML Prediction → Risk Scoring → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Cardiac risk insights"
      },
      {
        "component": "ML Model",
        "output": "Heart disease prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Cardiac risk dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Follow-up care suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 14 ==="
      }
    ]
  },
  {
    "id": "PS13",
    "title": "Hospital Readmission Prediction & Patient Monitoring System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Hospitals maintain admission, diagnosis, treatment, and discharge records for every patient. Develop a Big\nData Analytics and Machine Learning solution to predict the likelihood of patient readmission.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify readmission patterns across diagnoses, age groups, and stay duration.\n● Machine Learning: Build and evaluate a patient readmission prediction model.\n● Dashboard: Display readmission risk, patient lists, and trends.\n● Recommendations: Generate post-discharge care and follow-up suggestions.\n🔎",
    "requirements": [
      "Analyze admission, treatment and discharge patterns.",
      "Identify conditions associated with frequent readmission.",
      "Predict readmission probability for discharged patients.",
      "Highlight patients requiring close follow-up.",
      "Present monitoring insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Patient Analytics → ML Prediction → Alert → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Readmission pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Readmission prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Patient monitoring dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Follow-up care suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 15 ==="
      }
    ]
  },
  {
    "id": "PS14",
    "title": "Smart Health Check-up Report Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Diagnostic laboratories generate large volumes of test reports covering blood counts, lipid profiles, and organ\nfunction tests. Develop a Big Data Analytics and Machine Learning solution to analyze reports and flag\nabnormalities.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify abnormal value patterns and correlations between tests.\n● Machine Learning: Build and evaluate a health risk category prediction model.\n● Dashboard: Display test summaries, abnormal flags, and trends.\n● Recommendations: Generate further testing and consultation suggestions.\n🔎",
    "requirements": [
      "Analyze laboratory test values across patients.",
      "Identify abnormal and borderline test results.",
      "Predict general health risk categories.",
      "Track changes in patient reports over time.",
      "Present report insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Report Analytics → ML Prediction → Abnormality Detection → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Test result insights"
      },
      {
        "component": "ML Model",
        "output": "Health risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Health report dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Consultation suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 16 ==="
      }
    ]
  },
  {
    "id": "PS15",
    "title": "Fitness & Lifestyle Wellness Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Fitness trackers and wellness applications record steps, heart rate, sleep duration, calories, and activity\nlevels. Develop a Big Data Analytics and Machine Learning solution to analyze lifestyle data and assess\nwellness.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify lifestyle patterns and their relationship with wellness levels.\n● Machine Learning: Build and evaluate a wellness score prediction model.\n● Dashboard: Display activity trends, sleep quality, and wellness scores.\n● Recommendations: Generate personalised fitness and lifestyle suggestions.\n🔎",
    "requirements": [
      "Analyze activity, sleep and calorie patterns.",
      "Identify unhealthy lifestyle trends.",
      "Predict wellness/fitness score levels.",
      "Segment users based on activity behaviour.",
      "Present wellness insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Lifestyle Analytics → ML Prediction → Scoring → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Lifestyle insights"
      },
      {
        "component": "ML Model",
        "output": "Wellness score prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Wellness dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Fitness suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 17 ==="
      }
    ]
  },
  {
    "id": "PS16",
    "title": "Disease Outbreak Trend Analysis & Case Prediction System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Public health departments record daily case counts, locations, seasons, and population details. Develop a Big\nData Analytics and Machine Learning solution to analyze outbreak trends and forecast cases.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify spread patterns across regions, seasons, and demographics.\n● Machine Learning: Build and evaluate a case count forecasting model.\n● Dashboard: Display case trends, hotspot regions, and forecasts.\n● Recommendations: Generate resource deployment and awareness suggestions.\n🔎",
    "requirements": [
      "Analyze region-wise and season-wise case trends.",
      "Identify areas with rapidly rising case counts.",
      "Predict expected case numbers for coming weeks.",
      "Compare outbreak severity across regions.",
      "Present outbreak insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Trend Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Outbreak trend insights"
      },
      {
        "component": "ML Model",
        "output": "Case count forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Outbreak dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Preparedness suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 18 ==="
      }
    ]
  },
  {
    "id": "PS17",
    "title": "Hospital Resource & Bed Occupancy Prediction System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Hospitals record daily admissions, discharges, ward occupancy, and staff allocation. Develop a Big Data\nAnalytics and Machine Learning solution to analyze resource usage and predict bed occupancy.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify occupancy and admission trends across wards and time periods.\n● Machine Learning: Build and evaluate a bed occupancy prediction model.\n● Dashboard: Display occupancy levels, peak periods, and forecasts.\n● Recommendations: Generate resource and staff allocation suggestions.\n🔎",
    "requirements": [
      "Analyze ward-wise occupancy and admission patterns.",
      "Identify peak demand periods and bottlenecks.",
      "Predict future bed occupancy levels.",
      "Estimate staff and equipment requirements.",
      "Present resource insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Resource Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Occupancy insights"
      },
      {
        "component": "ML Model",
        "output": "Bed occupancy prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Resource dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Allocation suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 19 ==="
      }
    ]
  },
  {
    "id": "PS18",
    "title": "Medicine Demand Forecasting & Pharmacy Inventory Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Hospital pharmacies generate continuous data on medicine issues, stock levels, expiry dates, and purchase\norders. Develop a Big Data Analytics and Machine Learning solution to forecast medicine demand.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify consumption trends and seasonal demand patterns.\n● Machine Learning: Build and evaluate a medicine demand forecasting model.\n● Dashboard: Display stock levels, consumption trends, and forecasts.\n● Recommendations: Generate procurement and reorder suggestions.\n🔎",
    "requirements": [
      "Analyze medicine consumption and stock movement patterns.",
      "Identify fast moving and slow moving medicines.",
      "Predict future medicine demand.",
      "Detect stock-out and expiry risks.",
      "Present inventory insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Inventory Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Consumption insights"
      },
      {
        "component": "ML Model",
        "output": "Medicine demand forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Inventory dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Reorder suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 20 ==="
      }
    ]
  },
  {
    "id": "PS19",
    "title": "Maternal & Child Health Risk Analytics System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Primary health centres maintain records of maternal check-ups, nutrition levels, immunisation, and child\ngrowth measurements. Develop a Big Data Analytics and Machine Learning solution to identify health\nrisks.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify risk patterns across nutrition, age, and check-up history.\n● Machine Learning: Build and evaluate a maternal and child health risk prediction model.\n● Dashboard: Display risk categories, coverage gaps, and growth trends.\n● Recommendations: Generate nutrition and immunisation follow-up suggestions.\n🔎",
    "requirements": [
      "Analyze maternal and child health indicators.",
      "Identify malnutrition and immunisation gaps.",
      "Predict health risk levels for mothers and children.",
      "Highlight cases requiring urgent attention.",
      "Present health insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Health Analytics → ML Prediction → Risk Grouping → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Health indicator insights"
      },
      {
        "component": "ML Model",
        "output": "Health risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Maternal-child health dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Follow-up suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 21 ==="
      }
    ]
  },
  {
    "id": "PS20",
    "title": "Mental Health & Stress Level Prediction System",
    "domain": "Healthcare & Wellness Analytics",
    "description": "Wellness surveys collect data on sleep, workload, screen time, physical activity, and self-reported mood.\nDevelop a Big Data Analytics and Machine Learning solution to analyze stress indicators and predict\nstress levels.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between lifestyle factors and stress levels.\n● Machine Learning: Build and evaluate a stress level prediction model.\n● Dashboard: Display stress distribution, key factors, and group comparisons.\n● Recommendations: Generate wellness and counselling suggestions.\n🔎",
    "requirements": [
      "Analyze lifestyle, workload and mood indicators.",
      "Identify major contributors to stress.",
      "Predict stress level categories for individuals.",
      "Segment respondents into wellness groups.",
      "Present wellness insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Wellness Analytics → ML Prediction → Grouping → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Stress factor insights"
      },
      {
        "component": "ML Model",
        "output": "Stress level prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Wellness dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Counselling suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 22 ==="
      },
      {
        "component": "3.",
        "output": "Smart Agriculture & Environment"
      }
    ]
  },
  {
    "id": "PS21",
    "title": "Crop Yield Prediction & Farm Analytics System",
    "domain": "Smart Agriculture & Environment",
    "description": "Agricultural records contain data on crop type, area, soil, rainfall, fertilizer usage, and historical yield. Develop\na Big Data Analytics and Machine Learning solution to analyze farm data and predict crop yield.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between soil, weather, and yield outcomes.\n● Machine Learning: Build and evaluate a crop yield prediction model.\n● Dashboard: Display yield trends, regional comparisons, and predictions.\n● Recommendations: Generate crop planning and input usage suggestions.\n🔎",
    "requirements": [
      "Analyze crop, soil and weather parameters.",
      "Identify key factors influencing crop yield.",
      "Predict expected yield per hectare.",
      "Compare yield across crops, seasons, and regions.",
      "Present farm insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Farm Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Yield pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Crop yield prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Farm analytics dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Crop planning suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 23 ==="
      }
    ]
  },
  {
    "id": "PS22",
    "title": "Soil Health Analysis & Fertilizer Recommendation System",
    "domain": "Smart Agriculture & Environment",
    "description": "Soil testing laboratories generate large volumes of data on nitrogen, phosphorus, potassium, pH, and organic\ncarbon. Develop a Big Data Analytics and Machine Learning solution to assess soil health and\nrecommend fertilizers.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify nutrient distribution and deficiency patterns across regions.\n● Machine Learning: Build and evaluate a soil fertility classification model.\n● Dashboard: Display nutrient levels, fertility categories, and maps.\n● Recommendations: Generate fertilizer dosage and soil improvement suggestions.\n🔎",
    "requirements": [
      "Analyze soil nutrient levels across regions.",
      "Identify nutrient deficiencies and imbalances.",
      "Predict soil fertility categories.",
      "Match soil conditions with suitable fertilizer requirements.",
      "Present soil insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Soil Analytics → ML Prediction → Matching → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Soil nutrient insights"
      },
      {
        "component": "ML Model",
        "output": "Soil fertility prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Soil health dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Fertilizer suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 24 ==="
      }
    ]
  },
  {
    "id": "PS23",
    "title": "Smart Crop Recommendation System Based on Soil & Weather",
    "domain": "Smart Agriculture & Environment",
    "description": "Selecting the right crop depends on soil nutrients, rainfall, temperature, and humidity. Develop a Big Data\nAnalytics and Machine Learning solution to recommend the most suitable crop for given field conditions.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify how soil and climate conditions relate to crop suitability.\n● Machine Learning: Build and evaluate a crop recommendation classification model.\n● Dashboard: Display input conditions, suitability scores, and crop options.\n● Recommendations: Generate crop selection and sowing suggestions.\n🔎",
    "requirements": [
      "Analyze soil and climatic parameters of a region.",
      "Identify conditions favourable for different crops.",
      "Predict the most suitable crop for given inputs.",
      "Rank alternative crop options for the same field.",
      "Present recommendations through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Condition Analytics → ML Prediction → Ranking → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Suitability insights"
      },
      {
        "component": "ML Model",
        "output": "Crop recommendation prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Crop advisory dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Crop selection suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 25 ==="
      }
    ]
  },
  {
    "id": "PS24",
    "title": "Rainfall Prediction & Irrigation Planning Analytics System",
    "domain": "Smart Agriculture & Environment",
    "description": "Weather stations record daily temperature, humidity, wind speed, pressure, and rainfall over many years.\nDevelop a Big Data Analytics and Machine Learning solution to analyze weather data and support\nirrigation planning.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify rainfall trends and relationships among weather parameters.\n● Machine Learning: Build and evaluate a rainfall prediction model.\n● Dashboard: Display rainfall trends, forecasts, and irrigation needs.\n● Recommendations: Generate irrigation scheduling suggestions.\n🔎",
    "requirements": [
      "Analyze historical rainfall and weather patterns.",
      "Identify seasonal and regional rainfall trends.",
      "Predict expected rainfall levels.",
      "Estimate irrigation requirements for crops.",
      "Present weather insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Weather Analytics → ML Prediction → Planning → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Rainfall trend insights"
      },
      {
        "component": "ML Model",
        "output": "Rainfall prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Weather & irrigation dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Irrigation schedule suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 26 ==="
      }
    ]
  },
  {
    "id": "PS25",
    "title": "Crop Price Trend Analysis & Market Prediction System",
    "domain": "Smart Agriculture & Environment",
    "description": "Agricultural markets publish daily arrival quantities and price data for various commodities. Develop a Big\nData Analytics and Machine Learning solution to analyze price behaviour and predict future crop prices.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify price movement patterns across seasons, markets, and commodities.\n● Machine Learning: Build and evaluate a crop price forecasting model.\n● Dashboard: Display price trends, market comparisons, and forecasts.\n● Recommendations: Generate selling time and market selection suggestions.\n🔎",
    "requirements": [
      "Analyze commodity-wise and market-wise price trends.",
      "Identify seasonal price fluctuations.",
      "Predict future crop prices.",
      "Compare prices across markets and regions.",
      "Present market insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Market Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Price trend insights"
      },
      {
        "component": "ML Model",
        "output": "Crop price forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Market price dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Selling strategy suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 27 ==="
      }
    ]
  },
  {
    "id": "PS26",
    "title": "Air Quality Index Analytics & Pollution Level Prediction System",
    "domain": "Smart Agriculture & Environment",
    "description": "Air monitoring stations continuously record PM2.5, PM10, NO2, SO2, CO, and weather parameters. Develop\na Big Data Analytics and Machine Learning solution to analyze air quality and predict pollution levels.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify pollutant patterns across time, location, and weather conditions.\n● Machine Learning: Build and evaluate an AQI level prediction model.\n● Dashboard: Display pollutant levels, AQI categories, and trends.\n● Recommendations: Generate pollution control and public advisory suggestions.\n🔎",
    "requirements": [
      "Analyze pollutant concentration trends across locations.",
      "Identify major pollution sources and peak hours.",
      "Predict Air Quality Index (AQI) categories.",
      "Compare air quality across seasons and areas.",
      "Present pollution insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Air Quality Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Pollution trend insights"
      },
      {
        "component": "ML Model",
        "output": "AQI level prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Air quality dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Advisory suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 28 ==="
      }
    ]
  },
  {
    "id": "PS27",
    "title": "Water Quality Monitoring & Contamination Prediction System",
    "domain": "Smart Agriculture & Environment",
    "description": "Water testing agencies collect data on pH, turbidity, dissolved oxygen, hardness, and bacterial counts.\nDevelop a Big Data Analytics and Machine Learning solution to assess water quality and predict\ncontamination.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify contamination patterns across sources, regions, and seasons.\n● Machine Learning: Build and evaluate a water potability classification model.\n● Dashboard: Display parameter levels, unsafe sources, and quality maps.\n● Recommendations: Generate treatment and monitoring suggestions.\n🔎",
    "requirements": [
      "Analyze water quality parameters across sources.",
      "Identify contaminated and unsafe water sources.",
      "Predict water potability/quality categories.",
      "Track quality changes over seasons.",
      "Present water quality insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Quality Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Water quality insights"
      },
      {
        "component": "ML Model",
        "output": "Potability prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Water quality dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Treatment suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 29 ==="
      }
    ]
  },
  {
    "id": "PS28",
    "title": "Plant Disease Risk Prediction & Crop Advisory System",
    "domain": "Smart Agriculture & Environment",
    "description": "Field records capture crop stage, temperature, humidity, leaf wetness, pesticide usage, and observed\ninfections. Develop a Big Data Analytics and Machine Learning solution to predict plant disease risk.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between weather conditions and disease incidence.\n● Machine Learning: Build and evaluate a plant disease risk prediction model.\n● Dashboard: Display risk levels, affected fields, and condition trends.\n● Recommendations: Generate preventive spraying and crop care suggestions.\n🔎",
    "requirements": [
      "Analyze environmental and crop condition data.",
      "Identify conditions that favour disease outbreaks.",
      "Predict disease occurrence risk levels.",
      "Highlight fields requiring immediate attention.",
      "Present advisory insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Field Analytics → ML Prediction → Risk Alert → Advisory 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Disease pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Disease risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Crop advisory dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Preventive care suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 30 ==="
      }
    ]
  },
  {
    "id": "PS29",
    "title": "Livestock & Dairy Production Analytics System",
    "domain": "Smart Agriculture & Environment",
    "description": "Dairy farms record animal age, breed, feed intake, health status, and daily milk yield. Develop a Big Data\nAnalytics and Machine Learning solution to analyze livestock data and predict milk production.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between feed, health, and production levels.\n● Machine Learning: Build and evaluate a milk yield prediction model.\n● Dashboard: Display yield trends, animal performance, and forecasts.\n● Recommendations: Generate feeding and herd management suggestions.\n🔎",
    "requirements": [
      "Analyze feed, breed and health parameters.",
      "Identify factors affecting milk yield.",
      "Predict expected daily/monthly milk production.",
      "Detect animals with declining productivity.",
      "Present livestock insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Livestock Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Production insights"
      },
      {
        "component": "ML Model",
        "output": "Milk yield prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Livestock dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Herd management suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 31 ==="
      }
    ]
  },
  {
    "id": "PS30",
    "title": "Smart Waste Management & Recycling Analytics System",
    "domain": "Smart Agriculture & Environment",
    "description": "Municipal bodies record waste collection quantity, waste type, ward, vehicle trips, and recycling volumes.\nDevelop a Big Data Analytics and Machine Learning solution to analyze waste data and forecast\ngeneration.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify waste generation trends across wards, seasons, and waste types.\n● Machine Learning: Build and evaluate a waste generation forecasting model.\n● Dashboard: Display waste volumes, zone comparisons, and forecasts.\n● Recommendations: Generate collection scheduling and recycling suggestions.\n🔎",
    "requirements": [
      "Analyze ward-wise waste generation patterns.",
      "Identify high waste generating zones and waste types.",
      "Predict future waste generation volumes.",
      "Estimate recyclable waste potential.",
      "Present waste insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Waste Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Waste generation insights"
      },
      {
        "component": "ML Model",
        "output": "Waste volume forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Waste management dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Collection & recycling suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 32 ==="
      },
      {
        "component": "4.",
        "output": "Smart Business & Finance"
      }
    ]
  },
  {
    "id": "PS31",
    "title": "Smart Retail Sales Forecasting & Customer Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Retail businesses generate large volumes of data from sales transactions, customers, products, prices, and\ninventory. Develop a Big Data Analytics and Machine Learning solution to analyze retail data and support\nbetter sales and inventory decisions.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify sales, product, and customer purchasing patterns.\n● Machine Learning: Build and evaluate a sales/demand prediction model.\n● Dashboard: Display sales trends, customer segments, and predictions.\n● Recommendations: Generate inventory and product recommendations.\n🔎",
    "requirements": [
      "Analyze sales and customer purchasing patterns.",
      "Identify top-performing and low-performing products.",
      "Predict future product sales/demand using ML.",
      "Identify customer segments based on purchasing behaviour.",
      "Detect unusual sales patterns or transactions.",
      "Generate data-driven business recommendations."
    ],
    "pipeline": "Raw Data → Preprocessing → Big Data Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Sales & customer insights"
      },
      {
        "component": "ML Model",
        "output": "Sales/demand prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Sales & trend dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Inventory/product suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 33 ==="
      }
    ]
  },
  {
    "id": "PS32",
    "title": "Credit Card Fraud Detection & Transaction Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Banks process millions of card transactions containing amount, time, location, merchant, and device details.\nDevelop a Big Data Analytics and Machine Learning solution to analyze transactions and detect fraud.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify normal and abnormal transaction behaviour patterns.\n● Machine Learning: Build and evaluate a fraud detection classification model.\n● Dashboard: Display transaction trends, flagged cases, and risk scores.\n● Recommendations: Generate fraud prevention and verification suggestions.\n🔎",
    "requirements": [
      "Analyze transaction patterns across customers and merchants.",
      "Identify unusual spending behaviour.",
      "Predict fraudulent vs genuine transactions.",
      "Highlight high-risk transactions for review.",
      "Present fraud insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Transaction Analytics → ML Detection → Alert → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Transaction pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Fraud detection prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Fraud monitoring dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Prevention suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 34 ==="
      }
    ]
  },
  {
    "id": "PS33",
    "title": "Customer Churn Prediction & Retention Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Service companies maintain customer subscription, usage, billing, and complaint records. Develop a Big Data\nAnalytics and Machine Learning solution to analyze customer behaviour and predict churn.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify behavioural patterns that distinguish loyal and churning customers.\n● Machine Learning: Build and evaluate a customer churn prediction model.\n● Dashboard: Display churn risk, customer segments, and key drivers.\n● Recommendations: Generate retention offers and engagement suggestions.\n🔎",
    "requirements": [
      "Analyze usage, billing and complaint patterns.",
      "Identify key reasons behind customer churn.",
      "Predict customers likely to leave.",
      "Segment customers based on loyalty and value.",
      "Present retention insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Customer Analytics → ML Prediction → Segmentation → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Churn driver insights"
      },
      {
        "component": "ML Model",
        "output": "Churn prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Retention dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Retention strategy suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 35 ==="
      }
    ]
  },
  {
    "id": "PS34",
    "title": "Loan Approval Prediction & Credit Risk Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Financial institutions collect applicant income, employment, credit history, loan amount, and repayment data.\nDevelop a Big Data Analytics and Machine Learning solution to assess credit risk and predict loan\napproval.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify relationships between applicant attributes and repayment behaviour.\n● Machine Learning: Build and evaluate a loan approval / default risk prediction model.\n● Dashboard: Display risk scores, approval rates, and applicant profiles.\n● Recommendations: Generate lending policy and risk mitigation suggestions.\n🔎",
    "requirements": [
      "Analyze applicant financial and credit profiles.",
      "Identify factors influencing loan default.",
      "Predict loan approval/default risk.",
      "Segment applicants into risk categories.",
      "Present credit insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Credit Analytics → ML Prediction → Risk Scoring → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Credit risk insights"
      },
      {
        "component": "ML Model",
        "output": "Loan approval prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Credit risk dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Lending suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 36 ==="
      }
    ]
  },
  {
    "id": "PS35",
    "title": "E-Commerce Product Recommendation & Review Analytics System",
    "domain": "Smart Business & Finance",
    "description": "E-commerce platforms store browsing history, purchase records, ratings, and product reviews. Develop a Big\nData Analytics and Machine Learning solution to analyze customer behaviour and recommend products.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify buying patterns, product associations, and rating trends.\n● Machine Learning: Build and evaluate a product recommendation model.\n● Dashboard: Display top products, customer preferences, and suggestions.\n● Recommendations: Generate personalised product recommendations.\n🔎",
    "requirements": [
      "Analyze purchase and browsing behaviour.",
      "Identify frequently bought product combinations.",
      "Predict products a customer is likely to buy.",
      "Analyze rating and review trends for products.",
      "Present recommendation insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Behaviour Analytics → ML Recommendation → Visualization → Suggestion 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Buying pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Product recommendation prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Recommendation dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Personalised product suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 37 ==="
      }
    ]
  },
  {
    "id": "PS36",
    "title": "Inventory Demand Forecasting & Supply Chain Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Warehouses and distributors record stock levels, dispatches, lead times, and supplier performance. Develop a\nBig Data Analytics and Machine Learning solution to analyze supply chain data and forecast demand.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify demand and supply patterns across products and suppliers.\n● Machine Learning: Build and evaluate an inventory demand forecasting model.\n● Dashboard: Display stock levels, demand forecasts, and supplier performance.\n● Recommendations: Generate reorder and procurement suggestions.\n🔎",
    "requirements": [
      "Analyze stock movement and supplier performance.",
      "Identify overstock and stock-out situations.",
      "Predict future inventory demand.",
      "Estimate optimal reorder levels.",
      "Present supply chain insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Supply Chain Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Supply chain insights"
      },
      {
        "component": "ML Model",
        "output": "Demand forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Inventory dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Reorder suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 38 ==="
      }
    ]
  },
  {
    "id": "PS37",
    "title": "Stock Market Trend Analysis & Price Movement Prediction System",
    "domain": "Smart Business & Finance",
    "description": "Stock exchanges publish daily open, high, low, close, and volume data for listed companies. Develop a Big\nData Analytics and Machine Learning solution to analyze market data and predict price movement.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify trend, volatility, and correlation patterns in market data.\n● Machine Learning: Build and evaluate a price movement prediction model.\n● Dashboard: Display price trends, indicators, and predictions.\n● Recommendations: Generate portfolio observation and risk-awareness suggestions.\n🔎",
    "requirements": [
      "Analyze historical price and volume trends.",
      "Identify volatility and momentum patterns.",
      "Predict short-term price movement direction.",
      "Compare performance across sectors and stocks.",
      "Present market insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Market Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Market trend insights"
      },
      {
        "component": "ML Model",
        "output": "Price movement prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Market analytics dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Risk-aware suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 39 ==="
      }
    ]
  },
  {
    "id": "PS38",
    "title": "Customer Segmentation & Targeted Marketing Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Businesses collect customer demographics, spending scores, purchase frequency, and campaign responses.\nDevelop a Big Data Analytics and Machine Learning solution to segment customers and support targeted\nmarketing.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify behavioural and demographic patterns among customers.\n● Machine Learning: Build and evaluate a customer segmentation and response prediction model.\n● Dashboard: Display segments, profiles, and response predictions.\n● Recommendations: Generate targeted campaign and offer suggestions.\n🔎",
    "requirements": [
      "Analyze demographic and spending behaviour data.",
      "Identify distinct customer groups.",
      "Predict campaign response likelihood.",
      "Profile each segment with key characteristics.",
      "Present segmentation insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Customer Analytics → ML Clustering/Prediction → Profiling → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Customer behaviour insights"
      },
      {
        "component": "ML Model",
        "output": "Segment & response prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Segmentation dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Marketing campaign suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 40 ==="
      }
    ]
  },
  {
    "id": "PS39",
    "title": "Insurance Claim Analytics & Fraudulent Claim Detection System",
    "domain": "Smart Business & Finance",
    "description": "Insurance companies process claims containing policy details, claim amount, incident type, and settlement\nhistory. Develop a Big Data Analytics and Machine Learning solution to analyze claims and detect\nsuspicious cases.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify genuine and suspicious claim patterns.\n● Machine Learning: Build and evaluate a fraudulent claim detection model.\n● Dashboard: Display claim trends, flagged claims, and risk levels.\n● Recommendations: Generate claim verification and policy suggestions.\n🔎",
    "requirements": [
      "Analyze claim patterns across policies and regions.",
      "Identify unusual or repeated claim behaviour.",
      "Predict fraudulent claim probability.",
      "Estimate expected claim settlement amounts.",
      "Present claim insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Claim Analytics → ML Detection → Alert → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Claim pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Fraud claim prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Claim monitoring dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Verification suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 41 ==="
      }
    ]
  },
  {
    "id": "PS40",
    "title": "Employee Attrition Prediction & HR Analytics System",
    "domain": "Smart Business & Finance",
    "description": "Organisations maintain employee data on salary, experience, performance ratings, promotions, and\nsatisfaction scores. Develop a Big Data Analytics and Machine Learning solution to analyze workforce\ndata and predict attrition.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify workforce patterns associated with attrition.\n● Machine Learning: Build and evaluate an employee attrition prediction model.\n● Dashboard: Display attrition risk, department comparisons, and key factors.\n● Recommendations: Generate retention and engagement suggestions.\n🔎",
    "requirements": [
      "Analyze salary, performance and satisfaction data.",
      "Identify major reasons for employee attrition.",
      "Predict employees likely to resign.",
      "Compare attrition across departments and roles.",
      "Present HR insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → HR Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Workforce insights"
      },
      {
        "component": "ML Model",
        "output": "Attrition prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "HR analytics dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Retention suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 42 ==="
      },
      {
        "component": "5.",
        "output": "Smart City & Transportation"
      }
    ]
  },
  {
    "id": "PS41",
    "title": "Traffic Congestion Analysis & Travel Time Prediction System",
    "domain": "Smart City & Transportation",
    "description": "City traffic systems record vehicle counts, signal timings, road segments, weather, and travel speed. Develop\na Big Data Analytics and Machine Learning solution to analyze congestion and predict travel time.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify congestion patterns across roads, time slots, and conditions.\n● Machine Learning: Build and evaluate a travel time / congestion prediction model.\n● Dashboard: Display traffic density, peak hours, and predictions.\n● Recommendations: Generate route planning and signal timing suggestions.\n🔎",
    "requirements": [
      "Analyze road-wise and hour-wise traffic patterns.",
      "Identify congestion-prone roads and peak hours.",
      "Predict expected travel time/congestion levels.",
      "Compare traffic conditions across zones.",
      "Present traffic insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Traffic Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Traffic pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Travel time prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Traffic dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Route & signal suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 43 ==="
      }
    ]
  },
  {
    "id": "PS42",
    "title": "Road Accident Analytics & Hotspot Prediction System",
    "domain": "Smart City & Transportation",
    "description": "Traffic police maintain accident records with location, time, weather, vehicle type, and severity. Develop a Big\nData Analytics and Machine Learning solution to analyze accident data and identify risk hotspots.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify accident patterns across locations, time, and weather conditions.\n● Machine Learning: Build and evaluate an accident severity/risk prediction model.\n● Dashboard: Display hotspots, severity levels, and trends.\n● Recommendations: Generate road safety and enforcement suggestions.\n🔎",
    "requirements": [
      "Analyze location-wise and time-wise accident patterns.",
      "Identify major causes and contributing conditions.",
      "Predict accident severity/risk levels.",
      "Highlight accident-prone zones on a map.",
      "Present safety insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Accident Analytics → ML Prediction → Hotspot Mapping → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Accident pattern insights"
      },
      {
        "component": "ML Model",
        "output": "Severity/risk prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Accident hotspot dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Road safety suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 44 ==="
      }
    ]
  },
  {
    "id": "PS43",
    "title": "Public Transport Demand Forecasting & Route Optimization System",
    "domain": "Smart City & Transportation",
    "description": "Transport corporations record ticket sales, route details, trip timings, and passenger counts. Develop a Big\nData Analytics and Machine Learning solution to analyze ridership and forecast passenger demand.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify ridership trends across routes, days, and time slots.\n● Machine Learning: Build and evaluate a passenger demand forecasting model.\n● Dashboard: Display ridership levels, route performance, and forecasts.\n● Recommendations: Generate scheduling and route optimisation suggestions.\n🔎",
    "requirements": [
      "Analyze route-wise and time-wise ridership patterns.",
      "Identify overcrowded and underutilised routes.",
      "Predict future passenger demand.",
      "Estimate optimal trip frequency for routes.",
      "Present transport insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Ridership Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Ridership insights"
      },
      {
        "component": "ML Model",
        "output": "Passenger demand forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Transport dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Route & schedule suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 45 ==="
      }
    ]
  },
  {
    "id": "PS44",
    "title": "Smart Parking Availability Prediction & Analytics System",
    "domain": "Smart City & Transportation",
    "description": "Smart parking facilities record entry-exit timings, slot occupancy, vehicle type, and payment data. Develop a\nBig Data Analytics and Machine Learning solution to analyze parking usage and predict availability.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify occupancy patterns across locations, hours, and vehicle types.\n● Machine Learning: Build and evaluate a parking availability prediction model.\n● Dashboard: Display occupancy rates, peak hours, and availability forecasts.\n● Recommendations: Generate parking allocation and pricing suggestions.\n🔎",
    "requirements": [
      "Analyze slot occupancy and duration patterns.",
      "Identify peak parking hours and locations.",
      "Predict parking slot availability.",
      "Estimate revenue and utilisation levels.",
      "Present parking insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Parking Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Parking usage insights"
      },
      {
        "component": "ML Model",
        "output": "Availability prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Parking dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Allocation suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 46 ==="
      }
    ]
  },
  {
    "id": "PS45",
    "title": "Electricity Consumption Analytics & Demand Prediction System",
    "domain": "Smart City & Transportation",
    "description": "Electricity boards maintain consumption data by household, area, tariff category, season, and time of day.\nDevelop a Big Data Analytics and Machine Learning solution to analyze usage and forecast electricity\ndemand.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify consumption trends across areas, seasons, and consumer categories.\n● Machine Learning: Build and evaluate an electricity demand forecasting model.\n● Dashboard: Display consumption trends, peak loads, and forecasts.\n● Recommendations: Generate load management and energy saving suggestions.\n🔎",
    "requirements": [
      "Analyze area-wise and category-wise consumption patterns.",
      "Identify peak load periods and high consumption zones.",
      "Predict future electricity demand.",
      "Detect abnormal consumption behaviour.",
      "Present energy insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Energy Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Consumption insights"
      },
      {
        "component": "ML Model",
        "output": "Demand forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Energy dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Load management suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 47 ==="
      }
    ]
  },
  {
    "id": "PS46",
    "title": "Municipal Waste Collection Analytics & Route Planning System",
    "domain": "Smart City & Transportation",
    "description": "City corporations track bin fill levels, collection vehicle trips, fuel usage, and ward-wise waste volumes.\nDevelop a Big Data Analytics and Machine Learning solution to analyze collection operations and plan\nroutes.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify collection efficiency and overflow patterns across wards.\n● Machine Learning: Build and evaluate a bin fill level prediction model.\n● Dashboard: Display fill levels, trip efficiency, and zone comparisons.\n● Recommendations: Generate collection route and frequency suggestions.\n🔎",
    "requirements": [
      "Analyze bin fill and collection trip patterns.",
      "Identify wards with frequent overflow issues.",
      "Predict bin fill levels and collection demand.",
      "Estimate optimal collection frequency per zone.",
      "Present operational insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Collection Analytics → ML Prediction → Route Planning → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Collection efficiency insights"
      },
      {
        "component": "ML Model",
        "output": "Fill level prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Collection dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Route planning suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 48 ==="
      }
    ]
  },
  {
    "id": "PS47",
    "title": "Water Supply Distribution & Leakage Detection Analytics System",
    "domain": "Smart City & Transportation",
    "description": "Water boards record supply volumes, pressure readings, consumption, and billing data across zones.\nDevelop a Big Data Analytics and Machine Learning solution to analyze distribution and detect possible\nleakages.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify supply-consumption mismatches and loss patterns.\n● Machine Learning: Build and evaluate a leakage/anomaly detection model.\n● Dashboard: Display supply vs consumption, loss zones, and forecasts.\n● Recommendations: Generate maintenance and distribution suggestions.\n🔎",
    "requirements": [
      "Analyze zone-wise supply and consumption data.",
      "Identify gaps between supplied and billed water.",
      "Predict leakage/abnormal loss zones.",
      "Forecast future water demand for each zone.",
      "Present distribution insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Distribution Analytics → ML Detection → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Distribution insights"
      },
      {
        "component": "ML Model",
        "output": "Leakage detection prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Water supply dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Maintenance suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 49 ==="
      }
    ]
  },
  {
    "id": "PS48",
    "title": "Smart Street Lighting & Energy Usage Analytics System",
    "domain": "Smart City & Transportation",
    "description": "Smart street lighting systems record lamp status, operating hours, energy consumption, and fault reports.\nDevelop a Big Data Analytics and Machine Learning solution to analyze lighting operations and predict\nfaults.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify consumption and fault patterns across zones and lamp types.\n● Machine Learning: Build and evaluate a lamp fault prediction model.\n● Dashboard: Display energy usage, fault alerts, and zone comparisons.\n● Recommendations: Generate maintenance and energy saving suggestions.\n🔎",
    "requirements": [
      "Analyze energy consumption and operating hour patterns.",
      "Identify zones with high energy wastage.",
      "Predict lamp failure/fault occurrence.",
      "Estimate potential energy savings.",
      "Present lighting insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Energy Analytics → ML Prediction → Alert → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Energy usage insights"
      },
      {
        "component": "ML Model",
        "output": "Fault prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Street lighting dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Maintenance suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 50 ==="
      }
    ]
  },
  {
    "id": "PS49",
    "title": "Citizen Grievance Analytics & Resolution Time Prediction System",
    "domain": "Smart City & Transportation",
    "description": "Municipal grievance portals collect complaints with category, ward, priority, assigned department, and\nresolution time. Develop a Big Data Analytics and Machine Learning solution to analyze complaints and\npredict resolution time.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify complaint trends across categories, wards, and departments.\n● Machine Learning: Build and evaluate a resolution time prediction model.\n● Dashboard: Display complaint volumes, pending cases, and predicted timelines.\n● Recommendations: Generate workload allocation and service improvement suggestions.\n🔎",
    "requirements": [
      "Analyze category-wise and ward-wise complaint patterns.",
      "Identify departments with pending and delayed cases.",
      "Predict expected resolution time for new complaints.",
      "Highlight recurring civic issues.",
      "Present grievance insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Grievance Analytics → ML Prediction → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Grievance trend insights"
      },
      {
        "component": "ML Model",
        "output": "Resolution time prediction"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "Grievance dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Service improvement suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 51 ==="
      }
    ]
  },
  {
    "id": "PS50",
    "title": "EV Charging Station Demand Analytics & Planning System",
    "domain": "Smart City & Transportation",
    "description": "Electric vehicle charging networks record session duration, energy delivered, station location, and time of use.\nDevelop a Big Data Analytics and Machine Learning solution to analyze charging demand and support\nstation planning.\n\nTeams will receive a relevant dataset and develop a working prototype that includes:\n● Data Preprocessing: Cleaning, transformation, and feature selection.\n● Data Analytics: Identify demand patterns across stations, hours, and vehicle types.\n● Machine Learning: Build and evaluate a charging demand forecasting model.\n● Dashboard: Display station usage, peak hours, and demand forecasts.\n● Recommendations: Generate station placement and capacity suggestions.\n🔎",
    "requirements": [
      "Analyze station-wise and hour-wise charging patterns.",
      "Identify overloaded and underused charging stations.",
      "Predict future charging demand.",
      "Estimate suitable locations for new stations.",
      "Present charging insights through a dashboard."
    ],
    "pipeline": "Raw Data → Preprocessing → Charging Analytics → ML Forecasting → Visualization → Recommendation 🔎",
    "expected_outcomes": [
      {
        "component": "Dataset",
        "output": "Cleaned & processed data"
      },
      {
        "component": "Analytics",
        "output": "Charging demand insights"
      },
      {
        "component": "ML Model",
        "output": "Demand forecast"
      },
      {
        "component": "Evaluation",
        "output": "Suitable ML performance metrics"
      },
      {
        "component": "Dashboard",
        "output": "EV charging dashboard"
      },
      {
        "component": "Recommendation",
        "output": "Station planning suggestions"
      },
      {
        "component": "Source Code",
        "output": "Complete executable solution"
      },
      {
        "component": "Presentation",
        "output": "Solution demonstration"
      },
      {
        "component": "===",
        "output": "PAGE 52 ==="
      },
      {
        "component": "🔎",
        "output": "Hackathon Evaluation Pattern – 100 Marks"
      },
      {
        "component": "S.",
        "output": "No. Evaluation Criteria Marks"
      },
      {
        "component": "1",
        "output": "Data Analytics & Preprocessing (Data cleaning & preprocessing,"
      },
      {
        "component": "Exploratory",
        "output": "Data Analysis, Feature Engineering/Feature selection &"
      },
      {
        "component": "Quality",
        "output": "and relevance of analytical insights)"
      },
      {
        "component": "2",
        "output": "Machine Learning Model (Selection and justification of ML algorithm,"
      },
      {
        "component": "Model",
        "output": "implementation, Model performance & Model evaluation and"
      },
      {
        "component": "3",
        "output": "Innovation, Solution & Dashboard (Innovation/originality of the"
      },
      {
        "component": "approach,",
        "output": "Practical solution and functionality,"
      },
      {
        "component": "Dashboard",
        "output": "/Visualization quality & Integration and usability)"
      },
      {
        "component": "4",
        "output": "Individual Contribution (Individual Technical Contribution,"
      },
      {
        "component": "Understanding",
        "output": "of assigned module/code, Individual problem solving"
      },
      {
        "component": "contribution",
        "output": "& Individual explanation and response to judges)"
      },
      {
        "component": "Total",
        "output": "100"
      }
    ]
  }
];

async function seed() {
  console.log(`Attempting to upsert ${problems.length} problem statements into Supabase...`);
  
  const { data, error } = await supabase
    .from('problems')
    .upsert(problems, { onConflict: 'id' })
    .select('id');

  if (error) {
    console.error("Supabase upsert error:", error);
    process.exit(1);
  }

  console.log("SUCCESS! Successfully upserted problems:", data ? data.length : problems.length);

  // Verification query
  const { count, error: countErr } = await supabase
    .from('problems')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error("Count verification error:", countErr);
  } else {
    console.log(`Current total count in public.problems table: ${count}`);
  }
}

seed();
