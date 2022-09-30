elements = {
    characters: document.querySelector("#characters"),
    startButton: document.querySelector("#startButton"),
    resetButton: document.querySelector("#resetButton"),
    timeField: document.querySelector("#timeField"),
    wins: document.querySelector("#wins"),
    losses: document.querySelector("#losses"),
    time: document.querySelector("#time")
}
var score = {};
var characters;
var currentWord;
var wordList = ["ready", "crowded", "calculating", "enchanted", "shivering", "polution", "examine", "applaud"];
var roundTime = 15;
var timer;
var timeLeft;
var isGameActive = false;

// Loads the scores from local storage, and prints them to the screen
function loadScores(){
    var hist = JSON.parse(localStorage.getItem("score"));
    console.log(hist);
    if (hist != null){
        score.wins = hist.wins;
        score.losses = hist.losses;
    }else{
        score = {};
        score.wins = 0;
        score.losses = 0;
        resetScores();
    }
    elements.wins.innerText = `Wins: ${score.wins}`;
    elements.losses.innerText = `Losses: ${score.losses}`;
}

// Resets the scores to zero
function resetScores(){
    score.wins = 0;
    score.losses = 0;
    saveScores();
    loadScores();
}

// Saves the current scores to local storage
function saveScores(){
    var json = JSON.stringify(score);
    localStorage.setItem("score", json);
}

// Starts the game
function startGame(){
    var rand = Math.floor(Math.random() * wordList.length);
    currentWord = wordList[rand];
    characters = "";
    for (let i = 0; i < currentWord.length; i++){
        characters += "_";
    }
    
    startTimer();
    isGameActive= true;

    elements.characters.innerText = characters;
    elements.startButton.setAttribute("style", "visibility: hidden");
    elements.characters.setAttribute("style", "visibility: visible");
}

// Ends the game
function endGame(){
    isGameActive = false;
    endTimer();
    if (characters == currentWord){
        score.wins++;
    }else{
        score.losses++;
    }
    saveScores();
    loadScores();
    elements.startButton.setAttribute("style", "visibility: visible");
    elements.characters.setAttribute("style", "visibility: hidden");
}

// Resets the remaining time and starts the countdown timer for the game
function startTimer(){
    timeLeft = roundTime;
    timer = setInterval(onTick, 1000);
    elements.timeField.setAttribute("style", "visibility: visible");
}

// Logic on timer interval
function onTick(){
    timeLeft--;
    elements.time.innerText = timeLeft;
    if (timeLeft <= 0){
        endGame();
    }
}

// Ends the timer
function endTimer(){
    clearInterval(timer);
    elements.timeField.setAttribute("style", "visibility: hidden");
}

// Fills in the correct character on keystroke if the game is running
function onKeyStroke(event){
    if (!isGameActive){
        return;
    }
    for (let i = 0; i < currentWord.length; i++){
        if (currentWord.charAt(i) == event.key){
            characters = setCharAt(characters, i, currentWord.charAt(i));
        }
    }
    elements.characters.innerText = characters;
    if (characters == currentWord){
        endGame();
    }

}

// Helper function to replace a character in a string at an index
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}


// load the scores from local storage right away
loadScores();

// Give the reset button functionality
elements.resetButton.addEventListener("click", function(event){
    event.preventDefault();
    resetScores();
    saveScores();
});

// Give the start button functionality
elements.startButton.addEventListener("click", function(event){
    event.preventDefault();
    startGame();
});

// Process keystrokes
document.onkeydown = onKeyStroke;


