import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'
import { TokenMasterABI, TokenMasterAddress } from './abis/TokenMasterConfig'

function App() {
  
  const [account, setAccount] = useState(null)
  
  const [tokenMaster, setTokenMaster] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {

    const defaultProvider = new ethers.providers.JsonRpcProvider("https://volta-rpc.energyweb.org");
    // console.log('default provideR: ', defaultProvider)

    const tokenMaster = new ethers.Contract(TokenMasterAddress, TokenMasterABI, defaultProvider);
    setTokenMaster(tokenMaster)

    const totalOccasions = await tokenMaster.eventId()
    const occasions = []
    
    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await tokenMaster.getEvent(i)
      occasions.push(occasion)
    }
    setOccasions(occasions)

 
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
      })
    
    
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />

        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
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

      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;