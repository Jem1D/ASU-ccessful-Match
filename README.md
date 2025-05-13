# ASU-ccessful Match

**Live Demo:** [ASU-ccessful Match on Vercel](https://asu-ccessful-match.vercel.app/)

## Introduction

🚀 **ASU-ccessful Match** is a peer-learning platform designed to supercharge academic collaboration at Arizona State University (ASU). The platform was conceptualized and developed during the **Zoom AI on Campus Spark Challenge**, where 90 students in 22 teams spent 72 hours hacking innovative solutions. While we didn’t secure the top spot, we discovered the importance of early code testing and tight teamwork, laying the foundation for this unique project.

## The Big Idea 💡

ASU-ccessful Match leverages the **Zoom API** to automate the creation and management of virtual study sessions. The goal is to help students easily find tutors, study buddies, and learning communities. The platform also integrates with the **Zoom Poll API** to recognize student expertise. If a student scores 80% or more on a subject poll, they become eligible to host **peer tutoring sessions**, thereby sharing their knowledge with classmates.

## Key Features

1. **Personalized Matching ✨:** Quickly pair with peers or tutors by subject and expertise.
2. **Automated Scheduling ⏰:** Create Zoom sessions with one click, complete with calendar synchronization.
3. **Profile Management 📑:** Highlight strengths and academic interests for deeper engagement.
4. **Expert Eligibility 🏅:** Students scoring ≥80% on Zoom Polls can lead sessions to help others.
5. **Resource Sharing 📚:** Easily swap study materials, tips, and event info.

## Tech Stack

* **Frontend:** React.js, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js, MongoDB (via Mongoose)
* **Deployment:** Vercel (Frontend), Render (Backend)
* **API Integration:** Zoom API for session management and polling

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jem1D/ASU-ccessful-Match.git
   cd ASU-ccessful-Match
   ```

2. **Setup Backend:**

   ```bash
   cd zoom-backend
   npm install
   ```

   Create a `.env` file with the following:

   ```bash
   ZOOM_API_KEY=your_zoom_api_key
   ZOOM_API_SECRET=your_zoom_api_secret
   ```

   Start the backend server:

   ```bash
   npm start
   ```

3. **Setup Frontend:**

   ```bash
   cd zoom-frontend
   npm install
   npm start
   ```

## Contributing

Contributions are welcome! Fork the repository, create a new branch, and submit a pull request.

## Watch the Demo 🎥

Check out the project demo: [Watch Now](https://lnkd.in/dvCe2-3H)

## Contact

For more information or contributions, feel free to reach out via GitHub issues or directly through the live demo link.
