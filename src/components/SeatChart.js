import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ occasion, tokenMaster, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {
    if (window.ethereum) {
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  
      try {
        // Request wallet connection
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(accounts)
        if (accounts.length === 0) {
          // No accounts connected
          window.alert("Please connect your wallet to proceed.");
          return;
        }
  
        // Proceed only if userProvider is available
        if (userProvider) {
          setHasSold(false);
  
          const signer = userProvider.getSigner();
          const transaction = await tokenMaster.connect(signer).mint(
            occasion.id,
            _seat,
            { value: occasion.cost }
          );
          await transaction.wait();
  
          setHasSold(true);
        }
      } catch (error) {
        setHasSold(false);
  
        // Handle known errors
        if (error.message.includes('Non-200 status code: 207')) {
          window.alert("Either this seat is already taken or you cannot book more than 1 ticket for an event.");
        } else if (error.message.includes("Internal JSON-RPC error.")) {
          window.alert("Either this seat is already taken or you cannot book more than 1 ticket for an event.");
        } 
        else if (error.message.includes("Request of type 'wallet_requestPermissions'")) {
          window.alert("Please connect your web3 wallet!");
        } else {
          // Generic fallback
          window.alert("Transaction failed. Please try again.");
        }
      }
    } else {
      // No Web3 provider detected
      window.alert("Please install and connect a Web3 provider like MetaMask.");
    }
  };
  

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(occasion.tickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(occasion.tickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;