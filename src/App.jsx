import { useState } from 'react';
import Calendar from './components/Calendar';

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
    <div className="bg-black text-white min-h-screen">
      <nav className="bg-black shadow-lg sticky top-0 z-10">
        <h1 className="text-4xl text-center p-4">{title}</h1>
      </nav>
      <main>
        <Calendar onMonthChange={handleMonthChange} />
      </main>
    </div>
  )
}

export default App;
