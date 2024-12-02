var countries;
fetch("countries.json")
    .then((res) => res.json())
    .then((data) => {
        countries = data;
});

export function getCountryFromText(description) {
    for (let country of countries) {
        if (description.toLowerCase().includes(country.toLowerCase())) {
            return country;
        }
    }
    return "";
}