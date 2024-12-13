// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId, fromHEX } from "@mysten/sui.js/utils";
import {
    Box,
    Container,
    Flex,
    Text,
    Heading,
    Link,
    Em,
    Separator,
    Button,
    Strong,
} from "@radix-ui/themes";
import { useState } from "react";
import { ArrowRightIcon, CopyIcon } from "@radix-ui/react-icons";
import { MintSanmove } from "./MintSanmove";
import baseX from "base-x";

const BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const b36 = baseX(BASE36);

function explorerLink(id: string): string {
    return "https://suiscan.xyz/testnet/object/" + id;
}

function sanmoverLink(id: string): string {
    return "https://" + b36.encode(fromHEX(id.substring(2))) + ".walrus.site";
}

function App() {
    const currentAccount = useCurrentAccount();
    const [sanmoverId, setSanmover] = useState(() => {
        const hash = window.location.hash.slice(1);
        return isValidSuiObjectId(hash) ? hash : null;
    });

    return (
        <>
            <Flex
                position="sticky"
                px="4"
                py="2"
                justify="between"
                style={{ borderBottom: "1px solid var(--gray-a2)" }}
            >
                <Box>
                    <ConnectButton />
                </Box>
            </Flex>
            <Container size="2">
                <Container size="1" mt="5" pt="2" px="4" style={{ minHeight: 500 }}>
                    <Flex direction="column" justify="center" gap="1">
                        <Heading size="9">
                            <Em>San Move</Em>
                        </Heading>
                        <Text size="5">등산 정보를 블록체인에 저장하는 프로젝트</Text>
                    </Flex>
                    <Flex mt="9">
                        <Text>
                            <Em>San Move</Em> 는 등산데이터 중 최고 높이의 해발고도를 찍은 순간을 NFT 형태로 블록체인에 저장해줍니다.
                        </Text>
                    </Flex>
                    <Separator my="6" size="4" />
                    <Flex direction={{ initial: "column", xs: "row" }} justify="between">
                        <Flex direction="column">
                            <Flex>
                                <Text>
                                    <Em>최근에 다녀오신 산 이름을 입력해주세요.</Em>
                                </Text>
                            </Flex>
                            <Flex>
                                {currentAccount ? (
                                    <MintSanmove
                                        onCreated={(id) => {
                                            window.location.hash = id;
                                            setSanmover(id);
                                        }}
                                    />
                                ) : (
                                    <Text>
                                        <Strong>
                                            Sui 지갑을 연결하세요. (버튼은 왼쪽 상단에 있어요)
                                        </Strong>
                                    </Text>
                                )}
                            </Flex>
                        </Flex>
                        {sanmoverId ? (
                            <Flex
                                direction="column"
                                align={{ initial: "start", xs: "end" }}
                                gap="2"
                            >
                                <Text>
                                    <Em>와우!</Em> NFT가 만들어졌습니다! (
                                    {sanmoverId.substring(0, 8)}
                                    {"... "})
                                </Text>
                                <Flex direction="row" gap="2" pb="0">
                                    <Link href={sanmoverLink(sanmoverId)}>
                                        <Button variant="solid">
                                            만들어진 NFT 보러 가기 <ArrowRightIcon />
                                        </Button>
                                    </Link>
                                    <Box pt="2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    sanmoverLink(sanmoverId),
                                                );
                                            }}
                                        >
                                            <CopyIcon />
                                        </Button>
                                    </Box>
                                </Flex>

                                <Flex direction="column">
                                    <Flex direction="row" gap="3">
                                        <Link href={explorerLink(sanmoverId)}>
                                            <Button variant="outline">
                                                Sui Scan에서 자세한 정보 확인하기 <ArrowRightIcon />
                                            </Button>
                                        </Link>
                                        <Box pt="2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        explorerLink(sanmoverId),
                                                    );
                                                }}
                                            >
                                                <CopyIcon />
                                            </Button>
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Flex>
                        ) : (
                            <></>
                        )}
                    </Flex>
                    <Separator my="6" size="4" />
                    <Flex mb="5" direction="row">
                        <Box>
                            <Heading size="5" mb="4">
                                NFT 발행 절차
                            </Heading>
                        </Box>
                        <Box>
                            <Text>
                                <ul>
                                    <li>
                                        Sui 지갑이 있으신가요? 없으시다면, 설치해주세요.
                                        Sui 블록체인에 정보를 저장하고, NFT를 발행하기 위해 필수적으로 필요합니다.
                                        <a href="https://suiwallet.com/" target="_blank">Sui 지갑 설치</a>
                                    </li>
                                    <li>
                                        설치 후, Wallet Settings에서 Network를 Testnet으로 설정해주세요.
                                        그리고 아래에 위치한 "Request Testnet SUI Tokens" 버튼을 눌러 
                                        Testnet 전용 토큰을 받아주세요. NFT를 발행할 때마다 토큰이 사용됩니다.
                                    </li>
                                </ul>
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Container>
        </>
    );
}

export default App;
