var countries;

fetch("./countries.json")
    .then((res) => res.json())
    .then((data) => {
        countries = data;
    });

export function getCountryFromText(description) {
    /*
     * This is a bulky solution but it works...
     * TODO: improve this function
     */
    const countryNames = Object.keys(countries);
    description = description.toLowerCase();
    let matches = [];
    for (let country of countryNames) {
        if (description.includes(" " + country.toLowerCase())) {
            matches.push(country);
        }
    }
    if (matches.length === 0) {
        return "";
    } else if (matches.length === 1) {
        return matches[0];
    } else {
        let furthestCountry = matches[0];
        let furthestIndex = description.lastIndexOf(matches[0].toLowerCase());

        for (let i = 1; i < matches.length; i++) {
            let currentIndex = description.lastIndexOf(matches[i].toLowerCase());
            if (currentIndex > furthestIndex) {
                furthestCountry = matches[i];
                furthestIndex = currentIndex;
            }
        }

        return furthestCountry;
    }
}

// taken from https://www.bqst.fr/country-code-to-flag-emoji/
export function getEmojiFromCountry(country) {
    let countryCode = countries[country];
    const codePoints = countryCode
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
