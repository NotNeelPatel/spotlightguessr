function guessCountry() {
    const inputContainer = document.getElementById('guess');
    const guess = inputContainer ? inputContainer.value : '';
    const txtContainer = document.querySelector('.main-txt-container');
    const answer = txtContainer ? txtContainer.textContent: '';
    console.log(answer, answer.length);
    console.log(guess, guess.length);

    if (guess === answer.trim()) {
        alert('Correct!');
    } else{
        alert('Incorrect! The correct answer is ' + answer);
    }
}