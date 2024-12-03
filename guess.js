import { getCountryFromText } from './countries.js';
import { reset } from './script.js';


document.getElementById('guessButton').addEventListener('click', guessCountry);
document.getElementById('playAgain').addEventListener('click', playAgain);

const inputBox = document.getElementById('guess');
const popup = document.querySelector('.answer-popup');


var lives = 3;
var guessedCountries = [];
var answer = await reset();


function guessCountry() {
    const livesText = document.getElementById('lives');

    const errorPopUp = document.querySelector('.error-popup');
    if (errorPopUp.style.visibility === 'visible') {
        errorPopUp.style.visibility = 'hidden';
        errorPopUp.style.opacity = '0'; 
    } 

    const inputContainer = document.getElementById('guess');
    let guess = inputContainer ? inputContainer.value : '';
    guess = getCountryFromText(guess);

    const guessContainer = document.querySelector('.guess-container');

    if(!guess) {
        errorPopUp.style.visibility = 'visible';
        errorPopUp.style.opacity = '1';
        errorPopUp.textContent = "Error: Not in list of countries in this game";
    } else if (guess === answer[1].trim()) {
        popUp(true);
    } else {
        guessContainer.classList.add('shake');
        setTimeout(() => {
            guessContainer.classList.remove('shake');
        }, 500);
        if (guessedCountries.includes(guess)) {
            errorPopUp.style.visibility = 'visible';
            errorPopUp.style.opacity = '1';
            errorPopUp.textContent = "Already Guessed " + guess;
            return;
        }
        guessedCountries.push(guess);
        lives--;
        livesText.textContent = "Lives: " + "♥️".repeat(lives);

        if (lives <= 0) {
            popUp(false);
        }
    }

}

function popUp(correct) {
    const txtContainer = document.querySelector('.main-txt-container');
    const countryElement = document.createElement("a");
    countryElement.textContent = answer[1];
    countryElement.href = answer[0];
    txtContainer.appendChild(countryElement);

    const answerText = document.querySelector("h3");
    answerText.textContent = correct
    ? "You Win! :) The country is "
    : "You Lose :( The country is ";

    popup.insertBefore(answerText, popup.firstChild);
    popup.style.visibility = 'visible';
}


async function playAgain() {
    guessedCountries = [];
    inputBox.value = '';
    const livesText = document.getElementById('lives');
    livesText.textContent = "Lives: ♥️♥️♥️";
    lives = 3;
    answer = await reset();
    
}

document.addEventListener("keypress", function(event) {
    if (event.key !== "Enter") {
        return;
    }
    event.preventDefault();
    if (popup.style.visibility === 'visible') {
        document.getElementById("playAgain").click();
    } else {
        document.getElementById("guessButton").click();
    }
});

