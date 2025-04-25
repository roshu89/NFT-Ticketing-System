import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navigation from './components/Navigation';
import Sort from './components/Sort';
import Card from './components/Card';
import SeatChart from './components/SeatChart';
import { TokenMasterABI, TokenMasterAddress } from './abis/TokenMasterConfig';

function App() {
  const [account, setAccount] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBlockchainData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const defaultProvider = new ethers.providers.JsonRpcProvider(
        'https://volta-rpc.energyweb.org'
      );
      const tokenMaster = new ethers.Contract(
        TokenMasterAddress,
        TokenMasterABI,
        defaultProvider
      );
      setTokenMaster(tokenMaster);

      const totalOccasions = await tokenMaster.eventId();
      const occasions = [];

      for (var i = 1; i <= totalOccasions; i++) {
        const occasion = await tokenMaster.getEvent(i);
        occasions.push(occasion);
      }
      setOccasions(occasions);

      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
          toast.info('Account changed successfully');
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
      setError('Failed to load blockchain data. Please try again later.');
      toast.error('Failed to load blockchain data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (type, value) => {
    // Handle sorting logic here
    console.log(`Sorting by ${type}:`, value);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />

      <header className="bg-white shadow-sm">
        <Navigation account={account} setAccount={setAccount} />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">Event</span> Tickets
          </h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Sort onSort={handleSort} />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occasion, index) => (
              <Card
                occasion={occasion}
                id={index + 1}
                tokenMaster={tokenMaster}
                account={account}
                toggle={toggle}
                setToggle={setToggle}
                setOccasion={setOccasion}
                key={index}
              />
            ))}
          </div>
        )}

        {toggle && (
          <SeatChart
            occasion={occasion}
            tokenMaster={tokenMaster}
            setToggle={setToggle}
          />
        )}
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TokenMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
