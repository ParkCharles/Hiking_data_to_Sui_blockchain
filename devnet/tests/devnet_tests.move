#[test_only]
module devnet::tests {
    use devnet::hiking_nft;

    #[test]
    public fun test_mint_and_transfer() {
        let mut ctx = tx_context::new(
            @0x1,                               // sender address
            b"test_digest",                    // mock digest
            0x2,                                 // mock gas_object ID
            1000000,                // mock gas_budget
            1                              // mock gas_price           
        );
        
        // NFT 생성
        let nft = hiking_nft::mint_nft(
            b"Mountain NFT",
            b"This is a hiking NFT",
            b"https://example.com/waypoints.json",
            &mut ctx
        );

        // NFT 전송
        hiking_nft::transfer_nft(nft, @0x2);
    }
}

// #[test]
// fun test_devnet() {
//     // pass
// }

// #[test, expected_failure(abort_code = ::devnet::devnet_tests::ENotImplemented)]
// fun test_devnet_fail() {
//     abort ENotImplemented
// }

