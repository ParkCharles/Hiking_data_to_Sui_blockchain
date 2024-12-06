#[allow(lint(custom_state_change))]
module devnet::hiking_nft {

    /// NFT 구조체
    public struct NFT has key, store {
        id: UID,                            // 고유 ID
        name: vector<u8>,                   // NFT 이름
        description: vector<u8>,            // NFT 설명
        url: vector<u8>,                    // NFT 메타데이터 URL
        creator: address,                   // NFT를 생성한 사용자 주소
    }

    public fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext,
    ): NFT {
        NFT {
            id: object::new(ctx),
            name,
            description,
            url,
            creator: tx_context::sender(ctx),
        }
    }
    /// NFT 전송 함수
    public entry fun transfer_nft(nft: NFT, recipient: address) {
        transfer::transfer(nft, recipient);
    }
}