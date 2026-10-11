💻 CareerPrep Frontend — Exam Portal & AI Tutor UI
A modern, high-performance web application built with Next.js (App Router) and Tailwind CSS, designed for competitive exam preparation (including ISSB, PMA, and Initial Army Tests). It features real-time countdown exam sessions, interactive analytics dashboards, token management, and structured AI-assisted MCQ explanations.

🛠️ Tech Stack & Libraries
Framework: Next.js (React / App Router)

Styling: Tailwind CSS & Lucide Icons

State Management: Redux Toolkit (examAttemptSlice, etc.)

Markdown & Math Rendering: react-markdown for clean AI explanation rendering

API Integration: Axios / Fetch with Bearer Token Authorization

✨ Core Features
Army Test & Exam Navigation:

Category-based exam selection (/exams/army-test).

Dynamic question fetching and test session startup flows.

Timed Exam Session & Auto-Submit:

Strict 30-minute countdown timer enforcing automated submission when time expires (ExamAttemptPage).

Prevention against accidental page-refresh/resubmission manipulation.

Performance Analytics & Result View:

Comprehensive result breakdown displaying overall scores, accuracy badges, and subject-wise accuracy (Verbal vs. Non-Verbal).

Question-by-question review interface.

Token-Gated AI Tutor Integration:

"✨ Ask AI Tutor" feature integrated directly into exam reviews.

Consumes user AI tokens (10 tokens per prompt) with clean Markdown and structured layout rendering.

Admin Dashboard:

Protected UI forms allowing administrators to ingest new Army Test questions seamlessly into the backend. 

