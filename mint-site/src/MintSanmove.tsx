// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Container, Flex, TextArea, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { useState } from "react";

export function MintSanmove({ onCreated }: { onCreated: (id: string) => void }) {
    const sanmovePackageId = useNetworkVariable("sanmovePackageId");
    const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
    const [mountainName, setMountainName] = useState<string>('');

    return (
        <Container my="2">
            <Container>
                <Flex direction="column" gap="3">
                    <Box style={{ maxWidth: "250px" }}>
                        <TextArea
                            size="3"
                            value={mountainName}
                            onChange={(e) => setMountainName(e.target.value)}
                            style={{ borderRadius: '8px' }}
                        />
                    </Box>
                </Flex>
            </Container>

            <Button 
                variant="surface" 
                onClick={() => create(mountainName)} 
                disabled={!mountainName.trim()}
            >
                자신만의 NFT 만들기! 
            </Button>
        </Container>
    );

    function create(mountainName: String) {
        const txb = new TransactionBlock();

        console.log("Mountain Name: ", mountainName);

        txb.moveCall({
            arguments: [txb.object("0x8"), txb.pure(mountainName)], // 0x8 is the Random Object
            target: `${sanmovePackageId}::sanmove::mint`,
        });

        signAndExecute(
            { transactionBlock: txb, options: { showEffects: true, showObjectChanges: true } },
            { onSuccess: (tx) => onSuccess(tx as SuiTransactionBlockResponse) },
        );
    }

    function onSuccess(tx: SuiTransactionBlockResponse) {
        if (tx.effects?.created === undefined) {
            return;
        }

        for (const created of tx.effects.created) {
            const objectId = created.reference?.objectId;
            const owner = created.owner;
            if (typeof owner !== "string" && "AddressOwner" in owner) {
                if (objectId) {
                    onCreated(objectId);
                    return;
                }
            }
        }
    }
}
