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
  return <div className="flex -ml-0.5">{stars}</div>;
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
    const months = [];
    for (let i = -12; i <= 12; i++) {
      const date = new Date(2025, 8 + i, 1);
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  });

  const calendarContainerRef = useRef(null);
  const monthRefs = useRef(new Map());
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const hasScrolledToInitial = useRef(false);
  
  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const september2025Ref = useRef(null);

  const calendarDays = useMemo(() => {
    if (!monthsToDisplay.length) return { emptyDays: [], days: [] };
    const firstMonthDate = new Date(monthsToDisplay[0].year, monthsToDisplay[0].month, 1);
    const emptyDays = Array(firstMonthDate.getDay()).fill(null);
    const days = monthsToDisplay.flatMap(({ year, month }) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    });
    return { emptyDays, days };
  }, [monthsToDisplay]);

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

  useLayoutEffect(() => {
    if (september2025Ref.current && !hasScrolledToInitial.current) {
      const topPos = september2025Ref.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topPos - (window.innerHeight / 4), behavior: 'instant' });
      hasScrolledToInitial.current = true;
      onMonthChange(new Date(2025, 8));
    }
  }, [calendarDays, onMonthChange]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPrevScrollHeight(document.body.scrollHeight);
          setMonthsToDisplay(prev => {
            const firstMonth = prev[0];
            const newMonths = [];
            for (let i = 1; i <= 6; i++) {
              const newDate = new Date(firstMonth.year, firstMonth.month - i, 1);
              newMonths.push({ year: newDate.getFullYear(), month: newDate.getMonth() });
            }
            return [...newMonths.reverse(), ...prev];
          });
        }
      },
      { root: null, rootMargin: "400px" }
    );
    if (topSentinelRef.current) observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [monthsToDisplay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMonthsToDisplay(prev => {
            const lastMonth = prev[prev.length - 1];
            const newMonths = [];
            for (let i = 1; i <= 6; i++) {
              const newDate = new Date(lastMonth.year, lastMonth.month + i, 1);
              newMonths.push({ year: newDate.getFullYear(), month: newDate.getMonth() });
            }
            return [...prev, ...newMonths];
          });
        }
      },
      { root: null, rootMargin: "400px" }
    );
    if (bottomSentinelRef.current) observer.observe(bottomSentinelRef.current);
    return () => observer.disconnect();
  }, [monthsToDisplay]);

  useLayoutEffect(() => {
    if (prevScrollHeight) {
      window.scrollTo(0, document.body.scrollHeight - prevScrollHeight);
      setPrevScrollHeight(0);
    }
  }, [prevScrollHeight]);
  
  useEffect(() => {
    const monthHeaderObserver = new IntersectionObserver((entries) => {
      const visibleMonths = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleMonths.length > 0) {
        const topMostVisible = visibleMonths[0];
        if (topMostVisible.target.dataset.date) {
            const { year, month } = JSON.parse(topMostVisible.target.dataset.date);
            onMonthChange(new Date(year, month));
        }
      }
    }, { root: null, rootMargin: `0px 0px -${window.innerHeight - 150}px 0px`});

    monthRefs.current.forEach(ref => {
        if (ref) monthHeaderObserver.observe(ref);
    });
    return () => monthHeaderObserver.disconnect();
  }, [monthsToDisplay, onMonthChange]);

  return (
    <>
      <div ref={calendarContainerRef} className="max-w-4xl mx-auto p-4">
        <div ref={topSentinelRef} />
        <div className="grid grid-cols-7 text-center font-bold text-gray-500 border-b border-gray-200 pb-2 mb-2 sticky top-12 bg-white z-10">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 border-l border-gray-200">
          {calendarDays.emptyDays.map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-gray-200 aspect-[3/4]"></div>)}
          {calendarDays.days.map((date) => {
            const journalEntry = journalEntriesByDate.get(date.toDateString());
            const isSept2025 = date.getFullYear() === 2025 && date.getMonth() === 8 && date.getDate() === 1;
            return (
              <div
                key={date.toString()}
                ref={el => {
                  if (date.getDate() === 1) monthRefs.current.set(`${date.getFullYear()}-${date.getMonth()}`, el);
                  if (isSept2025) september2025Ref.current = el;
                }}
                data-date={date.getDate() === 1 ? JSON.stringify({ year: date.getFullYear(), month: date.getMonth() }) : undefined}
                className="border-r border-b border-gray-200 aspect-[3/4] flex flex-col relative text-black"
                onClick={() => journalEntry && handleOpenModal(journalEntry)}
              >
                {journalEntry ? (
                  <>
                    <img src={journalEntry.imgUrl} alt="Journal" className="absolute inset-0 w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative z-10 text-white p-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-base">{date.getDate()}</span>
                          <span className="text-xs">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}</span>
                        </div>
                        <StarRating rating={journalEntry.rating} />
                      </div>
                      <CategoryIcons categories={journalEntry.categories} />
                    </div>
                  </>
                ) : (
                  <span className="font-bold self-start p-1">{date.getDate()}</span>
                )}
              </div>
            );
          })}
        </div>
        <div ref={bottomSentinelRef} />
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