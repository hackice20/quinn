import React from 'react';
const CategoryIcons = ({ categories }) => {
    const categoryStyles = {
        "Deep Conditioning": { abbr: "DC", color: "bg-pink-200" },
        "Protein Treatment": { abbr: "Pr", color: "bg-yellow-200" },
        "Wash Day": { abbr: "W", color: "bg-indigo-200" },
        "Protective Style": { abbr: "P", color: "bg-purple-200" },
        "Braids": { abbr: "B", color: "bg-teal-200" },
        "Scalp Care": { abbr: "S", color: "bg-green-200" },
    };
    return (
        <div className="flex space-x-2">
            {categories.slice(0, 3).map(cat => {
                const style = categoryStyles[cat] || { abbr: cat.substring(0, 1), color: "bg-gray-400" };
                return (
                    <div key={cat} className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-800 text-sm font-bold ${style.color}`}>
                        {style.abbr}
                    </div>
                );
            })}
        </div>
    );
};
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="text-blue-500">★</span>);
  }
  const emptyStars = 5 - fullStars;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
  }
  return <div className="flex">{stars}</div>;
};
const JournalModal = ({ entry, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  if (!entry) return null;
  const [day, monthStr] = entry.date.split('/');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${day.padStart(2, '0')} ${monthNames[monthIndex]}`;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 p-4"
    >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl z-10"
        >
          <div className="w-5 h-0.5 bg-black rotate-45 absolute"></div>
          <div className="w-5 h-0.5 bg-black -rotate-45 absolute"></div>
        </button>
      <div className="w-full h-full flex items-center justify-center" onClick={onClose}>
        {hasPrev && (
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="text-white text-5xl opacity-75 hover:opacity-100 mr-4"
            >
                &#x2039;
            </button>
        )}
        <div
            className="bg-white text-black rounded-lg shadow-xl max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
        >
            <img src={entry.imgUrl} alt="Journal Entry" className="w-full h-80 object-cover rounded-t-lg" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <CategoryIcons categories={entry.categories} />
                    <StarRating rating={entry.rating} />
                </div>
                <h2 className="text-xl font-bold">{formattedDate}</h2>
                <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
            </div>
        </div>
        {hasNext && (
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="text-white text-5xl opacity-75 hover:opacity-100 ml-4"
            >
                &#x203A;
            </button>
        )}
      </div>
    </div>
  );
};
export default JournalModal;
