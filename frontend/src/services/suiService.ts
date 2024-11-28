import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/bcs';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// SUI Devnet 설정
const rpcUrl = getFullnodeUrl('devnet');
const client = new SuiClient({ url: rpcUrl });

// Keypair 생성 (임시)
const keypair = Ed25519Keypair.generate();

export const fetchSuiBalance = async (address: string): Promise<string> => {
  try {
    const coins = await client.getCoins({ owner: address });
    if (coins.data.length > 0) {
      return coins.data[0].balance.toString();
    } else {
      return 'No balance found';
    }
  } catch (error: any) {
    console.error('Error fetching balance:', error.message);
    throw new Error('Failed to fetch balance');
  }
};

export const mintNFT = async (name: string, description: string, url: string): Promise<{ txId: string }> => {
  try {
    // 트랜잭션 객체 생성
    const tx = new Transaction();

    // 문자열을 BCS로 직렬화하여, 매개변수로 쓸 수 있게 변환
    const nameArg = bcs.string.arguments(name);
    const descriptionArg = bcs.string.arguments(description);
    const urlArg = bcs.string.arguments(url);


    // moveCall에서 사용하는 인자들을 TransactionArgument로 변환
    tx.moveCall({
      target: '0x2::devnet_nft::mint',
      arguments: [nameArg, descriptionArg, urlArg],
    });

    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true },
    });

    return { txId: result.digest };
  } catch (error: any) {
    console.error('Error minting NFT:', error.message);
    throw new Error('Failed to mint NFT');
  }
};