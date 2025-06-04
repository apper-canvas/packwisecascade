import React from 'react';
import AppLogo from '../atoms/AppLogo';
import ThemeToggleButton from '../atoms/ThemeToggleButton';

const PageHeader = ({ darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <AppLogo />
        <ThemeToggleButton darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </header>
  );
};

export default PageHeader;