/*
 * App Weaver
 * Copyright (C) 2025 Google LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useState, useEffect } from 'react';
import { GeneratedCode } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CodeIcon } from './icons/CodeIcon';

interface CodeDisplayProps {
  code: GeneratedCode | null;
  isLoading: boolean;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, isLoading }) => {
  const files = code ? Object.keys(code).sort() : [];
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      setActiveFile(files[0]);
    } else if (files.length > 0 && activeFile && !files.includes(activeFile)) {
      setActiveFile(files[0]);
    } else if (files.length === 0) {
      setActiveFile(null);
    }
  }, [files, activeFile]);

  const handleCopy = (filename: string) => {
    if (code && code[filename]) {
      navigator.clipboard.writeText(code[filename]);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    }
  };

  if (!code) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4 text-center">3. Your Generated Code</h2>
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-2xl shadow-indigo-900/20 overflow-hidden">
        <div className="flex items-center bg-slate-900/50 border-b border-slate-700 px-2 min-h-[57px]">
          <div className="flex-shrink-0 mr-4 ml-2 p-2">
            <CodeIcon className="w-5 h-5 text-slate-400"/>
          </div>
          <div className="flex-grow overflow-x-auto overflow-y-hidden">
            <div className="flex space-x-2">
            {files.map((filename) => (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  activeFile === filename
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {filename}
              </button>
            ))}
            </div>
          </div>
        </div>
        
        {(isLoading && files.length === 0) && (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin"></div>
              <span>Streaming response from Gemini...</span>
            </div>
        )}

        {activeFile && code[activeFile] !== undefined && (
          <div className="relative group">
             <button
              onClick={() => handleCopy(activeFile)}
              className="absolute top-3 right-3 p-2 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Copy code"
            >
              <CopyIcon className="w-5 h-5" />
              <span className={`absolute -top-8 right-0 text-xs bg-indigo-500 text-white px-2 py-1 rounded transition-opacity duration-300 ${copiedFile === activeFile ? 'opacity-100' : 'opacity-0'}`}>
                Copied!
              </span>
            </button>
            <pre className="max-h-[60vh] overflow-auto p-4 text-sm">
              <code className="font-mono">{code[activeFile]}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodeDisplay;