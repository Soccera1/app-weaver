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

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center border-b border-slate-700/50">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]">
          App Weaver
        </span>
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        From Idea to Mockup to Code, Instantly.
      </p>
    </header>
  );
};

export default Header;