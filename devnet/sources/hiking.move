module devnet::hiking_nft {
    use sui::url::{Self, Url};
    use sui::event;
    use std::string;

    // ===== 구조체 정의 =====
    /// NFT 구조체
    public struct HikingNFT has key, store {
        id: UID,                                // 고유 ID
        name: string::String,                   // NFT 이름
        description: string::String,            // NFT 설명
        url: Url,                               // NFT 메타데이터 URL
        route_metadata: string::String,         // 경로 메타데이터
    }

    /// NFTMinted 이벤트 구조체
    public struct NFTMinted has copy, drop {    // NFT가 성공적으로 발행되었음을 기록하는 이벤트
        object_id: ID,                          // NFT Object ID
        creator: address,                       // NFT 발행자(주소)
        name: string::String,                   // NFT 이름
    }

    // ===== 헬퍼 함수 =====
    /// 오류 코드 정의
    const EValueMissing: u64 = 1;

    /// 입력값 검증 함수
    fun validate_inputs(name: &vector<u8>, description: &vector<u8>, url: &vector<u8>) {
        assert!(!name.is_empty(), EValueMissing);
        assert!(!description.is_empty(), EValueMissing);
        assert!(!url.is_empty(), EValueMissing);
    }

    // ===== Entrypoint 함수 =====
    /// NFT 생성 함수
    public fun mint_to_creator(
        creator: address,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        route_metadata: vector<u8>,
        ctx: &mut TxContext
    ) {
        // 입력값 검증
        validate_inputs(&name, &description, &url);

        // NFT 생성
        let nft = HikingNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            route_metadata: string::utf8(route_metadata),
        };

        // 이벤트 emit
        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator,
            name: nft.name,
        });

        // NFT 전송
        transfer::public_transfer(nft, creator);
    }

    /// NFT 전송 함수
    public fun transfer(
        nft: HikingNFT,
        recipient: address,
        _: &mut TxContext,
    ) {
        transfer::public_transfer(nft, recipient);
    }

    /// NFT 설명 업데이트
    public fun update_description(
        nft: &mut HikingNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description);
    }

    /// NFT 소각 함수
    public fun burn(nft: HikingNFT, _: &mut TxContext) {
        let HikingNFT { id, name: _, description: _, url: _, route_metadata: _ } = nft;
        id.delete();
    }

    // ===== Getters =====
    /// NFT 이름 조회
    public fun name(nft: &HikingNFT): &string::String {
        &nft.name
    }

    /// NFT 설명 조회
    public fun description(nft: &HikingNFT): &string::String {
        &nft.description
    }

    /// NFT URL 조회
    public fun url(nft: &HikingNFT): &Url {
        &nft.url
    }

    /// NFT 경로 메타데이터 조회
    public fun route_metadata(nft: &HikingNFT): &string::String {
        &nft.route_metadata
    }
}