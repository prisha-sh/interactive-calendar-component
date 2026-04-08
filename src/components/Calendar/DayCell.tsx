'use client';

import React from 'react';
import { useCalendar } from './CalendarContext';
import { format, isSameDay, isWithinInterval, isAfter, isBefore } from 'date-fns';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function DayCell({ date, isCurrentMonth, isToday }: DayCellProps) {
  const { selection, handleDateClick, hoverDate, setHoverDate, notes } = useCalendar();

  const isSelectedStart = selection.start ? isSameDay(date, selection.start) : false;
  const isSelectedEnd = selection.end ? isSameDay(date, selection.end) : false;

  let isInRange = false;
  let isHoverRange = false;

  if (selection.start && selection.end) {
    isInRange = isWithinInterval(date, { start: selection.start, end: selection.end });
  } else if (selection.start && hoverDate) {
    if (isAfter(hoverDate, selection.start)) {
      isHoverRange = isWithinInterval(date, { start: selection.start, end: hoverDate });
    } else {
      isHoverRange = isWithinInterval(date, { start: hoverDate, end: selection.start });
    }
  }

  // Check if a note exists for this date. We format it precisely as YYYY-MM-DD
  const dateKey = format(date, 'yyyy-MM-dd');
  const hasNote = notes[dateKey] && notes[dateKey].trim().length > 0;

  const isSelected = isSelectedStart || isSelectedEnd;

  let cellClasses = "relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group";
  
  // Background logic
  if (isSelected) {
    cellClasses += " text-white z-10";
  } else if (isInRange || isHoverRange) {
    cellClasses += " bg-[var(--theme-color)]/10 text-neutral-800 dark:text-neutral-200";
  } else if (!isCurrentMonth) {
    cellClasses += " text-neutral-300 dark:text-neutral-700";
  } else {
    cellClasses += " text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50";
  }

  // Border radius formatting for range selection
  if (isSelectedStart && !isSelectedEnd && !selection.end) {
    cellClasses += " rounded-full";
  } else if (isSelectedStart) {
    cellClasses += " rounded-l-full";
  } else if (isSelectedEnd) {
    cellClasses += " rounded-r-full";
  } else if (!isInRange && !isHoverRange && !isSelected) {
    cellClasses += " rounded-full";
  }

  return (
    <div
      onClick={() => handleDateClick(date)}
      onMouseEnter={() => setHoverDate(date)}
      onMouseLeave={() => setHoverDate(null)}
      className={cellClasses}
    >
      {isSelected && (
        <div 
          className="absolute inset-0 bg-[var(--theme-color)] rounded-full shadow-lg scale-105 z-[-1]"
          style={{ transition: 'background-color 0.5s ease' }}
        />
      )}
      
      {/* Today Marker */}
      {isToday && !isSelected && (
        <div className="absolute top-1 lg:top-2 w-1 h-1 rounded-full bg-[var(--theme-color)]" />
      )}
      
      <span className={`text-sm lg:text-base font-medium transition-transform duration-200 group-hover:scale-110 ${isToday && !isSelected ? 'text-[var(--theme-color)]' : ''}`}>
        {format(date, 'd')}
      </span>

      {/* Note indicator */}
      {hasNote && (
        <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
      )}
    </div>
  );
}
