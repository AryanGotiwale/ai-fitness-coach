"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function Home() {
  /* ---------------------- STATE ---------------------- */
  const [form, setForm] = useState({
    name: "",
    age: "",
    goal: "",
    level: "",
    diet: "",
    location: "",
    medical: "",
  });

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [errors, setErrors] = useState<string[]>([]);

 const [darkMode, setDarkMode] = useState(false);

 const [motivationIndex, setMotivationIndex] = useState(0);

 useEffect(() => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    setDarkMode(true);
  }
}, []);
const toggleTheme = () => {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");

  setDarkMode(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
};



useEffect(() => {
  if (!plan) return;

  const interval = setInterval(() => {
    setMotivationIndex((prev) =>
      (prev + 1) % plan.motivation_tips.length
    );
  }, 6000); 

  return () => clearInterval(interval);
}, [plan]);

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", darkMode);
  // }, [darkMode]);

  /* ------------------ LOAD SAVED PLAN ----------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("fitnessPlan");
    if (saved) setPlan(JSON.parse(saved));
  }, []);

  /* -------------------- LOAD VOICES -------------------- */
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length && !selectedVoice) setSelectedVoice(v[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ---------------- FORM ------------------ */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------------- API ------------------ */
  const generatePlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setPlan(data);
      localStorage.setItem("fitnessPlan", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
   const validateForm = () => {
  const requiredFields = ["name", "age", "goal", "level", "diet", "location"];
  const missing = requiredFields.filter(
    (field) => !form[field as keyof typeof form]
  );

  if (missing.length > 0) {
    setErrors(missing);
    return false;
  }

  setErrors([]);
  return true;
};

const handleSubmit = () => {
  if (!validateForm()) return;

  localStorage.removeItem("fitnessPlan");
  generatePlan();
};


  /* -------------------- PDF ------------------ */
  const exportPDF = () => {
    if (!plan) return;

    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("AI Fitness Coach - Weekly Plan", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Goal: ${form.goal}`, 10, y);
    y += 6;
    doc.text(`Level: ${form.level}`, 10, y);
    y += 10;

    doc.setFontSize(16);
    doc.text("Workout Plan", 10, y);
    y += 8;

    plan.workout_plan.forEach((day: any) => {
      doc.setFontSize(13);
      doc.text(`${day.day} (${day.duration})`, 10, y);
      y += 6;

      day.exercises.forEach((ex: any) => {
        doc.setFontSize(11);
        doc.text(`• ${ex.name} - ${ex.sets} x ${ex.reps}`, 12, y);
        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
      });
      y += 4;
    });

    doc.save("ai-fitness-plan.pdf");
  };

  /* ----------------- SPEECH ------------------- */
  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) u.voice = voice;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };
/*-------------------------- we will do this later ------------*/
  const speakWorkout = () => {
    if (!plan) return;
    let t = "Your weekly workout routine. ";
    plan.workout_plan.forEach((d: any) => {
      t += `${d.day}, ${d.duration}. `;
      d.exercises.forEach((e: any) => {
        t += `${e.name}, ${e.sets} sets of ${e.reps}. `;
      });
    });
    speakText(t);
  };

  const speakDiet = () => {
    if (!plan) return;
    speakText(
      `Diet plan. Breakfast: ${plan.diet_plan.breakfast}. 
       Lunch: ${plan.diet_plan.lunch}. 
       Dinner: ${plan.diet_plan.dinner}.`
    );
  };

 const speakFullPlan = () => {
  if (!plan) return;

  let text = "Here is your complete fitness plan. ";

  // WORKOUT
  plan.workout_plan.forEach((day: any) => {
    text += `${day.day}, duration ${day.duration}. `;
    day.exercises.forEach((ex: any) => {
      text += `${ex.name}, ${ex.sets} sets of ${ex.reps} reps. `;
    });
  });

  // DIET
  text += `Now your diet plan. `;
  text += `Breakfast: ${plan.diet_plan.breakfast}. `;
  text += `Lunch: ${plan.diet_plan.lunch}. `;
  text += `Dinner: ${plan.diet_plan.dinner}. `;

  speakText(text);
};


  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  /* -------------------- UI -------------------- */
 return (
  <main className="
    min-h-screen px-4 py-10 transition-colors
    bg-slate-50 text-slate-900
    dark:bg-slate-950 dark:text-slate-100
  ">
    {/* MOTIVATION FLOAT CARD */}
<div className="
   top-24 left-6 w-72
  hidden lg:block
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-slate-800
  rounded-2xl shadow-xl p-6
  transition
">
  <h3 className="text-lg font-bold mb-3 text-rose-600">
     Daily Motivation
  </h3>

  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
    “{plan?.motivation_tips?.[motivationIndex] ?? "Stay consistent and trust the process"}”

  </p>

  <div className="mt-4 text-xs text-slate-400">
    
  </div>
</div>


    {/* THEME TOGGLE */}
    <button
      onClick={toggleTheme}
      className="
        fixed top-6 right-6 z-50 px-4 py-2 rounded-xl
        bg-slate-900 text-white
        dark:bg-slate-100 dark:text-slate-900
        shadow-lg hover:scale-105 transition
      "
    >
      {darkMode ? " Light Mode" : " Dark Mode"}
    </button>

    {/* FORM CARD */}
    {errors.length > 0 && (
  <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
    Please fill all required fields.
  </div>
)}

    <div className="
      max-w-md mx-auto rounded-3xl p-8 shadow-xl transition
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-800
    ">
      <h1 className="text-3xl font-extrabold text-center mb-8">
        AI Fitness Coach 
      </h1>

      {["name", "age"].map((f) => (
        <input
          key={f}
          name={f}
          placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          onChange={handleChange}
         className={`w-full mb-4 px-4 py-3 rounded-xl
  bg-slate-100 dark:bg-slate-800
  border ${errors.includes("name") ? "border-red-500" : "border-slate-300 dark:border-slate-700"}
  text-slate-900 dark:text-slate-100
  focus:outline-none focus:ring-2 focus:ring-rose-500`}
        />
      ))}

      {[
        ["goal", ["Weight Loss", "Muscle Gain", "Fitness"]],
        ["level", ["Beginner", "Intermediate", "Advanced"]],
        ["location", ["Home", "Gym", "Outdoor"]],
        ["diet", ["Veg", "Non-Veg", "Vegan"]],
      ].map(([name, opts]: any) => (
        <select
          key={name}
          name={name}
          onChange={handleChange}
         className={`w-full mb-4 px-4 py-3 rounded-xl
  bg-slate-100 dark:bg-slate-800
  border ${errors.includes("name") ? "border-red-500" : "border-slate-300 dark:border-slate-700"}
  text-slate-900 dark:text-slate-100
  focus:outline-none focus:ring-2 focus:ring-rose-500`}
        >
          <option value="">{name}</option>
          {opts.map((o: string) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ))}

      <textarea
        name="medical"
        placeholder="Medical / stress notes (optional)"
        onChange={handleChange}
        rows={3}
        className="
          w-full mb-6 px-4 py-3 rounded-xl
          bg-slate-100 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-rose-500
        "
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          w-full py-3 rounded-xl font-semibold
          bg-rose-600 hover:bg-rose-700 text-white
          transition disabled:opacity-60
        "
      >
        {loading ? "Generating..." : "Generate My Plan"}
      </button>
    </div>

    {/* PLAN SECTION */}
    {plan && (
      <div className="max-w-4xl mx-auto mt-14 space-y-8">

        {/* ACTION BAR */}
        <div className="
          flex flex-wrap gap-3 justify-between items-center
          p-4 rounded-2xl shadow
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
        ">
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="
              px-3 py-2 rounded-lg
              bg-slate-100 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
            "
          >
            {voices.map((v) => (
              <option key={v.name}>{v.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
       <div className="flex flex-col gap-2">
  {/* SPEAK BUTTON */}
  <button
    onClick={speakFullPlan}
    className="px-4 py-2 rounded-lg border font-medium"
  >
    🔊 
  </button>

  {/* SPEECH CONTROLS */}
  {isSpeaking && (
    <div className="flex gap-2 justify-center">
      <button
        onClick={pauseSpeech}
        className="px-3 py-1 rounded-md border text-sm"
      >
         Pause
      </button>

      <button
        onClick={resumeSpeech}
        className="px-3 py-1 rounded-md border text-sm"
      >
         Resume
      </button>

      <button
        onClick={stopSpeech}
        className="px-3 py-1 rounded-md border text-sm"
      >
         Stop
      </button>
    </div>
  )}
</div>


<button onClick={exportPDF} className="px-4 py-2 rounded-lg border">
   Export as PDf
</button>



<button
  onClick={generatePlan}
  className="px-4 py-2 rounded-lg bg-rose-600 text-white"
>
  🔄 
</button>

          </div>
        </div>

        {/* WORKOUT / DIET / MOTIVATION CARDS */}
        {[
          {
  title: " Weekly Workout Plan",
  content: plan.workout_plan.map((d: any) => (
    <div key={d.day} className="mb-5">
      <h3 className="font-semibold text-lg">
        {d.day} ({d.duration})
      </h3>

      <ul className="list-disc pl-6 mt-2 text-slate-700 dark:text-slate-300">
        {d.exercises.map((ex: any, i: number) => (
          <li key={i}>
            {ex.name} — {ex.sets} × {ex.reps}
          </li>
        ))}
      </ul>
    </div>
  ))
}
,
          { title: " Diet Plan", content: (
            <>
              <p><b>Breakfast:</b> {plan.diet_plan.breakfast}</p>
              <p><b>Lunch:</b> {plan.diet_plan.lunch}</p>
              <p><b>Dinner:</b> {plan.diet_plan.dinner}</p>
            </>
          )},
          { title: " Motivation", content: (
            <ul className="list-disc pl-6">
              {plan.motivation_tips.map((t:string,i:number)=>(
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        ].map((sec, i) => (
          <div key={i} className="
            p-6 rounded-2xl shadow
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
          ">
            <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>
            {sec.content}
          </div>
        ))}
      </div>
    )}
  </main>
);
}