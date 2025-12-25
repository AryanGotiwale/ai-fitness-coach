# 🏋️ AI Fitness Coach

AI Fitness Coach is a full-stack web application that generates **personalized workout plans, diet plans, and motivational tips** using Artificial Intelligence.  
The application also supports **dark mode, voice narration, and PDF export**, providing a complete and user-friendly fitness planning experience.

---

## 🚀 Live Demo

🔗 **Deployed Application:**  
https://ai-fitnescoach.netlify.app/ </br>
https://ai-fitness-coach-ashy.vercel.app/ 


---

## ✨ Key Features

- ✅ AI-generated **Weekly Workout Plan** (day-wise exercises)
- ✅ Personalized **Diet Plan** (Breakfast, Lunch, Dinner)
- ✅ Dynamic **Motivation Tips**
- ✅ **Text-to-Speech** support (Speak, Pause, Resume, Stop)
- ✅ **Export Fitness Plan as PDF**
- ✅ **Dark / Light Mode Toggle**
- ✅ Fully **Responsive UI**
- ✅ Secure backend API using environment variables

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- **React.js**
- **Tailwind CSS**
- **JavaScript / TypeScript**

### Backend
- **Next.js API Routes**
- **OpenAI API (GPT-4o-mini)**

### Tools & Libraries
- **jsPDF** – PDF export
- **Web Speech API** – Voice narration
- **Vercel** – Deployment
- **Git & GitHub** – Version control

---

## ⚙️ Application Flow

1. User enters fitness details:
   - Name & Age
   - Fitness Goal
   - Fitness Level
   - Workout Location
   - Diet Preference
2. Data is sent to the backend API (`/api/generate`)
3. OpenAI generates:
   - Weekly workout routine
   - Diet plan
   - Motivational tips
4. User can:
   - Listen to the plan using voice
   - Pause / Resume / Stop narration
   - Export the plan as a PDF
   - Regenerate a new plan

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory and add:

```env
OPENAI_API_KEY=your_openai_api_key
```
## 🧑‍💻 Run the Project Locally

 git clone https://github.com/AryanGotiwale/ai-fitness-coach.git </br>
cd ai-fitness-coach </br>
npm install </br>
npm run dev

### Open in Browser(to run locally)
http://localhost:3000

## 📁 Project Structure (Simplified)

```text
ai-fitness-coach/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── generate/
│           └── route.ts
├── lib/
│   └── prompt.ts
├── public/
├── tailwind.config.js
├── postcss.config.mjs
├── package.json
└── README.md
```


## 🎯 What I Learned
+ Hands-on experience with Next.js App Router

+ Integrating AI APIs in real-world applications

+ Managing UI state, theming, and speech features

+ Deploying full-stack applications on Vercel

## 👤 Author
### Aryan Gotiwale
🔗 GitHub: https://github.com/AryanGotiwale

💼 Aspiring MERN / Full-Stack Developer
