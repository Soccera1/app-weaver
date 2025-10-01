
import React from 'react';
import { ImplementationFormat } from '../types';
import { HtmlIcon } from './icons/HtmlIcon';
import { ReactIcon } from './icons/ReactIcon';
import Spinner from './Spinner';

interface ImplementationOptionsProps {
  onGenerate: (format: ImplementationFormat) => void;
  isLoading: boolean;
}

const ImplementationOptions: React.FC<ImplementationOptionsProps> = ({ onGenerate, isLoading }) => {
  return (
    <div className="w-full mt-8 text-center flex flex-col items-center">
      <h3 className="text-xl font-semibold text-slate-100 mb-4">Looks good? Let's build it.</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onGenerate('html')}
          className="group flex items-center justify-center gap-3 w-64 h-14 px-6 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-sky-500 hover:text-sky-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          <HtmlIcon className="w-6 h-6 text-slate-500 group-hover:text-sky-400 transition-colors"/>
          <span>Generate Single HTML File</span>
        </button>
        <button
          onClick={() => onGenerate('react')}
          className="group flex items-center justify-center gap-3 w-64 h-14 px-6 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          <ReactIcon className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors"/>
          <span>Generate React+TS Project</span>
        </button>
      </div>
    </div>
  );
};

export default ImplementationOptions;
