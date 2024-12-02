import { getCountryFromText } from './countries.js';
import { reset } from './script.js';


document.getElementById('guessButton').addEventListener('click', guessCountry);
document.getElementById('playAgain').addEventListener('click', playAgain);


var lives = 3;
function guessCountry() {

    const txtContainer = document.querySelector('.main-txt-container');
    const answer = txtContainer ? txtContainer.textContent: '';

    const livesText = document.getElementById('lives');

    const errorPopUp = document.querySelector('.error-popup');
    if (errorPopUp.style.visibility === 'visible') {
        errorPopUp.style.visibility = 'hidden';
        errorPopUp.style.opacity = '0'; 
    } 

    const inputContainer = document.getElementById('guess');
    let guess = inputContainer ? inputContainer.value : '';
    guess = getCountryFromText(guess);

    if(!guess) {
        errorPopUp.style.visibility = 'visible';
        errorPopUp.style.opacity = '1';
    } else if (guess === answer.trim()) {
        popUp(true);
    } else {
        lives--;
        livesText.textContent = "Lives Left: " + lives;
        if (lives <= 0) {
            popUp(false);
        }
    }




}

function popUp(correct) {
    const answerText = document.querySelector("h3");
    answerText.textContent = correct
    ? "You Win! :) The country is "
    : "You Lose :( The country is ";

    const popup = document.querySelector('.answer-popup');
    popup.insertBefore(answerText, popup.firstChild);
    popup.style.visibility = 'visible';
}

function error() {


}


function playAgain() {

    const livesText = document.getElementById('lives');
    livesText.textContent = "Lives Left: 3";
    lives = 0;
    reset();
}
