module devnet::my_nft {
    use std::string::{Self, String};
    use sui::package;
    use sui::display;

    /// NFT 구조체
    public struct NFT has key, store {
        id: UID,                            // 고유 ID
        name: String,                       // NFT 이름
        description: String,                // NFT 설명
        url: String,                        // NFT 메타데이터 URL
        creator: String,                    // NFT를 생성한 사용자 주소
    }

    /// One-Time-Witness for the module.
    /// must drop and same as module name but capitalize
    public struct MY_NFT has drop {}
    
    fun init(otw: MY_NFT, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"url"),
            string::utf8(b"creator"),
        ];

        let values = vector[
            // For `name` we can use the `NFT.name` property
            string::utf8(b"{name}"),
            // Description is static for all `NFT` objects.
            string::utf8(b"{description}"),
            // For `image_url` we use an ipfs :// + `url` or https:// + `url`.
            string::utf8(b"{url}"),
            // Address field can be any
            string::utf8(b"{creator}")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `NFT` type.
        let mut display = display::new_with_fields<NFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Anyone can mint their `NFT`!
    public entry fun mint(
        name: String,
        description: String,
        url: String,
        creator: String,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);

        let nft = NFT { 
            id, 
            name, 
            description,
            url,
            creator
        };

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: NFT) {
        let NFT {
            id,
            name: _ ,
            description: _ ,
            url: _ ,
            creator:_
        } = nft;
        object::delete(id);
    }
}