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

import React, { useState, useCallback, useEffect } from 'react';
import { AppState, GeneratedCode, ImplementationFormat } from './types';
import { enhancePrompt, generateMockup, refineMockup, generateCodeStream } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import MockupDisplay from './components/MockupDisplay';
import CodeDisplay from './components/CodeDisplay';

// Helper function to parse the streaming code format
const parseCodeStream = (streamContent: string): GeneratedCode => {
    const files: GeneratedCode = {};
    const fileRegex = /\[START_FILE: (.*?)]\r?\n([\s\S]*?)\[END_FILE: \1]/g;
    let match;

    while ((match = fileRegex.exec(streamContent)) !== null) {
        const filePath = match[1].trim();
        const content = match[2];
        files[filePath] = content;
    }

    // Find the currently streaming file that doesn't have an end tag yet
    const lastStartMatch = /\[START_FILE: (.*)]\r?\n([\s\S]*)$/g.exec(streamContent);
    if (lastStartMatch) {
      const filePath = lastStartMatch[1].trim();
      // If the file is not already completed, add its streaming content
      if (!files[filePath]) {
        files[filePath] = lastStartMatch[2];
      }
    }
    
    return files;
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [prompt, setPrompt] = useState<string>('');
  const [mockupImageBase64, setMockupImageBase64] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = appState === AppState.MOCKUP_GENERATING || appState === AppState.CODE_GENERATING || appState === AppState.MOCKUP_REFINING;

  const handleGenerateMockup = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      setError('Please enter a description for your app.');
      return;
    }
    setAppState(AppState.MOCKUP_GENERATING);
    setError(null);
    setMockupImageBase64(null);
    setGeneratedCode(null);
    setPrompt(currentPrompt);

    try {
      const enhancedPrompt = await enhancePrompt(currentPrompt);
      const imageBase64 = await generateMockup(enhancedPrompt);
      setMockupImageBase64(imageBase64);
      setAppState(AppState.MOCKUP_DISPLAYED);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setAppState(AppState.INITIAL);
    }
  }, []);

  const handleRefineMockup = useCallback(async (refinementPrompt: string) => {
    if (!refinementPrompt.trim() || !mockupImageBase64) {
      setError("Cannot refine without a prompt and an existing mockup.");
      return;
    }
    setAppState(AppState.MOCKUP_REFINING);
    setError(null);

    try {
      const newImageBase64 = await refineMockup(refinementPrompt, mockupImageBase64);
      setMockupImageBase64(newImageBase64);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setAppState(AppState.MOCKUP_DISPLAYED);
    }
  }, [mockupImageBase64]);


  const handleGenerateCode = useCallback(async (format: ImplementationFormat) => {
    if (!prompt || !mockupImageBase64) {
      setError('Cannot generate code without a prompt and mockup.');
      return;
    }
    setAppState(AppState.CODE_GENERATING);
    setError(null);
    setGeneratedCode({}); // Initialize to show the component

    try {
      const stream = generateCodeStream(prompt, mockupImageBase64, format);
      let fullResponse = '';
      for await (const chunk of stream) {
          fullResponse += chunk;
          const files = parseCodeStream(fullResponse);
          setGeneratedCode(files);
      }
      setAppState(AppState.CODE_DISPLAYED);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setAppState(AppState.MOCKUP_DISPLAYED); // Revert on error
    }
  }, [prompt, mockupImageBase64]);

  const handleReset = () => {
    setAppState(AppState.INITIAL);
    setPrompt('');
    setMockupImageBase64(null);
    setGeneratedCode(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
          {error && (
            <div className="w-full bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
              <p><strong>An error occurred:</strong> {error}</p>
            </div>
          )}

          {appState !== AppState.CODE_DISPLAYED && (
             <PromptInput
              onGenerate={handleGenerateMockup}
              isLoading={appState === AppState.MOCKUP_GENERATING}
            />
          )}

          {(appState >= AppState.MOCKUP_GENERATING) && mockupImageBase64 && (
             <MockupDisplay
              imageBase64={mockupImageBase64}
              isLoading={appState === AppState.MOCKUP_GENERATING}
              isRefining={appState === AppState.MOCKUP_REFINING}
              showOptions={appState === AppState.MOCKUP_DISPLAYED || appState === AppState.MOCKUP_REFINING}
              onRefine={handleRefineMockup}
              onGenerateCode={handleGenerateCode}
              isLoadingCode={appState === AppState.CODE_GENERATING}
            />
          )}

          {(appState >= AppState.CODE_GENERATING) && (
            <CodeDisplay 
              code={generatedCode}
              isLoading={appState === AppState.CODE_GENERATING}
            />
          )}

          {(appState === AppState.CODE_DISPLAYED) && (
             <button
              onClick={handleReset}
              className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
              Start Over
            </button>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;