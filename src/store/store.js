import { create } from 'zustand';

const usePriceStore = create((set, get) => ({
  // State
  priceData: [],
  loading: false,
  error: null,
  lastConnectedAccount: null,

  // Actions
  collectPrice: async (ethPrice) => {
    try {
      set({ loading: true, error: null });

      // Validate ETH price format
      if (typeof ethPrice !== 'number' || ethPrice <= 0) {
        throw new Error('Invalid ETH price format');
      }

      // Add new price data with wallet info
      set((state) => ({
        priceData: [
          ...state.priceData,
          {
            id: Date.now(),
            ethPrice,
            timestamp: new Date().toISOString(),
            validated: false,
            walletAddress: window.ethereum.selectedAddress,
            networkId: window.ethereum.networkVersion,
          },
        ],
        loading: false,
        lastConnectedAccount: window.ethereum.selectedAddress,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
      throw error; // Re-throw to handle in component
    }
  },

  validatePrice: (priceId) => {
    try {
      const { priceData } = get();
      const priceEntry = priceData.find((entry) => entry.id === priceId);

      if (!priceEntry) {
        throw new Error('Price entry not found');
      }

      // Add validation logic
      const isValid = priceEntry.ethPrice > 0 && priceEntry.ethPrice < 1000;

      if (!isValid) {
        throw new Error('Price validation failed');
      }

      // Update validated status
      set((state) => ({
        priceData: state.priceData.map((entry) =>
          entry.id === priceId
            ? {
                ...entry,
                validated: true,
                validatedAt: new Date().toISOString(),
              }
            : entry
        ),
      }));

      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  // Reset store
  resetStore: () => {
    set({
      priceData: [],
      loading: false,
      error: null,
    });
  },
}));

export default usePriceStore;
