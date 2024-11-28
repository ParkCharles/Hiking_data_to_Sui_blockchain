import React, { useState } from 'react';
import { mintNFT } from '../services/nftService';

const NFTForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await mintNFT({ name, description, url });
            alert(`NFT 발행 성공! NFT ID: ${result.nft_id}`);
        } catch (error) {
            alert(`NFT 발행 실패: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="NFT Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="NFT Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="NFT URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <button type="submit">NFT Publish</button>
        </form>
    );
};

export default NFTForm;