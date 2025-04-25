import { ethers } from 'ethers';
import { useState } from 'react';

const Card = ({ occasion, toggle, setToggle, setOccasion }) => {
  const [isHovered, setIsHovered] = useState(false);

  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ${
        isHovered ? 'transform -translate-y-1 shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">{formatDate(occasion.date)}</p>
            <p className="text-sm text-gray-500">{formatTime(occasion.time)}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {occasion.tickets.toString()} tickets left
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {occasion.name}
        </h3>

        <p className="text-gray-600 mb-4">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {occasion.location}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-blue-600">
            {ethers.utils.formatUnits(occasion.cost.toString(), 'ether')}
            <span className="text-sm text-gray-500 ml-1">ETH</span>
          </p>

          {occasion.tickets.toString() === '0' ? (
            <button
              type="button"
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
              disabled
            >
              Sold Out
            </button>
          ) : (
            <button
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={togglePop}
            >
              View Seats
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
