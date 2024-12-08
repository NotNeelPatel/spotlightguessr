import { getCountryFromText } from "./countries.js";

var resetCounter = 0;

export async function reset() {
    // Reset elements
    const mainImgContainer = document.querySelector(".main-img-container");
    const mainTxtContainer = document.querySelector(".main-txt-container");
    const popup = document.querySelector(".answer-popup");
    popup.style.visibility = "hidden";
    const existingImages = mainImgContainer.querySelectorAll("img");
    existingImages.forEach((img) => img.remove());
    const existingAnchor = mainTxtContainer.querySelectorAll("a");
    existingAnchor.forEach((a) => a.remove());

    // Get an image, try again if it fails to get image
    // Try 3 times before giving up
    let candidate;
    candidate = await getCandidate();
    if (candidate === undefined && resetCounter < 3) {
        resetCounter++;
        await delay(100);
        return reset();
    } else {
        resetCounter = 0;
    }

    // Once we obtain an image, display it, and return the candidate
    // candidate = [windows spotlight url for the image, country]
    const response = await fetch(candidate[0]);
    const randomIndex = randomInt(10, 200);
    await delay(randomIndex);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const image = doc.querySelector("img");
    const imageSrc = image.src;
    const imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    document.body.appendChild(imageElement);
    mainImgContainer.appendChild(imageElement);
    return candidate;
}

// Tag filter for unwanted images
const tag_filter = [
    "tag-wildlife",
    "tag-animals",
    "tag-close-up",
    "tag-closeup",
    "tag-underwater",
    "tag-artwork",
    "tag-indoors",
    "tag-interior",
    "tag-birds",
    "tag-abstract"
];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCandidate() {
    /*
     * There are over 1000 pages to select from the website.
     * We select a page instead of an image because
     * it gives us a handful of images to choose from,
     * and individual images cannot be easily found
     * as the URLs do not nicely increment as one might suspect.
     */
    var randomIndex = randomInt(0, 1181);
    const response = await fetch(
        `https://windows10spotlight.com/page/${randomIndex}`
    );
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const articles = doc.querySelectorAll("article");
    const candidates = [];
    var isUnfiltered = true;

    /*
     * Finding a suitable candidate involves:
     * 1. Filtering out images with unwanted tags
     * 2. Identifying if there is a country in the description
     * 3. Extracting the image URL and country
     * 4. Returning a random candidate from the ones that made it through
     */
    for (let i = 0; i < articles.length; i++) {
        const description = articles[i].textContent;
        const tags = articles[i].outerHTML.match(/\btag(?:-\w+)+\b/g);

        // Filter out images with unwanted tags
        for (let tag of tags) {
            if (tag_filter.includes(tag.trim())) {
                isUnfiltered = false;
                break;
            }
        }

        // Identify if there is a country in the description
        if (isUnfiltered) {
            const country = getCountryFromText(description);
            if (country) {
                const candidate = articles[i].innerHTML.match(
                    /https:\/\/windows10spotlight\.com\/images\/\S+?(?=")/
                );
                if (candidate) {
                    candidates.push([candidate[0], country]);
                }
            }
        }
        isUnfiltered = true;
    }
    if (candidates.length === 0) {
        return undefined;
    }
    // Return a random candidate
    randomIndex = randomInt(0, candidates.length);
    return candidates[randomIndex];

    //return ["test2.html", "USA"]; // for debugging
}
