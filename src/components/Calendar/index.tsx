'use client';

import React from 'react';
import Image from 'next/image';
import { useCalendar, CalendarProvider } from './CalendarContext';
import Header from './Header';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { motion } from 'framer-motion';

function CalendarAppInner() {
  const { themeColor, setThemeColor, currentMonth } = useCalendar();

  const handleImageLoad = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    try {
      const module = (await import('colorthief')) as any;
      const ColorThiefClass = module.default || module;
      const ColorThief = (ColorThiefClass.default || ColorThiefClass) as any;
      const colorThief = new ColorThief();
      // Allow slight delay so image is ready for canvas
      setTimeout(() => {
        try {
          const rgb = colorThief.getColor(img);
          setThemeColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        } catch (_e) {}
      }, 50);
    } catch (error) {
    }
  };

  const monthImages = [
    "https://images.unsplash.com/photo-1478719059408-592965723cbc?auto=format&fit=crop&q=80&w=1600", // Jan: Winter structure
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600", // Feb: Cold mountains
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600", // Mar: Early spring
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1600", // Apr: Lush green
    "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&q=80&w=1600", // May: Vibrant Spring 
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600", // Jun: Tropical beach
    "https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&q=80&w=1600", // Jul: Summer vibe
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1600", // Aug: Clear sky 
    "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&q=80&w=1600", // Sep: Late summer path
    "https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&q=80&w=1600", // Oct: Autumn foliage
    "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=1600", // Nov: Moody forest
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1600", // Dec: Frosty Winter
  ];

  const currentImage = monthImages[currentMonth.getMonth()];

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-12 bg-neutral-200 dark:bg-[#0a0a0a] transition-colors duration-500 ease-in-out"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-900 shadow-2xl flex flex-col relative overflow-hidden rounded-xl">
        {/* Top half: Hero Image */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full h-64 md:h-96 relative overflow-hidden bg-neutral-100 group"
        >
          <motion.img
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={currentImage}
            alt="Editorial Calendar Hero"
            className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
            crossOrigin="anonymous" 
            onLoad={handleImageLoad}
          />
          {/* Subtle gradient to ensure header text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-500" />
          
          <div className="absolute bottom-4 right-6 md:bottom-8 md:right-10 flex items-end">
            <Header />
          </div>
        </motion.div>

        {/* Bottom half: Notes & Calendar Grid split */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="flex flex-col md:flex-row p-6 md:p-12 lg:p-16 gap-10 md:gap-16"
        >
          <div className="w-full md:w-1/3 flex flex-col">
            <NotesPanel />
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col">
            <CalendarGrid />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CalendarApp() {
  return (
    <CalendarProvider>
      <CalendarAppInner />
    </CalendarProvider>
  );
}
