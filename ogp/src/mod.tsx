import { render } from "takumi-js";
import { writeFile } from "node:fs/promises";
import Banner from "./banner";
import fonts from "./fonts";

const dpr = 2
const image = await render(<Banner/>,
    { 
        width: 1200 * dpr, 
        height: 630 * dpr, 
        devicePixelRatio: dpr,
        fonts,
        format: "webp"
    },
);

await writeFile("./dist/ogp-banner.webp", image);