module devnet::hiking_nft {
    use std::string::String;

    /// NFT 구조체
    public struct NFT has key, store {
        id: UID,                        // 고유 ID
        name: String,                   // NFT 이름
        description: String,            // NFT 설명
        url: String,                    // NFT 메타데이터 URL
    }

    /// NFT를 생성하고, 지정된 주소로 전송
    public fun mint(
        name: String,
        description: String,
        url: String,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        // 새로운 UID 생성
        let uid = object::new(ctx);

        // NFT 객체 생성
        let nft = NFT {
            id: uid,
            name,
            description,
            url,
        };

        // NFT를 지정된 주소로 전송
        transfer::transfer(nft, recipient);
    }
}