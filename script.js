import { getCountryFromText } from './countries.js';

var resetCounter = 0;

export async function reset(){
    let candidate;
    const mainImgContainer = document.querySelector(".main-img-container");
    const mainTxtContainer = document.querySelector(".main-txt-container");
    const popup = document.querySelector('.answer-popup');
    popup.style.visibility = 'hidden';
    const existingImages = mainImgContainer.querySelectorAll("img");
    existingImages.forEach(img => img.remove());
    const existingAnchor = mainTxtContainer.querySelectorAll("a");
    existingAnchor.forEach(a => a.remove());
    
    candidate = await getCandidate();
    if (candidate === undefined && resetCounter < 3) {
        resetCounter++;
        await delay(100);
        return reset();
    } else {
        resetCounter = 0;
    }
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

const tag_filter = 
[
    "tag-wildlife",
    "tag-animals",
    "tag-close-up",
    "tag-underwater",
    "tag-artwork",
    "tag-indoors",
    "tag-interior"
    
]


function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCandidate() {
    
    var randomIndex = randomInt(0, 1181);
    const response = await fetch(`https://windows10spotlight.com/page/${randomIndex}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const articles = doc.querySelectorAll("article");
    const candidates = [];
    var unfiltered = true;
    for (let i = 0; i < articles.length; i++) {
        const description = articles[i].textContent;
        const tags = articles[i].outerHTML.match(/\btag-\w+\b/g);
        
        for (let tag of tags) {
            if (tag_filter.includes(tag.trim())) {
                unfiltered = false;
            }
        }
        if (unfiltered) {
            const country = getCountryFromText(description);
            if (country){
                const candidate = articles[i].innerHTML.match(/https:\/\/windows10spotlight\.com\/images\/\S+?(?=")/);
                if (candidate) {
                    candidates.push([candidate[0], country]);
                }
            }
        }
        unfiltered = true;
    }
    randomIndex = randomInt(0, candidates.length);
    return candidates[randomIndex];
    
    //return ["test2.html", "USA"];
}