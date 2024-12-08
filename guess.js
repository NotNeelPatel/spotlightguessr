import { getCountryFromText } from "./countries.js";
import { getEmojiFromCountry } from "./countries.js";
import { reset } from "./script.js";

document.getElementById("guessButton").addEventListener("click", guessCountry);
document.getElementById("playAgain").addEventListener("click", playAgain);

const inputBox = document.getElementById("guess");
const popup = document.querySelector(".answer-popup");
const livesText = document.getElementById("lives");

let lives = 3;
let guessedCountries = new Set();
let answer = await reset();

function guessCountry() {
    // Prevent unwanted behaviour for popups
    if (popup.style.visibility === "visible") {
        return;
    }
    setErrorPopUp();

    let userGuess = inputBox ? inputBox.value : "";
    userGuess = getCountryFromText(userGuess);

    const guessContainer = document.querySelector(".guess-container");

    if (userGuess === answer[1].trim()) {
        popUp(true);
    } else {
        // Shake animation
        guessContainer.classList.add("shake");
        setTimeout(() => {
            guessContainer.classList.remove("shake");
        }, 500);

        if (!userGuess) {
            setErrorPopUp("Error: Not in list of countries in this game");
            return;
        }

        if (guessedCountries.has(userGuess)) {
            setErrorPopUp("Already Guessed " + userGuess);
            return;
        }

        guessedCountries.add(userGuess);
        lives--;
        livesText.textContent = "Lives: " + "♥️".repeat(lives);

        if (lives <= 0) {
            // User loses
            popUp(false);
        }
    }
}

function popUp(userWon) {
    const txtContainer = document.querySelector(".main-txt-container");
    const countryElement = document.createElement("a");

    countryElement.textContent = getEmojiFromCountry(answer[1]) + " " + answer[1];
    countryElement.href = answer[0];
    txtContainer.appendChild(countryElement);

    const answerText = document.querySelector("h3");
    answerText.textContent = userWon
        ? "You Win! :) The country is "
        : "You Lose :( The country is ";

    popup.insertBefore(answerText, popup.firstChild);
    popup.style.visibility = "visible";
}

function setErrorPopUp(message = "") {
    const container = document.querySelector(".error-popup");

    if (container.style.visibility === "visible" && message === "") {
        container.style.visibility = "hidden";
        container.style.opacity = "0";
        return;
    }

    container.style.visibility = "visible";
    container.style.opacity = "1";
    container.textContent = message;
}

async function playAgain() {
    guessedCountries.clear();
    inputBox.value = "";
    livesText.textContent = "Lives: ♥️♥️♥️";
    lives = 3;
    answer = await reset();
}

document.addEventListener("keypress", function (event) {
    if (event.key !== "Enter") {
        return;
    }
    event.preventDefault();
    if (popup.style.visibility === "visible") {
        document.getElementById("playAgain").click();
    } else {
        document.getElementById("guessButton").click();
    }
});
