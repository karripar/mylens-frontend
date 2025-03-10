import {useState, useEffect} from 'react';
import {Moon, Sun} from 'lucide-react';

const ThemeSwitch = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark',
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      <span className="text-sm">{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeSwitch;
