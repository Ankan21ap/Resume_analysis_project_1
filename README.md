# AI Resume & Career Coach

A full-stack application designed to help job seekers optimize their resumes and plan their professional growth using Google Gemini AI.

## Features

- **Anonymous Authentication**: Seamless entry using Firebase Anonymous Auth.
- **Resume Scoring**: Instant match score for target job roles.
- **ATS Optimization**: AI-driven bullet point rewrites.
- **Skill Gap Detection**: Identification of missing keywords and technologies.
- **Career Roadmap**: 6-month actionable plan for professional development.
- **Persistent History**: View past analyses saved in Cloud Firestore.

## Tech Stack

- **Frontend**: React (v18), TypeScript, Tailwind CSS.
- **Backend/Services**: Google Gemini API (`@google/genai`), Firebase (Auth & Firestore).

## Setup Instructions

1. **Environment Variables**:

   - Ensure `API_KEY` is set in your environment with a valid Google Gemini API key.

2. **Firebase Setup**:

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
   - Enable **Anonymous Authentication** in the Auth tab.
   - Create a **Firestore Database** and set rules to allow access based on `uid`.
   - Update `firebase.ts` with your project configuration details.

3. **Development**:
   - Install dependencies: `npm install`.
   - Run locally: `npm run dev`.

## Usage

- Enter a target job title.
- Paste your resume text or upload a `.txt` file.
- Click "Analyze My Resume".
- Review the comprehensive dashboard with scores, rewrites, and your growth roadmap.
