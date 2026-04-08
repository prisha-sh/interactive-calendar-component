'use client';

import React from 'react';
import { useCalendar } from './CalendarContext';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from 'date-fns';
import DayCell from './DayCell';
import { motion } from 'framer-motion';

export default function CalendarGrid() {
  const { currentMonth } = useCalendar();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 w-full flex flex-col pt-4">
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      <motion.div 
        key={currentMonth.toString()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-7 gap-y-2 lg:gap-y-4 auto-rows-[60px] lg:auto-rows-[80px]"
      >
        {days.map((day, idx) => (
          <DayCell
            key={day.toString()}
            date={day}
            isCurrentMonth={isSameMonth(day, monthStart)}
            isToday={isToday(day)}
          />
        ))}
      </motion.div>
    </div>
  );
}
