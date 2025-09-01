import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
  }

  if (halfStar) {
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-600">★</span>);
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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-lg shadow-xl max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full bg-black bg-opacity-50 rounded-full p-2 text-2xl md:text-3xl hover:bg-opacity-75 z-10"
          >
            &#x25C0;
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full bg-black bg-opacity-50 rounded-full p-2 text-2xl md:text-3xl hover:bg-opacity-75 z-10"
          >
            &#x25B6;
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 text-2xl hover:bg-opacity-75 z-10"
        >
          &times;
        </button>
        <img src={entry.imgUrl} alt="Journal Entry" className="w-full h-64 object-cover rounded-t-lg" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold">{formattedDate}</h2>
            <StarRating rating={entry.rating} />
          </div>
          <p className="text-gray-400 mb-6 text-sm">{entry.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
