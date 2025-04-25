import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Seat from './Seat';
import close from '../assets/close.svg';
import usePriceStore from '../store/store';

const SeatChart = ({ occasion, tokenMaster, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false);
  const [hasSold, setHasSold] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [error, setError] = useState(null);
  const { collectPrice } = usePriceStore();

  const getSeatsTaken = useCallback(async () => {
    try {
      const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id);
      setSeatsTaken(seatsTaken);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('Failed to load seat information');
    }
  }, [tokenMaster, occasion.id]);

  const buyHandler = async (_seat) => {
    if (!window.ethereum) {
      const errorMsg = 'Please install and connect MetaMask';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedSeat(_seat);

    try {
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!usePriceStore.getState().priceData.length) {
        toast.error('Please connect your wallet to proceed');
        return;
      }

      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please connect your wallet');
        return;
      }

      // Check user's balance
      const signer = userProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await userProvider.getBalance(address);

      if (balance.lt(occasion.cost)) {
        toast.error(
          `Insufficient funds. You need ${ethers.utils.formatEther(occasion.cost)} ETH`
        );
        // return
      }

      // Store current price data before transaction
      const ethPrice = parseFloat(ethers.utils.formatEther(balance));
      await collectPrice(ethPrice);

      toast.info('Confirming transaction...', {
        autoClose: false,
        toastId: 'transaction-pending',
      });

      const transaction = await tokenMaster
        .connect(signer)
        .mint(occasion.id, _seat, { value: occasion.cost });

      toast.update('transaction-pending', {
        render: 'Transaction submitted, waiting for confirmation...',
        type: toast.TYPE.INFO,
      });

      await transaction.wait();

      // Update store with reservation info
      usePriceStore.setState((state) => ({
        reservations: [
          ...(state.reservations || []),
          {
            id: Date.now(),
            occasion: occasion.name,
            seat: _seat,
            cost: ethers.utils.formatEther(occasion.cost),
            timestamp: new Date().toISOString(),
            transactionHash: transaction.hash,
          },
        ],
      }));

      setHasSold(true);
      toast.dismiss('transaction-pending');
      toast.success(`Successfully reserved seat ${_seat}!`);
    } catch (error) {
      let errorMessage = 'Transaction failed. Please try again.';

      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds in your wallet';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message.includes('Non-200 status code: 207')) {
        errorMessage = 'This seat is already taken';
      } else if (error.message.includes('wallet_requestPermissions')) {
        errorMessage = 'Please connect your wallet first';
      }

      setError(errorMessage);
      toast.error(errorMessage);
      toast.dismiss('transaction-pending');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSeatsTaken();
  }, [hasSold, getSeatsTaken]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {occasion.name} Seating Map
          </h1>
          <button
            onClick={() => setToggle(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <img src={close} alt="Close" className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
          <strong className="text-lg">STAGE</strong>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {seatsTaken &&
            Array(25)
              .fill(1)
              .map((e, i) => (
                <Seat
                  i={i}
                  step={1}
                  columnStart={0}
                  maxColumns={5}
                  rowStart={2}
                  maxRows={5}
                  seatsTaken={seatsTaken}
                  buyHandler={buyHandler}
                  isSelected={selectedSeat === i + 1}
                  isLoading={isLoading && selectedSeat === i + 1}
                  key={i}
                />
              ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
          <strong className="text-lg">WALKWAY</strong>
        </div>

        <div className="grid grid-cols-15 gap-4 mb-6">
          {seatsTaken &&
            Array(Number(occasion.tickets) - 50)
              .fill(1)
              .map((e, i) => (
                <Seat
                  i={i}
                  step={26}
                  columnStart={6}
                  maxColumns={15}
                  rowStart={2}
                  maxRows={15}
                  seatsTaken={seatsTaken}
                  buyHandler={buyHandler}
                  isSelected={selectedSeat === i + 25}
                  isLoading={isLoading && selectedSeat === i + 25}
                  key={i}
                />
              ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
          <strong className="text-lg">WALKWAY</strong>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {seatsTaken &&
            Array(25)
              .fill(1)
              .map((e, i) => (
                <Seat
                  i={i}
                  step={Number(occasion.tickets) - 24}
                  columnStart={22}
                  maxColumns={5}
                  rowStart={2}
                  maxRows={5}
                  seatsTaken={seatsTaken}
                  buyHandler={buyHandler}
                  isSelected={
                    selectedSeat === i + Number(occasion.tickets) - 25
                  }
                  isLoading={
                    isLoading &&
                    selectedSeat === i + Number(occasion.tickets) - 25
                  }
                  key={i}
                />
              ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ticket Information</h3>
          <p className="text-gray-600">
            Price: {ethers.utils.formatUnits(occasion.cost.toString(), 'ether')}{' '}
            ETH
          </p>
          <p className="text-gray-600">
            Date: {new Date(occasion.date).toLocaleDateString()}
          </p>
          <p className="text-gray-600">Time: {occasion.time}</p>
          <p className="text-gray-600">Location: {occasion.location}</p>
        </div>
      </div>
    </div>
  );
};

export default SeatChart;
