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