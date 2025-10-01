
import React, { useState } from 'react';
import Spinner from './Spinner';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <section className="w-full max-w-2xl text-center">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Describe Your App Idea</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A simple pomodoro timer app with a clean, minimalist interface."
          className="w-full h-24 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center h-12 disabled:bg-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Generate Mockup'}
        </button>
      </form>
    </section>
  );
};

export default PromptInput;
