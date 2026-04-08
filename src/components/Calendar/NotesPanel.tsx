'use client';

import React, { useState, useEffect } from 'react';
import { useCalendar } from './CalendarContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function NotesPanel() {
  const { selection, notes, saveNote } = useCalendar();
  const [localNote, setLocalNote] = useState('');
  const [noteKey, setNoteKey] = useState<string | null>(null);

  useEffect(() => {
    if (!selection.start) {
      setNoteKey(null);
      setLocalNote('');
      return;
    }

    let key = '';
    if (selection.start && selection.end) {
      const startStr = format(selection.start, 'yyyy-MM-dd');
      const endStr = format(selection.end, 'yyyy-MM-dd');
      key = `${startStr}/${endStr}`;
    } else {
      key = format(selection.start, 'yyyy-MM-dd');
    }

    setNoteKey(key);
    setLocalNote(notes[key] || '');
  }, [selection, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
  };

  const handleBlur = () => {
    if (noteKey) {
      saveNote(noteKey, localNote);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd, value } = target;

      const linesBeforeCursor = value.substring(0, selectionStart).split('\n');
      const currentLineIndex = linesBeforeCursor.length - 1;
      let currentLine = linesBeforeCursor[currentLineIndex];

      let newValue = value;
      let newCursorPos = selectionStart;

      const match = currentLine.match(/^(\d+)\.\s(.*)$/);
      
      if (match) {
        // Current line is already numbered
        const num = parseInt(match[1], 10);
        const textAfter = value.substring(selectionEnd);
        
        if (match[2].trim() === '') {
          // If the line is empty (e.g. "2. "), remove the numbering on Enter
          const valBefore = value.substring(0, selectionStart - currentLine.length);
          newValue = valBefore + '\n' + textAfter;
          newCursorPos = valBefore.length + 1;
        } else {
          // Normal continuation
          const insert = `\n${num + 1}. `;
          newValue = value.substring(0, selectionStart) + insert + textAfter;
          newCursorPos = selectionStart + insert.length;
        }
      } else {
        // Current line is NOT numbered.
        let lastNum = 0;
        for (let i = currentLineIndex - 1; i >= 0; i--) {
          const m = linesBeforeCursor[i].match(/^(\d+)\./);
          if (m) {
            lastNum = parseInt(m[1], 10);
            break;
          }
        }
        
        const textAfter = value.substring(selectionEnd);
        
        if (lastNum > 0) {
          // There's a list going on above, just continue it
          const insert = `\n${lastNum + 1}. `;
          newValue = value.substring(0, selectionStart) + insert + textAfter;
          newCursorPos = selectionStart + insert.length;
        } else {
          // It's the first item. Transform current line to "1. " and append "2. "
          const valBeforeCurrentLine = value.substring(0, selectionStart - currentLine.length);
          const transformedCurrentLine = `1. ${currentLine}`;
          const insert = `\n2. `;
          
          newValue = valBeforeCurrentLine + transformedCurrentLine + insert + textAfter;
          newCursorPos = valBeforeCurrentLine.length + transformedCurrentLine.length + insert.length;
        }
      }
      
      setLocalNote(newValue);
      
      setTimeout(() => {
        target.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  let title = 'Select a date';
  if (selection.start && selection.end) {
    title = `${format(selection.start, 'MMM d')} - ${format(selection.end, 'MMM d, yyyy')}`;
  } else if (selection.start) {
    title = format(selection.start, 'MMMM d, yyyy');
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "calendar_notes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="mt-8 flex-1 border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-100">
          <FileText size={20} className="text-[var(--theme-color)]" />
          <h3 className="text-xl font-medium tracking-tight">Notes</h3>
        </div>
        <button
          onClick={handleExport}
          className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-[var(--theme-color)] hover:text-white transition-colors"
        >
          Export JSON
        </button>
      </div>
      
      <p className="text-sm text-neutral-500 mb-4">{title}</p>
      
      <AnimatePresence mode="wait">
        {!selection.start ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50"
          >
            <p className="text-neutral-400 dark:text-neutral-500 font-medium">Select a date or range to add notes</p>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 min-h-[150px] relative"
          >
            <textarea
              value={localNote}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="What's happening on this day?"
              className="w-full h-full px-4 pt-2 pb-4 rounded-xl bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-neutral-700 dark:text-neutral-300 custom-scrollbar leading-[32px] tracking-wide"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.2) 31px, rgba(156, 163, 175, 0.2) 32px)',
                backgroundAttachment: 'local',
                backgroundSize: '100% 32px'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
