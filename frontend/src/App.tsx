import { useState, useEffect } from 'react'
import { mintNFT, fetchSuiBalance } from './services/suiService';
import './App.css'

// 생성된 NFT의 Default 주소 
const address = '0xc94742f9bc07ef9c2849120819ec8955eecaf6a2dd9f2b78ee1d47f0d693b304';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 잔액 조회
  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await fetchSuiBalance(address);
      setBalance(balance);
    };
    fetchBalance();
  }, []);
  
  // NFT 민팅
  const handleMintNFT = async () => {
    if (!name || !description || !url) {
      setMintStatus('Please provide all fields.');
      return;
    }

    setIsLoading(true);
    setMintStatus(null);

    try {
      const result = await mintNFT(name, description, url);
      setMintStatus(`NFT Minted Seccessfully! Transaction ID: ${result.txId}`);
    } catch (error: any) {
      setMintStatus(`Error minting NFT: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Mint Your NFT</h1>

      {/* NFT 민팅 입력폼 */}
      <div>
        <input
          type="text"
          placeholder="Enter NFT Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter NFT Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter NFT URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleMintNFT} disabled={isLoading}>
          {isLoading ? 'Minting...' : 'Mint NFT'}
          </button>
      </div>

      {/* 민팅 상태 표시 */}
      {mintStatus && <p>{mintStatus}</p>}

      {/* 잔액 표시 */}
      <div>
        <h2>SUI Wallet Balance</h2>
        {balance ? <p>Balance: {balance} SUI</p> : <p>Loading balance...</p>}
      </div>
    </div>
  );
}

export default App