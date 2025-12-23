export const generateFitnessPrompt = (user: any) => `
You are a professional and safe AI fitness coach.

Create a personalized WEEKLY fitness plan using the details below.

User Profile:
- Name: ${user.name}
- Age: ${user.age}
- Fitness Goal: ${user.goal}
- Fitness Level: ${user.level}
- Workout Location: ${user.location}
- Diet Preference: ${user.diet}
- Medical / Stress Notes: ${user.medical || "None"}

IMPORTANT RULES (MUST FOLLOW STRICTLY):
- Generate a workout plan for EXACTLY 6 days
- Use ONLY these days in order:
  Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- Do NOT include Sunday (assume rest day)
- Each workout day MUST include:
  - exercises with sets and reps
  - a realistic workout duration in minutes
- Workout duration should depend on:
  - Fitness goal
  - Fitness level
  - Workout location
- Keep duration realistic:
  - Beginner: 15–30 minutes
  - Intermediate: 30–45 minutes
  - Advanced: 45–60 minutes

Return ONLY valid JSON in the following structure:

{
  "workout_plan": [
    {
      "day": "Monday",
      "duration": "30 minutes",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "3",
          "reps": "10",
          "notes": "short instruction"
        }
      ]
    }
  ],
  "diet_plan": {
    "breakfast": "",
    "lunch": "",
    "dinner": ""
  },
  "motivation_tips": []
}
`;
