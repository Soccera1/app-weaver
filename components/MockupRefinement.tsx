import React, { useState } from 'react';
import Spinner from './Spinner';

interface MockupRefinementProps {
  onRefine: (prompt: string) => void;
  isLoading: boolean;
}

const MockupRefinement: React.FC<MockupRefinementProps> = ({ onRefine, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onRefine(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="w-full max-w-lg mt-8 text-center flex flex-col items-center">
      <h3 className="text-lg font-medium text-slate-300 mb-3">Want to change something?</h3>
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Change the main color to orange"
          className="flex-grow p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300 flex items-center justify-center h-12 disabled:bg-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? <Spinner /> : 'Refine'}
        </button>
      </form>
    </div>
  );
};

export default MockupRefinement;
