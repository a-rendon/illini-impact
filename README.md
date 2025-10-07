**Illini Impact — Campus Clean-Up App (Demo Prototype)**

Illini Impact is a front-end prototype of a sustainability-focused campus app designed to engage students in community clean-up efforts through QR-based trash logging, team leaderboards, and impact tracking.

This project was developed as part of a class demonstration to visualize how digital tools can promote environmental action and behavioral engagement through gamification and UI-driven motivation.

**About This Project**

This repository represents a **demo version** of the application, focused on interface flow, user experience, and proof of concept.

It does not include:

Secure authentication logic
Persistent database connections
Cloud storage or user data management
Real-time backend API calls

Those elements would require protected credentials, hosted databases, and extensive privacy safeguards, which are intentionally excluded to maintain academic compliance and open-source safety.

Instead, the prototype simulates:
Team creation and joining
QR scanning interactions
Points and leaderboard updates
Static sample data for demonstration purposes

**Tech Stack**
- Vite + React for the front-end framework
- Tailwind CSS for fast, responsive styling
- PostCSS + Autoprefixer for build-time transformations

Running Locally
git clone https://github.com/<your-username>/illini-impact.git
cd illini-impact
npm install
npm run dev
Then open http://localhost:5173 in your browser.

**Purpose**

This prototype is intended for academic demonstration, illustrating UI/UX design, environmental engagement strategies, and data-driven motivation frameworks without requiring real user accounts or personal data.

For a full production implementation, the project would require:

Firebase or Supabase authentication

Firestore/Postgres for team and score storage

Secure backend validation for QR scans

Access control and GDPR-compliant data policies

🏁 Status

🚧 Prototype — Front-end only, non-persistent demo build.
