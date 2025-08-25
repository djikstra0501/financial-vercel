"use client";

import { useState, useEffect } from "react";

const features = [
  {
    title: "Track Expenses Effortlessly",
    desc: "Easily record and categorize your daily expenses.",
  },
  {
    title: "AI-Powered Companion",
    desc: "Get personalized financial tips through our AI assistant.",
  },
  {
    title: "Integrate Seamless with Personal Spreadsheet",
    desc: "Your data is yours, no data on us.",
  },
];

export default function FeatureCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg bg-white/10 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-2">{features[index].title}</h2>
      <p className="text-gray-200">{features[index].desc}</p>
    </div>
  );
}
