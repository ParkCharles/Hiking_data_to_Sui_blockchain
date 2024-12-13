// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_SANMOVE_PACKAGE_ID, MAINNET_SANMOVE_PACKAGE_ID } from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            sanmovePackageId: TESTNET_SANMOVE_PACKAGE_ID,
        },
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            sanmovePackageId: MAINNET_SANMOVE_PACKAGE_ID,
        },
    },
});

export { useNetworkVariable, useNetworkVariables, networkConfig };
