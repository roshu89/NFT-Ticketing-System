const Seat = ({
  i,
  step,
  columnStart,
  maxColumns,
  rowStart,
  maxRows,
  seatsTaken,
  buyHandler,
  isSelected,
  isLoading,
}) => {
  const seatNumber = i + step;
  const isTaken = seatsTaken.find((seat) => Number(seat) === seatNumber);

  const getSeatStyle = () => {
    const baseStyle = {
      gridColumn: `${(i % maxColumns) + 1 + columnStart}`,
      gridRow: `${Math.ceil((i + 1) / maxRows) + rowStart}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '4px',
      cursor: isTaken ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      fontWeight: '500',
    };

    if (isTaken) {
      return {
        ...baseStyle,
        backgroundColor: '#E5E7EB',
        color: '#9CA3AF',
        border: '1px solid #D1D5DB',
      };
    }

    if (isSelected) {
      return {
        ...baseStyle,
        backgroundColor: '#3B82F6',
        color: 'white',
        border: '1px solid #2563EB',
        transform: 'scale(1.05)',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: 'white',
      color: '#4B5563',
      border: '1px solid #E5E7EB',
      '&:hover': {
        backgroundColor: '#F3F4F6',
        borderColor: '#D1D5DB',
      },
    };
  };

  return (
    <div
      onClick={() => !isTaken && buyHandler(seatNumber)}
      style={getSeatStyle()}
      className={`seat ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        seatNumber
      )}
    </div>
  );
};

export default Seat;
