import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import usePriceStore from '../store/store';

const Navigation = ({ account, setAccount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { collectPrice, priceData } = usePriceStore();

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.log('MetaMask is not installed!');
    }
  }, []);

  const connectHandler = async () => {
    try {
      setIsLoading(true);

      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);

        // Get ETH balance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance));

        // Store price data
        await collectPrice(ethBalance);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  const renderWalletInfo = () => {
    const latestPrice = priceData[priceData.length - 1];

    return (
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-xs sm:text-sm">
          <span className="text-gray-600">Balance: </span>
          <span className="font-medium">
            {latestPrice?.ethPrice.toFixed(4)} ETH
          </span>
        </div>
        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm">
          {account?.slice(0, 6)}...{account?.slice(-4)}
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
                TokenMaster
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4 flex-1 px-4">
              <div className="relative flex-1 max-w-lg mx-4">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Find millions of experiences"
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              <ul className="hidden lg:flex lg:space-x-8">
                {['concerts', 'sports', 'arts', 'more'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavigation(item)}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      {item === 'arts'
                        ? 'Arts & Theater'
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wallet Connect & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="hidden sm:block">{renderWalletInfo()}</div>
              ) : (
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 text-sm whitespace-nowrap"
                  onClick={connectHandler}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <div className="px-2 pb-3">
              <div className="relative">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Find millions of experiences"
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation */}
            {['concerts', 'sports', 'arts', 'more'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  handleNavigation(item);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item === 'arts'
                  ? 'Arts & Theater'
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}

            {/* Mobile Wallet Info */}
            {account && <div className="px-3 py-2">{renderWalletInfo()}</div>}
          </div>
        </div>
      </nav>

      {/* Content Spacer */}
      <div className="h-16" />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Navigation;
