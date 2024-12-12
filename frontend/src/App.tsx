import { useState } from 'react';
import '@mysten/dapp-kit/dist/index.css';     // dApp Kit CSS 가져오기
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 네트워크 설정
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

const queryClient = new QueryClient();

const App = () => {
  const [name, setName] = useState('');                               // NFT 이름 상태
  const [description, setDescription] = useState('');                 // NFT 설명 상태
  const [url, setUrl] = useState('');                                 // 외부 리소스 URL 상태
  const [wallet_address, setWalletAddress] = useState('');            // 지갑 주소 상태
  const [file, setFile] = useState<File | null>(null);                // GPX 파일 업로드

  // 기본정보 입력
  const handleSubmit = async () => {
    if (!name || !description || !url || !wallet_address || !file) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    // NFT 기본 정보 전송
    const nftData = {
      name,
      description,
      url,
      wallet_address,
    };

    try {
      // NFT 기본 정보를 NFT 폴더로 전송
      const nftResponse = await fetch('http://localhost:3000/nft-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nftData),
      });

      const nftResult = await nftResponse.json();
      alert(`NFT 생성 성공: Transaction ID - ${nftResult.txId}`);
    
      // GPX 파일 업로드 (gpx 폴더로 전송)
      const formData = new FormData();
      formData.append('file', file);

      const fileResponse = await fetch('http://localhost:3000/upload-gpx', {
        method: 'POST',
        body: formData,
      });

      const fileResult = await fileResponse.json();
      alert(`파일 업로드 성공: ${fileResult.fileName}`);
    } catch (error) {
      console.error('에러 발생', error);
      alert('NFT 생성 및 파일 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider>
          <div>
            <h1>NFT 생성 테스트</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label htmlFor="nft-name">
                NFT 이름:
                <input
                  type="text"
                  id="nft-name"
                  name="nftName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <br />
              <label htmlFor="description">
                설명:
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <br />
              <label htmlFor="url">
                URL:
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>
              <br />
              <label htmlFor="wallet-address">
                지갑 주소:
                <input
                  type="text"
                  id="wallet-address"
                  name="walletAddress"
                  value={wallet_address}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </label>
              <br />
              <label htmlFor="gpx-file">
                GPX 파일:
                <input
                  type="file"
                  id="gpx-file"
                  name="gpxFile"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}  // 상태 업데이트
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;