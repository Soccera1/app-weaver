
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
