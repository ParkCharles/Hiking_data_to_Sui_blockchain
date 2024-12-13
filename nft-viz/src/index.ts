// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiClient } from "@mysten/sui.js/client";
import { bcs } from "@mysten/sui.js/bcs";
import {
    isValidSuiObjectId,
    isValidSuiAddress,
    fromB64,
    fromHEX,
    toHEX,
} from "@mysten/sui.js/utils";
import * as baseX from "base-x";

const SANMOVE_PACKAGE = "0xf16cd34e4a52cf9188ea2cbcb2f07103e0c54bf1c160a8f8c12c170f1ca70f80";
const BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const b36 = baseX(BASE36);

// Object definitions that mirror the on chain ones
type Color = {
    r: number;
    g: number;
    b: number;
};

type Sanmover = {
    id: string;
    color: Color;
    sides: number;
};

// Define UID as a 32-byte array, then add a transform to/from hex strings.
const UID = bcs.fixedArray(32, bcs.u8()).transform({
    input: (id: string) => fromHEX(id),
    output: (id) => toHEX(Uint8Array.from(id)),
});

const ColorStruct = bcs.struct("Color", {
    r: bcs.u8(),
    g: bcs.u8(),
    b: bcs.u8(),
});

const SanmoverStruct = bcs.struct("Sanmover", {
    id: UID,
    color: ColorStruct,
    sides: bcs.u8(),
});

export async function getSanmover(objectId: string): Promise<Sanmover | null> {
    const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
    const obj = await client.getObject({
        id: objectId,
        options: { showBcs: true, showType: true },
    });

    console.log("sanmover object:", obj);

    if (
        obj.data &&
        obj.data.bcs &&
        obj.data.bcs.dataType === "moveObject" &&
        obj.data.type === sanmoverType()
    ) {
        let struct = SanmoverStruct.parse(fromB64(obj.data.bcs.bcsBytes));
        console.log("struct", struct);
        return struct as Sanmover;
    }

    return null;
}

function sanmoverType(): string {
    return SANMOVE_PACKAGE + "::sanmove::Sanmover";
}

export async function drawSanmover(sanmover: Sanmover) {
    const radius = 50;
    const centerX = 100;
    const centerY = 100;
    const sides = sanmover.sides;
    const angle = (Math.PI * 2) / sides;
    const offset = -Math.PI / 2;
    const color = colorString(sanmover.color);

    // Change the css color variable.
    document.documentElement.style.setProperty("--color", `${color}`);

    // Draw the polygon.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    svg.setAttribute("id", "sanmove");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // add to the picture div
    document.getElementById("picture").appendChild(svg);

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("fill", `rgb(${color})`);
    let points = "";
    for (let i = 0; i < sides; i++) {
        points += `${centerX + radius * Math.cos(angle * i + offset)},${
            centerY + radius * Math.sin(angle * i + offset)
        } `;
    }
    polygon.setAttribute("points", points);

    const animation = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
    animation.setAttribute("attributeName", "transform");
    animation.setAttribute("begin", "0s");
    animation.setAttribute("dur", "10s");
    animation.setAttribute("type", "rotate");
    animation.setAttribute("from", "0 100 100");
    animation.setAttribute("to", "360 100 100");
    animation.setAttribute("repeatCount", "indefinite");

    polygon.appendChild(animation);
    svg.appendChild(polygon);
}

function colorString(color: Color): string {
    return `${color.r}, ${color.g}, ${color.b}`;
}

type Path = {
    subdomain: string;
    path: string;
};

function getSubdomainAndPath(scope: string): Path | null {
    // At the moment we only support one subdomain level.
    const url = new URL(scope);
    const hostname = url.hostname.split(".");

    if (hostname.length === 3 || (hostname.length === 2 && hostname[1] === "localhost")) {
        // Accept only one level of subdomain eg `subdomain.example.com` or `subdomain.localhost` in
        // case of local development
        const path = url.pathname == "/" ? "/index.html" : removeLastSlash(url.pathname);
        return { subdomain: hostname[0], path } as Path;
    }
    return null;
}

/** Remove the last forward-slash if present
 * Resources on chain are only stored as `/path/to/resource.extension`.
 */
function removeLastSlash(path: string): string {
    return path.endsWith("/") ? path.slice(0, -1) : path;
}

function subdomainToObjectId(subdomain: string): string | null {
    const objectId = "0x" + toHEX(b36.decode(subdomain.toLowerCase()));
    console.log(
        "obtained object id: ",
        objectId,
        isValidSuiObjectId(objectId),
        isValidSuiAddress(objectId),
    );
    return isValidSuiObjectId(objectId) ? objectId : null;
}

function notFound() {
    // Display a not found message.
    const notFound = document.createElement("h2");
    notFound.innerText = "sorry, not a valid sanmover";
    document.getElementById("picture").appendChild(notFound);
}

(function main() {
    // Get the origin url of the page
    const url = window.location.origin;
    const parsedUrl = getSubdomainAndPath(url);
    if (!parsedUrl) {
        notFound();
        return;
    }

    const objectId = subdomainToObjectId(parsedUrl.subdomain);
    if (!objectId) {
        notFound();
        return;
    }

    getSanmover(objectId).then((sanmover) => {
        if (!sanmover) {
            notFound();
            return;
        }
        console.log("sanmover: ", sanmover);
        drawSanmover(sanmover);
        const title = document.createElement("h1");
        title.innerText = "your NFT";
        document.getElementById("text").appendChild(title);

        const line1 = document.createElement("p");
        line1.innerHTML =
            "색과 도형의 모양은 랜덤하게 생성되었습니다. \
            </br>당신의 등산 경험을 세상에 하나밖에 없는 NFT와 함께 간직하세요.";
        document.getElementById("text").appendChild(line1);
    });
})();
