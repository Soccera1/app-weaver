import React from 'react';
import { ImplementationFormat } from '../types';
import ImplementationOptions from './ImplementationOptions';
import MockupRefinement from './MockupRefinement';

interface MockupDisplayProps {
  imageBase64: string | null;
  isLoading: boolean;
  isRefining: boolean;
  showOptions: boolean;
  onRefine: (prompt: string) => void;
  onGenerateCode: (format: ImplementationFormat) => void;
  isLoadingCode: boolean;
}

const MockupDisplay: React.FC<MockupDisplayProps> = ({
  imageBase64,
  isLoading,
  isRefining,
  showOptions,
  onRefine,
  onGenerateCode,
  isLoadingCode
}) => {
  return (
    <section className="w-full max-w-2xl text-center flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. Review Your Mockup</h2>
      <div className="relative w-[270px] h-[480px] bg-slate-800 rounded-2xl p-3 border border-slate-700 shadow-2xl shadow-indigo-900/20 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin"></div>
            <span>Weaving your design...</span>
          </div>
        ) : imageBase64 ? (
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Generated app mockup"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : null}
        {isRefining && (
          <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-300">
             <div className="w-8 h-8 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin"></div>
            <span>Refining...</span>
          </div>
        )}
      </div>

      {showOptions && (
        <>
          <MockupRefinement onRefine={onRefine} isLoading={isRefining || isLoadingCode} />
          <ImplementationOptions onGenerate={onGenerateCode} isLoading={isLoadingCode || isRefining} />
        </>
      )}
    </section>
  );
};

export default MockupDisplay;
