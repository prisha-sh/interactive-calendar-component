'use client';

import React, { useState, useEffect } from 'react';
import { useCalendar } from './CalendarContext';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentMonth, nextMonth, prevMonth } = useCalendar();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 text-white">
      <div className="overflow-hidden relative h-20 w-48 flex items-end justify-end">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentMonth.toString()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 flex flex-col items-end text-right"
          >
            <span className="text-2xl font-light tracking-wide opacity-90">{format(currentMonth, 'yyyy')}</span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-none">
              {format(currentMonth, 'MMMM')}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}
