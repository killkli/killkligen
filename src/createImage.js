import { registerFont, make, decodePNGFromStream, encodePNGToStream } from 'pureimage';
import formatTitle from "./image_utils/format-title.js";
import { createReadStream } from "fs";
import getStream from "get-stream"
import { PassThrough } from "stream";

/**
 * Given a post with a title and an author, generate an image and save it to
 * file, returning the absolute path to the file.
 *
 * @param {object} post Post object containing a title and author
 * @returns string
 */
export const generateImage = async (post) => {
    const titleText = formatTitle(post.title);

    const width = 1200;
    const height = 627;
    const titleY = titleText.length === 2 ? 300 : 350;
    const titleLineHeight = 100;
    const authorY = titleText.length === 2 ? 525 : 500;
    // const pathtoFont = "../assets/fonts/iansui.ttf"
    const finalFontPath = "../assets/fonts/iansui.ttf"
    // const pathtoLogo = require('assets/killkli.png').default;
    const finalLogoPath = "../assets/killkli.png"
    await registerFont(finalFontPath, { family: "test" }).loadPromise();
    const canvas = make(width, height);
    const context = canvas.getContext("2d");

    const darkgreen = "#AED699";
    context.fillStyle = darkgreen; // darkgreen color
    context.fillRect(0, 0, width, height);

    context.font = "70px test";
    context.textAlign = "center";
    context.fillStyle = "#040";

    const image = await decodePNGFromStream(createReadStream(finalLogoPath));
    context.drawImage(image, 400, -80, image.width / 3, image.height / 3);
    context.fillText(titleText[0], 600, titleY);
    if (titleText[1])
        context.fillText(titleText[1], 600, titleY + titleLineHeight);

    context.font = "40px test";
    context.fillText(`by ${post.author}`, 600, authorY);
    const stream = new PassThrough();
    encodePNGToStream(canvas, stream);
    const buffer = await getStream.buffer(stream);
    return buffer;
}