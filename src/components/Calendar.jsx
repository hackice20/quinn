import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { journalData } from '../data';
import JournalModal from './JournalModal';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="text-blue-400 text-xs">★</span>);
  }
  const emptyStars = 5 - fullStars;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-500 text-xs">★</span>);
  }
  return <div className="flex">{stars}</div>;
};

const CategoryIcons = ({ categories }) => {
    const categoryStyles = {
        "Deep Conditioning": { abbr: "DC", color: "bg-pink-200" },
        "Protein Treatment": { abbr: "Pr", color: "bg-yellow-200" },
        "Protective Style": { abbr: "Ps", color: "bg-purple-200" },
        "Wash Day": { abbr: "W", color: "bg-indigo-200" },
        "Clarifying": { abbr: "C", color: "bg-green-200" },
        "Moisture": { abbr: "M", color: "bg-blue-200" },
        "Hair Growth": { abbr: "HG", color: "bg-red-200" },
        "Natural Products": { abbr: "NP", color: "bg-orange-200" },
        "Hair Repair": { abbr: "HR", color: "bg-teal-200" },
        "Salon Visit": { abbr: "SV", color: "bg-cyan-200" },
        "Scalp Care": { abbr: "SC", color: "bg-lime-200" },
        "Hair Mask": { abbr: "HM", color: "bg-amber-200" },
        "DIY Treatment": { abbr: "DIY", color: "bg-emerald-200" },
        "Hydration": { abbr: "H", color: "bg-sky-200" },
        "New Product": { abbr: "NP", color: "bg-rose-200" },
        "Leave-in Conditioner": { abbr: "LIC", color: "bg-fuchsia-200" },
        "Curl Definition": { abbr: "CD", color: "bg-violet-200" },
        "Trim": { abbr: "T", color: "bg-slate-200" },
        "Split Ends": { abbr: "SE", color: "bg-zinc-200" },
        "Oil Treatment": { abbr: "OT", color: "bg-stone-200" },
        "Growth": { abbr: "G", color: "bg-red-300" },
        "Detangling": { abbr: "D", color: "bg-orange-300" },
        "Deep Clean": { abbr: "DC", color: "bg-green-300" },
        "Heatless Styling": { abbr: "HS", color: "bg-teal-300" },
        "Overnight Routine": { abbr: "OR", color: "bg-cyan-300" },
        "Waves": { abbr: "W", color: "bg-sky-300" },
        "Color Care": { abbr: "CC", color: "bg-indigo-300" },
        "Purple Shampoo": { abbr: "PS", color: "bg-purple-300" },
        "Toning": { abbr: "T", color: "bg-pink-300" },
    };

    return (
        <div className="flex space-x-1 mt-1">
            {categories.slice(0, 3).map(cat => {
                const style = categoryStyles[cat] || { abbr: cat.substring(0, 2), color: "bg-gray-200" };
                return (
                    <div key={cat} className={`w-4 h-4 rounded-full flex items-center justify-center text-gray-700 text-[8px] font-bold ${style.color}`}>
                        {style.abbr}
                    </div>
                );
            })}
        </div>
    );
};

const Calendar = ({ onMonthChange }) => {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);
  const [monthsToDisplay, setMonthsToDisplay] = useState(() => {
    const initialYear = 2025;
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push({ year: initialYear, month: i });
    }
    return months;
  });

  const calendarContainerRef = useRef(null);
  const monthRefs = useRef(new Map());
  const observer = useRef();
  const lastMonthElementRef = useRef();

  const journalEntriesByDate = useMemo(() => {
    const map = new Map();
    journalData.forEach(entry => {
      const [day, month, year] = entry.date.split('/');
      const dateKey = new Date(year, month - 1, day).toDateString();
      map.set(dateKey, entry);
    });
    return map;
  }, []);

  const handleOpenModal = (journalEntry) => {
    const entryIndex = journalData.findIndex(entry => entry.date === journalEntry.date);
    setSelectedEntryIndex(entryIndex);
  };
  const handleCloseModal = () => setSelectedEntryIndex(null);
  const handlePrevEntry = () => { if (selectedEntryIndex !== null && selectedEntryIndex > 0) setSelectedEntryIndex(selectedEntryIndex - 1); };
  const handleNextEntry = () => { if (selectedEntryIndex !== null && selectedEntryIndex < journalData.length - 1) setSelectedEntryIndex(selectedEntryIndex + 1); };

  useEffect(() => {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const { year, month } = JSON.parse(entry.target.dataset.date);
          onMonthChange(new Date(year, month));
        }
      });
    }, { root: null, rootMargin: "0px 0px -80% 0px", threshold: 0 });

    monthRefs.current.forEach(ref => { if (ref) scrollObserver.observe(ref); });
    return () => scrollObserver.disconnect();
  }, [monthsToDisplay, onMonthChange]);

  useEffect(() => {
    const handleObserver = (entries) => {
      if (entries[0].isIntersecting) {
        setMonthsToDisplay(prev => {
          const lastMonth = prev[prev.length - 1];
          const nextMonthDate = new Date(lastMonth.year, lastMonth.month + 1, 1);
          return [...prev, { year: nextMonthDate.getFullYear(), month: nextMonthDate.getMonth() }];
        });
      }
    };
    observer.current = new IntersectionObserver(handleObserver, { root: null, rootMargin: '200px', threshold: 0.1 });
    if (lastMonthElementRef.current) observer.current.observe(lastMonthElementRef.current);
    return () => { if (observer.current) observer.current.disconnect(); };
  }, [monthsToDisplay]);

  useLayoutEffect(() => {
    if (calendarContainerRef.current && calendarContainerRef.current.scrollHeight <= window.innerHeight) {
      setMonthsToDisplay(prev => {
        const lastMonth = prev[prev.length - 1];
        const nextMonthDate = new Date(lastMonth.year, lastMonth.month + 1, 1);
        return [...prev, { year: nextMonthDate.getFullYear(), month: nextMonthDate.getMonth() }];
      });
    }
  }, [monthsToDisplay]);

  return (
    <>
      <div ref={calendarContainerRef} className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-7 text-center font-bold text-gray-500 border-b border-gray-200 pb-2 mb-2">
           {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
        </div>
        {monthsToDisplay.map((date, index) => {
          const year = date.year;
          const month = date.month;
          const isLastElement = index === monthsToDisplay.length - 1;
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          return (
            <div
              key={`${year}-${month}`}
              ref={el => {
                monthRefs.current.set(`${year}-${month}`, el);
                if (isLastElement) lastMonthElementRef.current = el;
              }}
              data-date={JSON.stringify({ year, month })}
            >
              <div className="grid grid-cols-7 border-l border-gray-200">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="border-r border-b border-gray-200 aspect-[3/4]"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNumber = i + 1;
                  const currentDate = new Date(year, month, dayNumber);
                  const journalEntry = journalEntriesByDate.get(currentDate.toDateString());
                  return (
                    <div key={i} className="border-r border-b border-gray-200 p-1 aspect-[3/4] flex flex-col relative text-black" onClick={() => journalEntry && handleOpenModal(journalEntry)}>
                      {journalEntry && (
                        <div className="absolute inset-0">
                          <img src={journalEntry.imgUrl} alt="Journal" className="w-full h-full object-cover"/>
                          <div className="absolute inset-0 bg-black opacity-30"></div>
                        </div>
                      )}
                      <span className={`font-bold self-start relative z-10 ${journalEntry ? 'text-white' : 'text-black'}`}>{dayNumber}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {selectedEntryIndex !== null && (
        <JournalModal
          entry={journalData[selectedEntryIndex]}
          onClose={handleCloseModal}
          onPrev={handlePrevEntry}
          onNext={handleNextEntry}
          hasPrev={selectedEntryIndex > 0}
          hasNext={selectedEntryIndex < journalData.length - 1}
        />
      )}
    </>
  );
};

export default Calendar;
