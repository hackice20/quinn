import { useState } from 'react';
import Calendar from './components/Calendar';
import BottomNavBar from './components/BottomNavBar';
import FloatingActionButton from './components/FloatingActionButton';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));

  const handleMonthChange = (date) => {
    setCurrentDate(date);
  };

  const title = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-20 px-4 py-2">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
            <button className="text-2xl font-bold">&larr;</button>
            <div className="text-center">
                <span className="text-blue-500 font-bold">my</span>
                <span className="font-light"> hair diary</span>
            </div>
            <h1 className="font-bold">{title}</h1>
        </div>
      </nav>
      <main>
        <Calendar currentDate={currentDate} onMonthChange={handleMonthChange} />
      </main>
      <BottomNavBar />
      <FloatingActionButton />
    </div>
  )
}

export default App;
