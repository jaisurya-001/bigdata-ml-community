-- Hackathon Problem Statement Management Schema & RLS Policies
-- Execute this SQL script in your Supabase SQL Editor

-- 1. ALLOWED USERS TABLE
CREATE TABLE IF NOT EXISTS public.allowed_users (
    email TEXT PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'LEADER')),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    pipeline TEXT,
    expected_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ALLOCATIONS TABLE (Ensures atomic problem selection and single lock per leader)
CREATE TABLE IF NOT EXISTS public.allocations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    problem_id TEXT NOT NULL UNIQUE REFERENCES public.problems(id) ON DELETE CASCADE,
    leader_email TEXT NOT NULL UNIQUE REFERENCES public.allowed_users(email) ON DELETE CASCADE,
    leader_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR ALLOWED USERS
CREATE POLICY "Allow authenticated users to read allowed_users"
    ON public.allowed_users FOR SELECT
    TO authenticated
    USING (true);

-- POLICIES FOR SETTINGS
CREATE POLICY "Allow authenticated users to read settings"
    ON public.settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admin to update settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(auth.jwt() ->> 'email') 
            AND role = 'ADMIN'
        )
    );

-- POLICIES FOR PROBLEMS
CREATE POLICY "Allow authenticated authorized users to read problems"
    ON public.problems FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow admin to insert/update problems"
    ON public.problems FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(auth.jwt() ->> 'email') 
            AND role = 'ADMIN'
        )
    );

-- POLICIES FOR ALLOCATIONS
CREATE POLICY "Allow authenticated authorized users to read allocations"
    ON public.allocations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Allow authorized leaders and admin to insert allocation"
    ON public.allocations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
        AND lower(leader_email) = lower(auth.jwt() ->> 'email')
    );

DROP POLICY IF EXISTS "Allow admin to delete allocations" ON public.allocations;

CREATE POLICY "Allow admin to delete allocations"
    ON public.allocations FOR DELETE
    TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'jaisuryav.cs25@bitsathy.ac.in'
        OR lower(auth.email()) = 'jaisuryav.cs25@bitsathy.ac.in'
        OR EXISTS (
            SELECT 1 FROM public.allowed_users 
            WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', auth.email())) 
            AND role = 'ADMIN'
        )
    );

-- SEED SETTINGS DEFAULT
INSERT INTO public.settings (key, value)
VALUES ('portal_released', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- SEED 1 ADMIN & 50 LEADERS (Emails normalized to lowercase)
INSERT INTO public.allowed_users (email, role, name) VALUES
('jaisuryav.cs25@bitsathy.ac.in', 'ADMIN', 'Admin / Jaisurya'),
('mogithab.ad25@bitsathy.ac.in', 'LEADER', 'Mogithab'),
('sakthivels.al24@bitsathy.ac.in', 'LEADER', 'Sakthivels'),
('pragathishp.it25@bitsathy.ac.in', 'LEADER', 'Pragathishp'),
('grohithlakshman.cs24@bitsathy.ac.in', 'LEADER', 'Grohithlakshman'),
('nithyasreev.it25@bitsathy.ac.in', 'LEADER', 'Nithyasreev'),
('sharmilam.cb24@bitsathy.ac.in', 'LEADER', 'Sharmilam'),
('gunam.ad24@bitsathy.ac.in', 'LEADER', 'Gunam'),
('lokeshr.it24@bitsathy.ac.in', 'LEADER', 'Lokeshr'),
('elakkiyanvelusamy.it25@bitsathy.ac.in', 'LEADER', 'Elakkiyanvelusamy'),
('manojim.al25@bitsathy.ac.in', 'LEADER', 'Manojim'),
('vedhashrisaravanan.cs25@bitsathy.ac.in', 'LEADER', 'Vedhashrisaravanan'),
('gokulaharinimd.cs24@bitsathy.ac.in', 'LEADER', 'Gokulaharinimd'),
('manishmm.ad25@bitsathy.ac.in', 'LEADER', 'Manishmm'),
('nidarshanpk.al25@bitsathy.ac.in', 'LEADER', 'Nidarshanpk'),
('kavipriyav.cs25@bitsathy.ac.in', 'LEADER', 'Kavipriyav'),
('shanmugayinis.it25@bitsathy.ac.in', 'LEADER', 'Shanmugayinis'),
('saruthiv.cs24@bitsathy.ac.in', 'LEADER', 'Saruthiv'),
('ghuruvisakangp.al25@bitsathy.ac.in', 'LEADER', 'Ghuruvisakangp'),
('ragulp.cs25@bitsathy.ac.in', 'LEADER', 'Ragulp'),
('hemavarnam.it24@bitsathy.ac.in', 'LEADER', 'Hemavarnam'),
('dharaneesham.cs25@bitsathy.ac.in', 'LEADER', 'Dharaneesham'),
('sanjaivs.ad24@bitsathy.ac.in', 'LEADER', 'Sanjaivs'),
('harinisrir.it24@bitsathy.ac.in', 'LEADER', 'Harinisrir'),
('kirankumarv.it24@bitsathy.ac.in', 'LEADER', 'Kirankumarv'),
('lakshatrar.it25@bitsathy.ac.in', 'LEADER', 'Lakshatrar'),
('rohiths.cs25@bitsathy.ac.in', 'LEADER', 'Rohiths'),
('mokeethy.al25@bitsathy.ac.in', 'LEADER', 'Mokeethy'),
('sanjaypravinr.cs25@bitsathy.ac.in', 'LEADER', 'Sanjaypravinr'),
('saswaanthkj.cs25@bitsathy.ac.in', 'LEADER', 'Saswaanthkj'),
('jeevamania.cs24@bitsathy.ac.in', 'LEADER', 'Jeevamania'),
('srirama.cs25@bitsathy.ac.in', 'LEADER', 'Srirama'),
('suwathim.ad25@bitsathy.ac.in', 'LEADER', 'Suwathim'),
('niranjans.it25@bitsathy.ac.in', 'LEADER', 'Niranjans'),
('redhanyad.al25@bitsathy.ac.in', 'LEADER', 'Redhanyad'),
('poorvanthikav.ad25@bitsathy.ac.in', 'LEADER', 'Poorvanthikav'),
('hemalathaa.ad24@bitsathy.ac.in', 'LEADER', 'Hemalathaa'),
('rithanyas.cs25@bitsathy.ac.in', 'LEADER', 'Rithanyas'),
('mithunnb.cs25@bitsathy.ac.in', 'LEADER', 'Mithunnb'),
('gayathrideviv.al25@bitsathy.ac.in', 'LEADER', 'Gayathrideviv'),
('ishanap.cs25@bitsathy.ac.in', 'LEADER', 'Ishanap'),
('nivethaeswarim.ad25@bitsathy.ac.in', 'LEADER', 'Nivethaeswarim'),
('tharunpranavrs.cs24@bitsathy.ac.in', 'LEADER', 'Tharunpranavrs'),
('rrishitha.it24@bitsathy.ac.in', 'LEADER', 'Rrishitha'),
('sabareeswarankv.cs24@bitsathy.ac.in', 'LEADER', 'Sabareeswarankv'),
('dakshitas.ad24@bitsathy.ac.in', 'LEADER', 'Dakshitas'),
('madhuvarunps.it25@bitsathy.ac.in', 'LEADER', 'Madhuvarunps'),
('sangeethas.cs25@bitsathy.ac.in', 'LEADER', 'Sangeethas'),
('lekasris.it25@bitsathy.ac.in', 'LEADER', 'Lekasris'),
('nethras.it24@bitsathy.ac.in', 'LEADER', 'Nethras'),
('iniyaam.cs24@bitsathy.ac.in', 'LEADER', 'Iniyaam')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name;

-- ========================================================
-- 50 HACKATHON PROBLEM STATEMENTS (SIH Big Data & ML)
-- ========================================================

INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS01', 'Smart Student Performance & Placement Prediction System', 'Smart Education & Student Analytics', 'Develop a Big Data Analytics and Machine Learning solution to analyze student academic, attendance,
technical skills, aptitude, certifications, and training data.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify meaningful patterns and relationships between academic and skill parameters.
● Machine Learning: Build and evaluate a placement-readiness prediction model.
● Dashboard: Display performance, skill gaps, predictions, and insights.
● Recommendations: Generate suitable improvement suggestions based on analysis.', '["Identify key factors affecting placement readiness.", "Predict placement readiness levels.", "Identify individual skill gaps.", "Generate data-driven recommendations.", "Present insights through a dashboard/visualizations."]'::jsonb, 'Raw Data → Preprocessing → Analytics → ML Prediction → Skill Gap → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Key insights & patterns"}, {"component": "ML Model", "output": "Placement-readiness prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Visual insights & predictions"}, {"component": "Recommendation", "output": "Data-driven skill-gap suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS02', 'Student Dropout Risk Prediction & Early Intervention System', 'Smart Education & Student Analytics', 'Educational institutions maintain large volumes of data on attendance, internal marks, fee payments,
backlogs, and counselling records. Develop a Big Data Analytics and Machine Learning solution to
identify students at risk of discontinuing their studies.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify academic and behavioural patterns associated with dropout.
● Machine Learning: Build and evaluate a dropout-risk classification model.
● Dashboard: Display risk levels, affected students, and contributing factors.
● Recommendations: Generate early intervention and counselling suggestions.', '["Analyze attendance, academic and behavioural trends.", "Identify key factors contributing to dropout risk.", "Predict dropout risk levels for each student.", "Highlight students requiring immediate counselling.", "Present risk insights through a dashboard/visualizations."]'::jsonb, 'Raw Data → Preprocessing → Risk Analytics → ML Prediction → Alert → Intervention', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Dropout pattern insights"}, {"component": "ML Model", "output": "Dropout risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Risk monitoring dashboard"}, {"component": "Recommendation", "output": "Intervention suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS03', 'Student Attendance Analytics & Absenteeism Prediction System', 'Smart Education & Student Analytics', 'Attendance records collected across semesters, subjects, and sessions form a valuable data source. Develop
a Big Data Analytics and Machine Learning solution to analyze attendance behaviour and predict
absenteeism.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify absenteeism trends across subjects, periods, and student groups.
● Machine Learning: Build and evaluate an attendance shortage prediction model.
● Dashboard: Display attendance trends, defaulter lists, and predictions.
● Recommendations: Generate corrective actions for students falling short of attendance.', '["Analyze subject-wise and semester-wise attendance patterns.", "Identify chronic absenteeism and irregular trends.", "Predict future attendance shortage for students.", "Correlate attendance with academic performance.", "Present attendance insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Attendance Analytics → ML Prediction → Alert → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Attendance trend insights"}, {"component": "ML Model", "output": "Shortage prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Attendance dashboard"}, {"component": "Recommendation", "output": "Corrective action suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS04', 'Smart Course & Elective Recommendation System', 'Smart Education & Student Analytics', 'Students often struggle to select electives that match their strengths and career goals. Develop a Big Data
Analytics and Machine Learning solution to recommend suitable courses using past academic and interest
data.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify subject relationships and student interest patterns.
● Machine Learning: Build and evaluate an elective performance prediction model.
● Dashboard: Display student strengths, predicted scores, and suggested courses.
● Recommendations: Generate personalised elective and course recommendations.', '["Analyze subject-wise strengths and weaknesses of students.", "Identify relationships between prior subjects and elective performance.", "Predict expected performance in available electives.", "Recommend the most suitable electives for each student.", "Present recommendations through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Analytics → ML Prediction → Matching → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Subject strength insights"}, {"component": "ML Model", "output": "Elective performance prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Recommendation dashboard"}, {"component": "Recommendation", "output": "Personalised course suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS05', 'Examination Result Analytics & Grade Prediction System', 'Smart Education & Student Analytics', 'Examination departments generate large volumes of result data across subjects, batches, and semesters.
Develop a Big Data Analytics and Machine Learning solution to analyze results and predict student
grades.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify performance trends across subjects, batches, and departments.
● Machine Learning: Build and evaluate a grade prediction model.
● Dashboard: Display pass percentage, subject analysis, and predicted grades.
● Recommendations: Generate remedial coaching and improvement suggestions.', '["Analyze pass percentage and subject-wise performance trends.", "Identify difficult subjects and weak performing groups.", "Predict end-semester grades using internal assessment data.", "Compare batch-wise and department-wise performance.", "Present result insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Result Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Result & trend insights"}, {"component": "ML Model", "output": "Grade prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Result analytics dashboard"}, {"component": "Recommendation", "output": "Remedial action suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS06', 'Student Skill Gap Analysis & Certification Recommendation System', 'Smart Education & Student Analytics', 'Students acquire skills through courses, certifications, workshops, and projects. Develop a Big Data
Analytics and Machine Learning solution to map student skills against industry requirements and
recommend certifications.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify skill distribution and demand-supply gaps.
● Machine Learning: Build and evaluate a skill readiness prediction model.
● Dashboard: Display skill profiles, gaps, and readiness scores.
● Recommendations: Generate certification and training recommendations.', '["Analyze existing skill profiles of students.", "Compare student skills with industry job requirements.", "Predict skill readiness levels for target job roles.", "Identify missing skills and priority learning areas.", "Present skill insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Skill Mapping → ML Prediction → Gap Analysis → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Skill distribution insights"}, {"component": "ML Model", "output": "Skill readiness prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Skill gap dashboard"}, {"component": "Recommendation", "output": "Certification suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS07', 'Online Learning Engagement & E-Content Analytics System', 'Smart Education & Student Analytics', 'Online learning platforms record video views, quiz attempts, assignment submissions, and login activity.
Develop a Big Data Analytics and Machine Learning solution to analyze learner engagement and predict
course completion.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify engagement patterns across content, time, and learner groups.
● Machine Learning: Build and evaluate a course completion prediction model.
● Dashboard: Display engagement levels, content usage, and predictions.
● Recommendations: Generate content improvement and learner re-engagement suggestions.', '["Analyze login, video and assignment activity patterns.", "Identify highly engaged and disengaged learners.", "Predict course completion probability.", "Identify content that learners frequently abandon.", "Present engagement insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Engagement Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Engagement insights"}, {"component": "ML Model", "output": "Completion prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Engagement dashboard"}, {"component": "Recommendation", "output": "Content improvement suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS08', 'Faculty Feedback & Teaching Quality Analytics System', 'Smart Education & Student Analytics', 'Institutions collect large volumes of student feedback each semester. Develop a Big Data Analytics and
Machine Learning solution to analyze feedback data and assess teaching quality objectively.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify feedback patterns across faculty, subjects, and departments.
● Machine Learning: Build and evaluate a teaching quality rating prediction model.
● Dashboard: Display feedback trends, ratings, and comparisons.
● Recommendations: Generate faculty development and training suggestions.', '["Analyze feedback scores across parameters and subjects.", "Identify strengths and improvement areas in teaching.", "Predict overall teaching quality ratings.", "Correlate feedback with student performance outcomes.", "Present feedback insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Feedback Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Feedback trend insights"}, {"component": "ML Model", "output": "Teaching quality prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Feedback dashboard"}, {"component": "Recommendation", "output": "Faculty improvement suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS09', 'Library & Learning Resource Usage Analytics System', 'Smart Education & Student Analytics', 'Library systems store issue-return records, digital resource access logs, and user details. Develop a Big Data
Analytics and Machine Learning solution to analyze resource usage and predict future demand.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify usage trends across resources, departments, and time periods.
● Machine Learning: Build and evaluate a resource demand prediction model.
● Dashboard: Display usage statistics, demand trends, and predictions.
● Recommendations: Generate procurement and resource allocation suggestions.', '["Analyze book and e-resource usage patterns.", "Identify most demanded and least used resources.", "Predict future demand for books and resources.", "Identify reading patterns of different student groups.", "Present usage insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Usage Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Resource usage insights"}, {"component": "ML Model", "output": "Demand prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Library usage dashboard"}, {"component": "Recommendation", "output": "Procurement suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS10', 'Admission Trend Analysis & Enrollment Prediction System', 'Smart Education & Student Analytics', 'Admission data covering applications, cut-off marks, regions, categories, and branch preferences grows every
year. Develop a Big Data Analytics and Machine Learning solution to analyze admission trends and
predict enrollment.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify admission and preference patterns across years and regions.
● Machine Learning: Build and evaluate an enrollment prediction model.
● Dashboard: Display admission trends, forecasts, and branch comparisons.
● Recommendations: Generate admission planning and outreach suggestions.', '["Analyze branch-wise and region-wise admission trends.", "Identify factors influencing student branch preference.", "Predict expected enrollment numbers for upcoming years.", "Identify branches at risk of under-enrollment.", "Present admission insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Admission Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Admission trend insights"}, {"component": "ML Model", "output": "Enrollment prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Admission dashboard"}, {"component": "Recommendation", "output": "Planning suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS11', 'Diabetes Risk Prediction & Patient Analytics System', 'Healthcare & Wellness Analytics', 'Health check-up records contain glucose levels, BMI, blood pressure, age, and lifestyle details. Develop a Big
Data Analytics and Machine Learning solution to analyze patient data and predict diabetes risk.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between clinical parameters and diabetes risk.
● Machine Learning: Build and evaluate a diabetes risk prediction model.
● Dashboard: Display risk levels, patient groups, and key indicators.
● Recommendations: Generate lifestyle and preventive care suggestions.', '["Analyze clinical and lifestyle parameters of patients.", "Identify key factors contributing to diabetes risk.", "Predict diabetes risk levels for individuals.", "Segment patients into low, moderate, and high risk groups.", "Present health insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Health Analytics → ML Prediction → Risk Grouping → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Health risk insights"}, {"component": "ML Model", "output": "Diabetes risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Patient risk dashboard"}, {"component": "Recommendation", "output": "Preventive care suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS12', 'Heart Disease Prediction & Cardiac Risk Analytics System', 'Healthcare & Wellness Analytics', 'Cardiac screening generates data on cholesterol, blood pressure, ECG results, chest pain type, and patient
history. Develop a Big Data Analytics and Machine Learning solution to assess cardiac risk.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify patterns among cardiac indicators and patient outcomes.
● Machine Learning: Build and evaluate a heart disease prediction model.
● Dashboard: Display risk scores, indicator importance, and patient groups.
● Recommendations: Generate screening and follow-up suggestions.', '["Analyze cardiac test parameters and patient history.", "Identify the most influential risk indicators.", "Predict heart disease risk for each patient.", "Compare risk across age and gender groups.", "Present cardiac insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Clinical Analytics → ML Prediction → Risk Scoring → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Cardiac risk insights"}, {"component": "ML Model", "output": "Heart disease prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Cardiac risk dashboard"}, {"component": "Recommendation", "output": "Follow-up care suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS13', 'Hospital Readmission Prediction & Patient Monitoring System', 'Healthcare & Wellness Analytics', 'Hospitals maintain admission, diagnosis, treatment, and discharge records for every patient. Develop a Big
Data Analytics and Machine Learning solution to predict the likelihood of patient readmission.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify readmission patterns across diagnoses, age groups, and stay duration.
● Machine Learning: Build and evaluate a patient readmission prediction model.
● Dashboard: Display readmission risk, patient lists, and trends.
● Recommendations: Generate post-discharge care and follow-up suggestions.', '["Analyze admission, treatment and discharge patterns.", "Identify conditions associated with frequent readmission.", "Predict readmission probability for discharged patients.", "Highlight patients requiring close follow-up.", "Present monitoring insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Patient Analytics → ML Prediction → Alert → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Readmission pattern insights"}, {"component": "ML Model", "output": "Readmission prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Patient monitoring dashboard"}, {"component": "Recommendation", "output": "Follow-up care suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS14', 'Smart Health Check-up Report Analytics System', 'Healthcare & Wellness Analytics', 'Diagnostic laboratories generate large volumes of test reports covering blood counts, lipid profiles, and organ
function tests. Develop a Big Data Analytics and Machine Learning solution to analyze reports and flag
abnormalities.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify abnormal value patterns and correlations between tests.
● Machine Learning: Build and evaluate a health risk category prediction model.
● Dashboard: Display test summaries, abnormal flags, and trends.
● Recommendations: Generate further testing and consultation suggestions.', '["Analyze laboratory test values across patients.", "Identify abnormal and borderline test results.", "Predict general health risk categories.", "Track changes in patient reports over time.", "Present report insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Report Analytics → ML Prediction → Abnormality Detection → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Test result insights"}, {"component": "ML Model", "output": "Health risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Health report dashboard"}, {"component": "Recommendation", "output": "Consultation suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS15', 'Fitness & Lifestyle Wellness Analytics System', 'Healthcare & Wellness Analytics', 'Fitness trackers and wellness applications record steps, heart rate, sleep duration, calories, and activity
levels. Develop a Big Data Analytics and Machine Learning solution to analyze lifestyle data and assess
wellness.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify lifestyle patterns and their relationship with wellness levels.
● Machine Learning: Build and evaluate a wellness score prediction model.
● Dashboard: Display activity trends, sleep quality, and wellness scores.
● Recommendations: Generate personalised fitness and lifestyle suggestions.', '["Analyze activity, sleep and calorie patterns.", "Identify unhealthy lifestyle trends.", "Predict wellness/fitness score levels.", "Segment users based on activity behaviour.", "Present wellness insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Lifestyle Analytics → ML Prediction → Scoring → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Lifestyle insights"}, {"component": "ML Model", "output": "Wellness score prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Wellness dashboard"}, {"component": "Recommendation", "output": "Fitness suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS16', 'Disease Outbreak Trend Analysis & Case Prediction System', 'Healthcare & Wellness Analytics', 'Public health departments record daily case counts, locations, seasons, and population details. Develop a Big
Data Analytics and Machine Learning solution to analyze outbreak trends and forecast cases.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify spread patterns across regions, seasons, and demographics.
● Machine Learning: Build and evaluate a case count forecasting model.
● Dashboard: Display case trends, hotspot regions, and forecasts.
● Recommendations: Generate resource deployment and awareness suggestions.', '["Analyze region-wise and season-wise case trends.", "Identify areas with rapidly rising case counts.", "Predict expected case numbers for coming weeks.", "Compare outbreak severity across regions.", "Present outbreak insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Trend Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Outbreak trend insights"}, {"component": "ML Model", "output": "Case count forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Outbreak dashboard"}, {"component": "Recommendation", "output": "Preparedness suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS17', 'Hospital Resource & Bed Occupancy Prediction System', 'Healthcare & Wellness Analytics', 'Hospitals record daily admissions, discharges, ward occupancy, and staff allocation. Develop a Big Data
Analytics and Machine Learning solution to analyze resource usage and predict bed occupancy.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify occupancy and admission trends across wards and time periods.
● Machine Learning: Build and evaluate a bed occupancy prediction model.
● Dashboard: Display occupancy levels, peak periods, and forecasts.
● Recommendations: Generate resource and staff allocation suggestions.', '["Analyze ward-wise occupancy and admission patterns.", "Identify peak demand periods and bottlenecks.", "Predict future bed occupancy levels.", "Estimate staff and equipment requirements.", "Present resource insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Resource Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Occupancy insights"}, {"component": "ML Model", "output": "Bed occupancy prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Resource dashboard"}, {"component": "Recommendation", "output": "Allocation suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS18', 'Medicine Demand Forecasting & Pharmacy Inventory Analytics System', 'Healthcare & Wellness Analytics', 'Hospital pharmacies generate continuous data on medicine issues, stock levels, expiry dates, and purchase
orders. Develop a Big Data Analytics and Machine Learning solution to forecast medicine demand.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify consumption trends and seasonal demand patterns.
● Machine Learning: Build and evaluate a medicine demand forecasting model.
● Dashboard: Display stock levels, consumption trends, and forecasts.
● Recommendations: Generate procurement and reorder suggestions.', '["Analyze medicine consumption and stock movement patterns.", "Identify fast moving and slow moving medicines.", "Predict future medicine demand.", "Detect stock-out and expiry risks.", "Present inventory insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Inventory Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Consumption insights"}, {"component": "ML Model", "output": "Medicine demand forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Inventory dashboard"}, {"component": "Recommendation", "output": "Reorder suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS19', 'Maternal & Child Health Risk Analytics System', 'Healthcare & Wellness Analytics', 'Primary health centres maintain records of maternal check-ups, nutrition levels, immunisation, and child
growth measurements. Develop a Big Data Analytics and Machine Learning solution to identify health
risks.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify risk patterns across nutrition, age, and check-up history.
● Machine Learning: Build and evaluate a maternal and child health risk prediction model.
● Dashboard: Display risk categories, coverage gaps, and growth trends.
● Recommendations: Generate nutrition and immunisation follow-up suggestions.', '["Analyze maternal and child health indicators.", "Identify malnutrition and immunisation gaps.", "Predict health risk levels for mothers and children.", "Highlight cases requiring urgent attention.", "Present health insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Health Analytics → ML Prediction → Risk Grouping → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Health indicator insights"}, {"component": "ML Model", "output": "Health risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Maternal-child health dashboard"}, {"component": "Recommendation", "output": "Follow-up suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS20', 'Mental Health & Stress Level Prediction System', 'Healthcare & Wellness Analytics', 'Wellness surveys collect data on sleep, workload, screen time, physical activity, and self-reported mood.
Develop a Big Data Analytics and Machine Learning solution to analyze stress indicators and predict
stress levels.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between lifestyle factors and stress levels.
● Machine Learning: Build and evaluate a stress level prediction model.
● Dashboard: Display stress distribution, key factors, and group comparisons.
● Recommendations: Generate wellness and counselling suggestions.', '["Analyze lifestyle, workload and mood indicators.", "Identify major contributors to stress.", "Predict stress level categories for individuals.", "Segment respondents into wellness groups.", "Present wellness insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Wellness Analytics → ML Prediction → Grouping → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Stress factor insights"}, {"component": "ML Model", "output": "Stress level prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Wellness dashboard"}, {"component": "Recommendation", "output": "Counselling suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS21', 'Crop Yield Prediction & Farm Analytics System', 'Smart Agriculture & Environment', 'Agricultural records contain data on crop type, area, soil, rainfall, fertilizer usage, and historical yield. Develop
a Big Data Analytics and Machine Learning solution to analyze farm data and predict crop yield.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between soil, weather, and yield outcomes.
● Machine Learning: Build and evaluate a crop yield prediction model.
● Dashboard: Display yield trends, regional comparisons, and predictions.
● Recommendations: Generate crop planning and input usage suggestions.', '["Analyze crop, soil and weather parameters.", "Identify key factors influencing crop yield.", "Predict expected yield per hectare.", "Compare yield across crops, seasons, and regions.", "Present farm insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Farm Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Yield pattern insights"}, {"component": "ML Model", "output": "Crop yield prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Farm analytics dashboard"}, {"component": "Recommendation", "output": "Crop planning suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS22', 'Soil Health Analysis & Fertilizer Recommendation System', 'Smart Agriculture & Environment', 'Soil testing laboratories generate large volumes of data on nitrogen, phosphorus, potassium, pH, and organic
carbon. Develop a Big Data Analytics and Machine Learning solution to assess soil health and
recommend fertilizers.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify nutrient distribution and deficiency patterns across regions.
● Machine Learning: Build and evaluate a soil fertility classification model.
● Dashboard: Display nutrient levels, fertility categories, and maps.
● Recommendations: Generate fertilizer dosage and soil improvement suggestions.', '["Analyze soil nutrient levels across regions.", "Identify nutrient deficiencies and imbalances.", "Predict soil fertility categories.", "Match soil conditions with suitable fertilizer requirements.", "Present soil insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Soil Analytics → ML Prediction → Matching → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Soil nutrient insights"}, {"component": "ML Model", "output": "Soil fertility prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Soil health dashboard"}, {"component": "Recommendation", "output": "Fertilizer suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS23', 'Smart Crop Recommendation System Based on Soil & Weather', 'Smart Agriculture & Environment', 'Selecting the right crop depends on soil nutrients, rainfall, temperature, and humidity. Develop a Big Data
Analytics and Machine Learning solution to recommend the most suitable crop for given field conditions.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify how soil and climate conditions relate to crop suitability.
● Machine Learning: Build and evaluate a crop recommendation classification model.
● Dashboard: Display input conditions, suitability scores, and crop options.
● Recommendations: Generate crop selection and sowing suggestions.', '["Analyze soil and climatic parameters of a region.", "Identify conditions favourable for different crops.", "Predict the most suitable crop for given inputs.", "Rank alternative crop options for the same field.", "Present recommendations through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Condition Analytics → ML Prediction → Ranking → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Suitability insights"}, {"component": "ML Model", "output": "Crop recommendation prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Crop advisory dashboard"}, {"component": "Recommendation", "output": "Crop selection suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS24', 'Rainfall Prediction & Irrigation Planning Analytics System', 'Smart Agriculture & Environment', 'Weather stations record daily temperature, humidity, wind speed, pressure, and rainfall over many years.
Develop a Big Data Analytics and Machine Learning solution to analyze weather data and support
irrigation planning.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify rainfall trends and relationships among weather parameters.
● Machine Learning: Build and evaluate a rainfall prediction model.
● Dashboard: Display rainfall trends, forecasts, and irrigation needs.
● Recommendations: Generate irrigation scheduling suggestions.', '["Analyze historical rainfall and weather patterns.", "Identify seasonal and regional rainfall trends.", "Predict expected rainfall levels.", "Estimate irrigation requirements for crops.", "Present weather insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Weather Analytics → ML Prediction → Planning → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Rainfall trend insights"}, {"component": "ML Model", "output": "Rainfall prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Weather & irrigation dashboard"}, {"component": "Recommendation", "output": "Irrigation schedule suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS25', 'Crop Price Trend Analysis & Market Prediction System', 'Smart Agriculture & Environment', 'Agricultural markets publish daily arrival quantities and price data for various commodities. Develop a Big
Data Analytics and Machine Learning solution to analyze price behaviour and predict future crop prices.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify price movement patterns across seasons, markets, and commodities.
● Machine Learning: Build and evaluate a crop price forecasting model.
● Dashboard: Display price trends, market comparisons, and forecasts.
● Recommendations: Generate selling time and market selection suggestions.', '["Analyze commodity-wise and market-wise price trends.", "Identify seasonal price fluctuations.", "Predict future crop prices.", "Compare prices across markets and regions.", "Present market insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Market Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Price trend insights"}, {"component": "ML Model", "output": "Crop price forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Market price dashboard"}, {"component": "Recommendation", "output": "Selling strategy suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS26', 'Air Quality Index Analytics & Pollution Level Prediction System', 'Smart Agriculture & Environment', 'Air monitoring stations continuously record PM2.5, PM10, NO2, SO2, CO, and weather parameters. Develop
a Big Data Analytics and Machine Learning solution to analyze air quality and predict pollution levels.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify pollutant patterns across time, location, and weather conditions.
● Machine Learning: Build and evaluate an AQI level prediction model.
● Dashboard: Display pollutant levels, AQI categories, and trends.
● Recommendations: Generate pollution control and public advisory suggestions.', '["Analyze pollutant concentration trends across locations.", "Identify major pollution sources and peak hours.", "Predict Air Quality Index (AQI) categories.", "Compare air quality across seasons and areas.", "Present pollution insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Air Quality Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Pollution trend insights"}, {"component": "ML Model", "output": "AQI level prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Air quality dashboard"}, {"component": "Recommendation", "output": "Advisory suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS27', 'Water Quality Monitoring & Contamination Prediction System', 'Smart Agriculture & Environment', 'Water testing agencies collect data on pH, turbidity, dissolved oxygen, hardness, and bacterial counts.
Develop a Big Data Analytics and Machine Learning solution to assess water quality and predict
contamination.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify contamination patterns across sources, regions, and seasons.
● Machine Learning: Build and evaluate a water potability classification model.
● Dashboard: Display parameter levels, unsafe sources, and quality maps.
● Recommendations: Generate treatment and monitoring suggestions.', '["Analyze water quality parameters across sources.", "Identify contaminated and unsafe water sources.", "Predict water potability/quality categories.", "Track quality changes over seasons.", "Present water quality insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Quality Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Water quality insights"}, {"component": "ML Model", "output": "Potability prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Water quality dashboard"}, {"component": "Recommendation", "output": "Treatment suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS28', 'Plant Disease Risk Prediction & Crop Advisory System', 'Smart Agriculture & Environment', 'Field records capture crop stage, temperature, humidity, leaf wetness, pesticide usage, and observed
infections. Develop a Big Data Analytics and Machine Learning solution to predict plant disease risk.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between weather conditions and disease incidence.
● Machine Learning: Build and evaluate a plant disease risk prediction model.
● Dashboard: Display risk levels, affected fields, and condition trends.
● Recommendations: Generate preventive spraying and crop care suggestions.', '["Analyze environmental and crop condition data.", "Identify conditions that favour disease outbreaks.", "Predict disease occurrence risk levels.", "Highlight fields requiring immediate attention.", "Present advisory insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Field Analytics → ML Prediction → Risk Alert → Advisory', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Disease pattern insights"}, {"component": "ML Model", "output": "Disease risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Crop advisory dashboard"}, {"component": "Recommendation", "output": "Preventive care suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS29', 'Livestock & Dairy Production Analytics System', 'Smart Agriculture & Environment', 'Dairy farms record animal age, breed, feed intake, health status, and daily milk yield. Develop a Big Data
Analytics and Machine Learning solution to analyze livestock data and predict milk production.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between feed, health, and production levels.
● Machine Learning: Build and evaluate a milk yield prediction model.
● Dashboard: Display yield trends, animal performance, and forecasts.
● Recommendations: Generate feeding and herd management suggestions.', '["Analyze feed, breed and health parameters.", "Identify factors affecting milk yield.", "Predict expected daily/monthly milk production.", "Detect animals with declining productivity.", "Present livestock insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Livestock Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Production insights"}, {"component": "ML Model", "output": "Milk yield prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Livestock dashboard"}, {"component": "Recommendation", "output": "Herd management suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS30', 'Smart Waste Management & Recycling Analytics System', 'Smart Agriculture & Environment', 'Municipal bodies record waste collection quantity, waste type, ward, vehicle trips, and recycling volumes.
Develop a Big Data Analytics and Machine Learning solution to analyze waste data and forecast
generation.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify waste generation trends across wards, seasons, and waste types.
● Machine Learning: Build and evaluate a waste generation forecasting model.
● Dashboard: Display waste volumes, zone comparisons, and forecasts.
● Recommendations: Generate collection scheduling and recycling suggestions.', '["Analyze ward-wise waste generation patterns.", "Identify high waste generating zones and waste types.", "Predict future waste generation volumes.", "Estimate recyclable waste potential.", "Present waste insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Waste Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Waste generation insights"}, {"component": "ML Model", "output": "Waste volume forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Waste management dashboard"}, {"component": "Recommendation", "output": "Collection & recycling suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS31', 'Smart Retail Sales Forecasting & Customer Analytics System', 'Smart Business & Finance', 'Retail businesses generate large volumes of data from sales transactions, customers, products, prices, and
inventory. Develop a Big Data Analytics and Machine Learning solution to analyze retail data and support
better sales and inventory decisions.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify sales, product, and customer purchasing patterns.
● Machine Learning: Build and evaluate a sales/demand prediction model.
● Dashboard: Display sales trends, customer segments, and predictions.
● Recommendations: Generate inventory and product recommendations.', '["Analyze sales and customer purchasing patterns.", "Identify top-performing and low-performing products.", "Predict future product sales/demand using ML.", "Identify customer segments based on purchasing behaviour.", "Detect unusual sales patterns or transactions.", "Generate data-driven business recommendations."]'::jsonb, 'Raw Data → Preprocessing → Big Data Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Sales & customer insights"}, {"component": "ML Model", "output": "Sales/demand prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Sales & trend dashboard"}, {"component": "Recommendation", "output": "Inventory/product suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS32', 'Credit Card Fraud Detection & Transaction Analytics System', 'Smart Business & Finance', 'Banks process millions of card transactions containing amount, time, location, merchant, and device details.
Develop a Big Data Analytics and Machine Learning solution to analyze transactions and detect fraud.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify normal and abnormal transaction behaviour patterns.
● Machine Learning: Build and evaluate a fraud detection classification model.
● Dashboard: Display transaction trends, flagged cases, and risk scores.
● Recommendations: Generate fraud prevention and verification suggestions.', '["Analyze transaction patterns across customers and merchants.", "Identify unusual spending behaviour.", "Predict fraudulent vs genuine transactions.", "Highlight high-risk transactions for review.", "Present fraud insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Transaction Analytics → ML Detection → Alert → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Transaction pattern insights"}, {"component": "ML Model", "output": "Fraud detection prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Fraud monitoring dashboard"}, {"component": "Recommendation", "output": "Prevention suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS33', 'Customer Churn Prediction & Retention Analytics System', 'Smart Business & Finance', 'Service companies maintain customer subscription, usage, billing, and complaint records. Develop a Big Data
Analytics and Machine Learning solution to analyze customer behaviour and predict churn.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify behavioural patterns that distinguish loyal and churning customers.
● Machine Learning: Build and evaluate a customer churn prediction model.
● Dashboard: Display churn risk, customer segments, and key drivers.
● Recommendations: Generate retention offers and engagement suggestions.', '["Analyze usage, billing and complaint patterns.", "Identify key reasons behind customer churn.", "Predict customers likely to leave.", "Segment customers based on loyalty and value.", "Present retention insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Customer Analytics → ML Prediction → Segmentation → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Churn driver insights"}, {"component": "ML Model", "output": "Churn prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Retention dashboard"}, {"component": "Recommendation", "output": "Retention strategy suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS34', 'Loan Approval Prediction & Credit Risk Analytics System', 'Smart Business & Finance', 'Financial institutions collect applicant income, employment, credit history, loan amount, and repayment data.
Develop a Big Data Analytics and Machine Learning solution to assess credit risk and predict loan
approval.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify relationships between applicant attributes and repayment behaviour.
● Machine Learning: Build and evaluate a loan approval / default risk prediction model.
● Dashboard: Display risk scores, approval rates, and applicant profiles.
● Recommendations: Generate lending policy and risk mitigation suggestions.', '["Analyze applicant financial and credit profiles.", "Identify factors influencing loan default.", "Predict loan approval/default risk.", "Segment applicants into risk categories.", "Present credit insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Credit Analytics → ML Prediction → Risk Scoring → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Credit risk insights"}, {"component": "ML Model", "output": "Loan approval prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Credit risk dashboard"}, {"component": "Recommendation", "output": "Lending suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS35', 'E-Commerce Product Recommendation & Review Analytics System', 'Smart Business & Finance', 'E-commerce platforms store browsing history, purchase records, ratings, and product reviews. Develop a Big
Data Analytics and Machine Learning solution to analyze customer behaviour and recommend products.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify buying patterns, product associations, and rating trends.
● Machine Learning: Build and evaluate a product recommendation model.
● Dashboard: Display top products, customer preferences, and suggestions.
● Recommendations: Generate personalised product recommendations.', '["Analyze purchase and browsing behaviour.", "Identify frequently bought product combinations.", "Predict products a customer is likely to buy.", "Analyze rating and review trends for products.", "Present recommendation insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Behaviour Analytics → ML Recommendation → Visualization → Suggestion', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Buying pattern insights"}, {"component": "ML Model", "output": "Product recommendation prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Recommendation dashboard"}, {"component": "Recommendation", "output": "Personalised product suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS36', 'Inventory Demand Forecasting & Supply Chain Analytics System', 'Smart Business & Finance', 'Warehouses and distributors record stock levels, dispatches, lead times, and supplier performance. Develop a
Big Data Analytics and Machine Learning solution to analyze supply chain data and forecast demand.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify demand and supply patterns across products and suppliers.
● Machine Learning: Build and evaluate an inventory demand forecasting model.
● Dashboard: Display stock levels, demand forecasts, and supplier performance.
● Recommendations: Generate reorder and procurement suggestions.', '["Analyze stock movement and supplier performance.", "Identify overstock and stock-out situations.", "Predict future inventory demand.", "Estimate optimal reorder levels.", "Present supply chain insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Supply Chain Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Supply chain insights"}, {"component": "ML Model", "output": "Demand forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Inventory dashboard"}, {"component": "Recommendation", "output": "Reorder suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS37', 'Stock Market Trend Analysis & Price Movement Prediction System', 'Smart Business & Finance', 'Stock exchanges publish daily open, high, low, close, and volume data for listed companies. Develop a Big
Data Analytics and Machine Learning solution to analyze market data and predict price movement.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify trend, volatility, and correlation patterns in market data.
● Machine Learning: Build and evaluate a price movement prediction model.
● Dashboard: Display price trends, indicators, and predictions.
● Recommendations: Generate portfolio observation and risk-awareness suggestions.', '["Analyze historical price and volume trends.", "Identify volatility and momentum patterns.", "Predict short-term price movement direction.", "Compare performance across sectors and stocks.", "Present market insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Market Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Market trend insights"}, {"component": "ML Model", "output": "Price movement prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Market analytics dashboard"}, {"component": "Recommendation", "output": "Risk-aware suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS38', 'Customer Segmentation & Targeted Marketing Analytics System', 'Smart Business & Finance', 'Businesses collect customer demographics, spending scores, purchase frequency, and campaign responses.
Develop a Big Data Analytics and Machine Learning solution to segment customers and support targeted
marketing.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify behavioural and demographic patterns among customers.
● Machine Learning: Build and evaluate a customer segmentation and response prediction model.
● Dashboard: Display segments, profiles, and response predictions.
● Recommendations: Generate targeted campaign and offer suggestions.', '["Analyze demographic and spending behaviour data.", "Identify distinct customer groups.", "Predict campaign response likelihood.", "Profile each segment with key characteristics.", "Present segmentation insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Customer Analytics → ML Clustering/Prediction → Profiling → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Customer behaviour insights"}, {"component": "ML Model", "output": "Segment & response prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Segmentation dashboard"}, {"component": "Recommendation", "output": "Marketing campaign suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS39', 'Insurance Claim Analytics & Fraudulent Claim Detection System', 'Smart Business & Finance', 'Insurance companies process claims containing policy details, claim amount, incident type, and settlement
history. Develop a Big Data Analytics and Machine Learning solution to analyze claims and detect
suspicious cases.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify genuine and suspicious claim patterns.
● Machine Learning: Build and evaluate a fraudulent claim detection model.
● Dashboard: Display claim trends, flagged claims, and risk levels.
● Recommendations: Generate claim verification and policy suggestions.', '["Analyze claim patterns across policies and regions.", "Identify unusual or repeated claim behaviour.", "Predict fraudulent claim probability.", "Estimate expected claim settlement amounts.", "Present claim insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Claim Analytics → ML Detection → Alert → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Claim pattern insights"}, {"component": "ML Model", "output": "Fraud claim prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Claim monitoring dashboard"}, {"component": "Recommendation", "output": "Verification suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS40', 'Employee Attrition Prediction & HR Analytics System', 'Smart Business & Finance', 'Organisations maintain employee data on salary, experience, performance ratings, promotions, and
satisfaction scores. Develop a Big Data Analytics and Machine Learning solution to analyze workforce
data and predict attrition.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify workforce patterns associated with attrition.
● Machine Learning: Build and evaluate an employee attrition prediction model.
● Dashboard: Display attrition risk, department comparisons, and key factors.
● Recommendations: Generate retention and engagement suggestions.', '["Analyze salary, performance and satisfaction data.", "Identify major reasons for employee attrition.", "Predict employees likely to resign.", "Compare attrition across departments and roles.", "Present HR insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → HR Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Workforce insights"}, {"component": "ML Model", "output": "Attrition prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "HR analytics dashboard"}, {"component": "Recommendation", "output": "Retention suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS41', 'Traffic Congestion Analysis & Travel Time Prediction System', 'Smart City & Transportation', 'City traffic systems record vehicle counts, signal timings, road segments, weather, and travel speed. Develop
a Big Data Analytics and Machine Learning solution to analyze congestion and predict travel time.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify congestion patterns across roads, time slots, and conditions.
● Machine Learning: Build and evaluate a travel time / congestion prediction model.
● Dashboard: Display traffic density, peak hours, and predictions.
● Recommendations: Generate route planning and signal timing suggestions.', '["Analyze road-wise and hour-wise traffic patterns.", "Identify congestion-prone roads and peak hours.", "Predict expected travel time/congestion levels.", "Compare traffic conditions across zones.", "Present traffic insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Traffic Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Traffic pattern insights"}, {"component": "ML Model", "output": "Travel time prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Traffic dashboard"}, {"component": "Recommendation", "output": "Route & signal suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS42', 'Road Accident Analytics & Hotspot Prediction System', 'Smart City & Transportation', 'Traffic police maintain accident records with location, time, weather, vehicle type, and severity. Develop a Big
Data Analytics and Machine Learning solution to analyze accident data and identify risk hotspots.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify accident patterns across locations, time, and weather conditions.
● Machine Learning: Build and evaluate an accident severity/risk prediction model.
● Dashboard: Display hotspots, severity levels, and trends.
● Recommendations: Generate road safety and enforcement suggestions.', '["Analyze location-wise and time-wise accident patterns.", "Identify major causes and contributing conditions.", "Predict accident severity/risk levels.", "Highlight accident-prone zones on a map.", "Present safety insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Accident Analytics → ML Prediction → Hotspot Mapping → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Accident pattern insights"}, {"component": "ML Model", "output": "Severity/risk prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Accident hotspot dashboard"}, {"component": "Recommendation", "output": "Road safety suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS43', 'Public Transport Demand Forecasting & Route Optimization System', 'Smart City & Transportation', 'Transport corporations record ticket sales, route details, trip timings, and passenger counts. Develop a Big
Data Analytics and Machine Learning solution to analyze ridership and forecast passenger demand.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify ridership trends across routes, days, and time slots.
● Machine Learning: Build and evaluate a passenger demand forecasting model.
● Dashboard: Display ridership levels, route performance, and forecasts.
● Recommendations: Generate scheduling and route optimisation suggestions.', '["Analyze route-wise and time-wise ridership patterns.", "Identify overcrowded and underutilised routes.", "Predict future passenger demand.", "Estimate optimal trip frequency for routes.", "Present transport insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Ridership Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Ridership insights"}, {"component": "ML Model", "output": "Passenger demand forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Transport dashboard"}, {"component": "Recommendation", "output": "Route & schedule suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS44', 'Smart Parking Availability Prediction & Analytics System', 'Smart City & Transportation', 'Smart parking facilities record entry-exit timings, slot occupancy, vehicle type, and payment data. Develop a
Big Data Analytics and Machine Learning solution to analyze parking usage and predict availability.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify occupancy patterns across locations, hours, and vehicle types.
● Machine Learning: Build and evaluate a parking availability prediction model.
● Dashboard: Display occupancy rates, peak hours, and availability forecasts.
● Recommendations: Generate parking allocation and pricing suggestions.', '["Analyze slot occupancy and duration patterns.", "Identify peak parking hours and locations.", "Predict parking slot availability.", "Estimate revenue and utilisation levels.", "Present parking insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Parking Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Parking usage insights"}, {"component": "ML Model", "output": "Availability prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Parking dashboard"}, {"component": "Recommendation", "output": "Allocation suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS45', 'Electricity Consumption Analytics & Demand Prediction System', 'Smart City & Transportation', 'Electricity boards maintain consumption data by household, area, tariff category, season, and time of day.
Develop a Big Data Analytics and Machine Learning solution to analyze usage and forecast electricity
demand.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify consumption trends across areas, seasons, and consumer categories.
● Machine Learning: Build and evaluate an electricity demand forecasting model.
● Dashboard: Display consumption trends, peak loads, and forecasts.
● Recommendations: Generate load management and energy saving suggestions.', '["Analyze area-wise and category-wise consumption patterns.", "Identify peak load periods and high consumption zones.", "Predict future electricity demand.", "Detect abnormal consumption behaviour.", "Present energy insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Energy Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Consumption insights"}, {"component": "ML Model", "output": "Demand forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Energy dashboard"}, {"component": "Recommendation", "output": "Load management suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS46', 'Municipal Waste Collection Analytics & Route Planning System', 'Smart City & Transportation', 'City corporations track bin fill levels, collection vehicle trips, fuel usage, and ward-wise waste volumes.
Develop a Big Data Analytics and Machine Learning solution to analyze collection operations and plan
routes.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify collection efficiency and overflow patterns across wards.
● Machine Learning: Build and evaluate a bin fill level prediction model.
● Dashboard: Display fill levels, trip efficiency, and zone comparisons.
● Recommendations: Generate collection route and frequency suggestions.', '["Analyze bin fill and collection trip patterns.", "Identify wards with frequent overflow issues.", "Predict bin fill levels and collection demand.", "Estimate optimal collection frequency per zone.", "Present operational insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Collection Analytics → ML Prediction → Route Planning → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Collection efficiency insights"}, {"component": "ML Model", "output": "Fill level prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Collection dashboard"}, {"component": "Recommendation", "output": "Route planning suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS47', 'Water Supply Distribution & Leakage Detection Analytics System', 'Smart City & Transportation', 'Water boards record supply volumes, pressure readings, consumption, and billing data across zones.
Develop a Big Data Analytics and Machine Learning solution to analyze distribution and detect possible
leakages.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify supply-consumption mismatches and loss patterns.
● Machine Learning: Build and evaluate a leakage/anomaly detection model.
● Dashboard: Display supply vs consumption, loss zones, and forecasts.
● Recommendations: Generate maintenance and distribution suggestions.', '["Analyze zone-wise supply and consumption data.", "Identify gaps between supplied and billed water.", "Predict leakage/abnormal loss zones.", "Forecast future water demand for each zone.", "Present distribution insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Distribution Analytics → ML Detection → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Distribution insights"}, {"component": "ML Model", "output": "Leakage detection prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Water supply dashboard"}, {"component": "Recommendation", "output": "Maintenance suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS48', 'Smart Street Lighting & Energy Usage Analytics System', 'Smart City & Transportation', 'Smart street lighting systems record lamp status, operating hours, energy consumption, and fault reports.
Develop a Big Data Analytics and Machine Learning solution to analyze lighting operations and predict
faults.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify consumption and fault patterns across zones and lamp types.
● Machine Learning: Build and evaluate a lamp fault prediction model.
● Dashboard: Display energy usage, fault alerts, and zone comparisons.
● Recommendations: Generate maintenance and energy saving suggestions.', '["Analyze energy consumption and operating hour patterns.", "Identify zones with high energy wastage.", "Predict lamp failure/fault occurrence.", "Estimate potential energy savings.", "Present lighting insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Energy Analytics → ML Prediction → Alert → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Energy usage insights"}, {"component": "ML Model", "output": "Fault prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Street lighting dashboard"}, {"component": "Recommendation", "output": "Maintenance suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS49', 'Citizen Grievance Analytics & Resolution Time Prediction System', 'Smart City & Transportation', 'Municipal grievance portals collect complaints with category, ward, priority, assigned department, and
resolution time. Develop a Big Data Analytics and Machine Learning solution to analyze complaints and
predict resolution time.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify complaint trends across categories, wards, and departments.
● Machine Learning: Build and evaluate a resolution time prediction model.
● Dashboard: Display complaint volumes, pending cases, and predicted timelines.
● Recommendations: Generate workload allocation and service improvement suggestions.', '["Analyze category-wise and ward-wise complaint patterns.", "Identify departments with pending and delayed cases.", "Predict expected resolution time for new complaints.", "Highlight recurring civic issues.", "Present grievance insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Grievance Analytics → ML Prediction → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Grievance trend insights"}, {"component": "ML Model", "output": "Resolution time prediction"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "Grievance dashboard"}, {"component": "Recommendation", "output": "Service improvement suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;
INSERT INTO public.problems (id, title, domain, description, requirements, pipeline, expected_outcomes)
VALUES ('PS50', 'EV Charging Station Demand Analytics & Planning System', 'Smart City & Transportation', 'Electric vehicle charging networks record session duration, energy delivered, station location, and time of use.
Develop a Big Data Analytics and Machine Learning solution to analyze charging demand and support
station planning.

Teams will receive a relevant dataset and develop a working prototype that includes:
● Data Preprocessing: Cleaning, transformation, and feature selection.
● Data Analytics: Identify demand patterns across stations, hours, and vehicle types.
● Machine Learning: Build and evaluate a charging demand forecasting model.
● Dashboard: Display station usage, peak hours, and demand forecasts.
● Recommendations: Generate station placement and capacity suggestions.', '["Analyze station-wise and hour-wise charging patterns.", "Identify overloaded and underused charging stations.", "Predict future charging demand.", "Estimate suitable locations for new stations.", "Present charging insights through a dashboard."]'::jsonb, 'Raw Data → Preprocessing → Charging Analytics → ML Forecasting → Visualization → Recommendation', '[{"component": "Dataset", "output": "Cleaned & processed data"}, {"component": "Analytics", "output": "Charging demand insights"}, {"component": "ML Model", "output": "Demand forecast"}, {"component": "Evaluation", "output": "Suitable ML performance metrics"}, {"component": "Dashboard", "output": "EV charging dashboard"}, {"component": "Recommendation", "output": "Station planning suggestions"}, {"component": "Source Code", "output": "Complete executable solution"}, {"component": "Presentation", "output": "Solution demonstration"}, {"component": "Dashboard", "output": "/Visualization quality & Integration and usability)"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    domain = EXCLUDED.domain,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    pipeline = EXCLUDED.pipeline,
    expected_outcomes = EXCLUDED.expected_outcomes;