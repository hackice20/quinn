import React, { useState, useEffect, useRef, useMemo } from 'react';
import { journalData } from '../data';
import JournalModal from './JournalModal';

const Calendar = ({ onMonthChange }) => {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(null);
  const [monthsToDisplay, setMonthsToDisplay] = React.useState(() => {
    const initialYear = 2025;
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push({ year: initialYear, month: i });
    }
    return months;
  });

  const observer = useRef();
  const lastMonthElementRef = useRef();
  const monthRefs = useRef(new Map());

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

  const handleCloseModal = () => {
    setSelectedEntryIndex(null);
  };

  const handlePrevEntry = () => {
    if (selectedEntryIndex !== null && selectedEntryIndex > 0) {
      setSelectedEntryIndex(selectedEntryIndex - 1);
    }
  };

  const handleNextEntry = () => {
    if (selectedEntryIndex !== null && selectedEntryIndex < journalData.length - 1) {
      setSelectedEntryIndex(selectedEntryIndex + 1);
    }
  };

  useEffect(() => {
    const handleScrollObserver = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const { year, month } = JSON.parse(entry.target.dataset.date);
          onMonthChange(new Date(year, month));
        }
      });
    };

    const scrollObserver = new IntersectionObserver(handleScrollObserver, {
      root: null,
      rootMargin: "0px 0px -90% 0px",
      threshold: 0,
    });

    monthRefs.current.forEach(ref => {
      if (ref) {
        scrollObserver.observe(ref);
      }
    });

    return () => scrollObserver.disconnect();
  }, [monthsToDisplay, onMonthChange]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setMonthsToDisplay(prev => {
          const lastMonth = prev[prev.length - 1];
          const nextMonthDate = new Date(lastMonth.year, lastMonth.month + 1, 1);
          return [...prev, { year: nextMonthDate.getFullYear(), month: nextMonthDate.getMonth() }];
        });
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 1.0
    });

    if (lastMonthElementRef.current) {
      observer.current.observe(lastMonthElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [monthsToDisplay]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  return (
    <>
      <div className="container mx-auto p-4 text-white">
        {monthsToDisplay.map((date, index) => {
          const monthName = monthNames[date.month];
          const year = date.year;
          const isLastElement = index === monthsToDisplay.length - 1;

          return (
            <div
              key={`${year}-${date.month}`}
              ref={ref => {
                monthRefs.current.set(`${year}-${date.month}`, ref);
                if (isLastElement) lastMonthElementRef.current = ref;
              }}
              data-date={JSON.stringify(date)}
              className="mb-12 bg-black rounded-lg shadow-lg p-6"
            >
              <h2 className="text-3xl font-bold text-center mb-6">{monthName} {year}</h2>
              <div className="grid grid-cols-7 gap-4 text-center">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="font-semibold text-gray-400">{day}</div>
                ))}
                {Array.from({ length: getFirstDayOfMonth(year, date.month) }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24 md:h-40"></div>
                ))}
                {Array.from({ length: getDaysInMonth(year, date.month) }).map((_, day) => {
                  const dayNumber = day + 1;
                  const currentDate = new Date(year, date.month, dayNumber);
                  const dateKey = currentDate.toDateString();
                  const journalEntry = journalEntriesByDate.get(dateKey);

                  return (
                    <div
                      key={day}
                      className={`h-24 md:h-40 border border-gray-800 rounded-lg p-2 flex flex-col items-center justify-start relative overflow-hidden ${journalEntry ? 'cursor-pointer' : ''}`}
                      onClick={() => journalEntry && handleOpenModal(journalEntry)}
                    >
                      <span className="mb-2 z-10">{dayNumber}</span>
                      {journalEntry && (
                        <img src={journalEntry.imgUrl} alt="Journal Entry" className="w-full h-full object-cover absolute top-0 left-0 opacity-50 hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
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
