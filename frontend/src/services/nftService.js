export const mintNFT = async ({ name, description, url }) => {
    const data = { name, description, url };

    const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mint NFT');
    }

    return await response.json();
};