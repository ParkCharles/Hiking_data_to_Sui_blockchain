import {useState} from 'react'

const App = () => {
  const [name, setName] = useState('');                               // NFT 이름 상태
  const [description, setDescription] = useState('');                 // NFT 설명 상태
  const [url, setUrl] = useState('');                                 // 외부 리소스 URL 상태
  const [wallet, setWallet] = useState('');             // 지갑 주소 상태
  const [file, setFile] = useState<File | null>(null);              // GPX에서 추출한 waypoints 저장

  // 기본정보 입력
  const handleSubmit = async () => {
    if (!name || !description || !url || !wallet || !file) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('url', url);
    formData.append('wallet', wallet);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert(`NFT 생성 성공: Transaction ID - ${result.txId}`);
    } catch (error) {
      console.error('에러 발생:', error);
      alert('NFT 생성 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <div>
      <h1>NFT 생성 테스트</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label>
          NFT 이름:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          설명:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          URL:
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <br />
        <label>
          지갑 주소:
          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} />
        </label>
        <br />
        <label>
          GPX 파일:
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

  
  export default App;