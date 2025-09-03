import React from 'react';

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

const JournalModal = ({ entries, startIndex, onClose }) => {
  if (startIndex === null) return null;

  const modalRef = React.useRef(null);

  React.useEffect(() => {
    if (modalRef.current) {
      const scrollAmount = modalRef.current.offsetWidth * startIndex;
      modalRef.current.scrollTo({ left: scrollAmount, behavior: 'instant' });
    }
  }, [startIndex]);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl z-20"
      >
        <div className="w-5 h-0.5 bg-black rotate-45 absolute"></div>
        <div className="w-5 h-0.5 bg-black -rotate-45 absolute"></div>
      </button>

      <div
        ref={modalRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory md:h-auto"
      >
        {entries.map((entry, index) => {
          const [day, monthStr] = entry.date.split('/');
          const monthIndex = parseInt(monthStr, 10) - 1;
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const formattedDate = `${day.padStart(2, '0')} ${monthNames[monthIndex]}`;
          return (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center"
            >
              <div
                className="bg-white text-black rounded-lg shadow-xl max-w-sm w-full relative"
              >
                <img src={entry.imgUrl} alt="Journal Entry" className="w-full h-80 object-cover rounded-t-lg" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-200 text-pink-800 font-bold text-lg mr-3">
                              DC
                          </div>
                          <div>
                              <h2 className="text-xl font-bold">{formattedDate}</h2>
                          </div>
                      </div>
                      <StarRating rating={entry.rating} />
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
                  <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    View full Post
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JournalModal;
