var countries;

fetch("./countries.json")
    .then((res) => res.json())
    .then((data) => {
        countries = data;
    });

export function getCountryFromText(description) {
    let matches = [];
    const countryNames = Object.keys(countries);
    for (let country of countryNames) {
        if (description.toLowerCase().includes(country.toLowerCase())) {
            matches.push(country);
        }
    }
    if (matches.length === 1) return matches[0];
    if (matches.length === 0) return "";
    for (let country of matches) {
        if (description.toLowerCase().includes(" " + country.toLowerCase())) {
            return country;
        }
    }
    return "";
}

// taken from https://www.bqst.fr/country-code-to-flag-emoji/
export function getEmojiFromCountry(country) {
    let countryCode = countries[country];
    const codePoints = countryCode
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}
