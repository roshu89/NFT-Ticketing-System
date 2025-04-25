import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Sort = ({ onSort }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdowns = [
    {
      id: 'genre',
      label: 'Select Your Genre',
      options: ['All', 'Concerts', 'Sports', 'Arts & Theater', 'Family'],
    },
    {
      id: 'dates',
      label: 'Select Your Dates',
      options: ['Any Date', 'Today', 'This Weekend', 'This Month'],
    },
    {
      id: 'distance',
      label: 'Select Your Distance',
      options: ['All', '10 miles', '25 miles', '50 miles', '100 miles'],
    },
  ];

  const handleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSelect = (dropdownId, option) => {
    onSort && onSort(dropdownId, option);
    setOpenDropdown(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap gap-4 justify-start items-center">
        {dropdowns.map(({ id, label, options }) => (
          <div key={id} className="relative">
            <button
              onClick={() => handleDropdown(id)}
              className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{label}</span>
              <FiChevronDown
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                  openDropdown === id ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === id && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto">
                  {options.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleSelect(id, option)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sort;
