const tag_filter = 
[
    "tag-wildlife",
    "tag-animals",
    "tag-close-up",
    "tag-underwater",
    "tag-artwork",
]

var countries;
fetch("countries.json")
    .then((res) => res.json())
    .then((data) => {
        countries = data;
});


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
            for (let country of countries) {
                if (description.includes(country)) {
                    const candidate = articles[i].innerHTML.match(/https:\/\/windows10spotlight\.com\/images\/\S+?(?=")/);
                    console.log(candidate);
                    if (candidate) {
                        candidates.push([candidate[0], country]);
                    }
                    break;
                }
            }
        }
        unfiltered = true;
    }
    randomIndex = randomInt(0, candidates.length);
    return candidates[randomIndex];
    
    //return ["test2.html", "USA"];
}

var candidate;
getCandidate().then(async (candidate) => {
    const response = await fetch(candidate[0]);
    const randomIndex = randomInt(10, 200);
    await delay(randomIndex);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log(doc);
    const image = doc.querySelector("img");
    const imageSrc = image.src;
    const country = candidate[1];
    const imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    document.body.appendChild(imageElement);
    const mainImgContainer = document.querySelector(".main-img-container");
    const mainTxtContainer = document.querySelector(".main-txt-container");
    mainImgContainer.appendChild(imageElement);
    const countryElement = document.createElement("a");
    countryElement.textContent = country;
    countryElement.href = candidate[0];
    mainTxtContainer.appendChild(countryElement);
});
