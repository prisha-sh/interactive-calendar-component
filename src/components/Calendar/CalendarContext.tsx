'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addMonths, subMonths, format, isSameDay } from 'date-fns';

export interface Selection {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string; // can be YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD
  text: string;
}

interface CalendarContextProps {
  currentMonth: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  selection: Selection;
  handleDateClick: (date: Date) => void;
  hoverDate: Date | null;
  setHoverDate: (date: Date | null) => void;
  notes: Record<string, string>;
  saveNote: (id: string, text: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selection, setSelection] = useState<Selection>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [themeColor, setThemeColor] = useState('#8B5A2B'); // Default earthy tone

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from local storage');
      }
    }
  }, []);

  const saveNote = (id: string, text: string) => {
    const newNotes = { ...notes };
    if (!text.trim()) {
      delete newNotes[id];
    } else {
      newNotes[id] = text;
    }
    setNotes(newNotes);
    localStorage.setItem('calendar_notes', JSON.stringify(newNotes));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    if (!selection.start || (selection.start && selection.end)) {
      // First click, or third click (reset)
      setSelection({ start: date, end: null });
    } else {
      // Second click
      if (date < selection.start) {
        // Selected end date before start date, treat as new start date
        setSelection({ start: date, end: null });
      } else {
        setSelection({ ...selection, end: date });
      }
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        nextMonth,
        prevMonth,
        selection,
        handleDateClick,
        hoverDate,
        setHoverDate,
        notes,
        saveNote,
        themeColor,
        setThemeColor,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
