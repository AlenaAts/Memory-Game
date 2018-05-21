/*
 * Create a list that holds all of your cards
 */
 
const card = document.querySelectorAll(".card");		// card element
const cards = [...card];								// 16 card elements
const deck = document.querySelector(".deck");			// the deck of cards
const moves = document.querySelector(".moves");			// an element that will contain the number of moves that has been made
const modal = document.querySelector("#modal");			// popup window
const stars = document.querySelector(".stars");			// stars panel
const star = document.querySelector(".stars li");		// one star
const timer = document.querySelector("#time");			// timer panel
const restart = document.querySelector(".restart");		// restart symbol


let openedCards = [];	// an array that will contain opened cards after a click
let matched = 0;		// counts how many pairs are matched
let number = 0;			// the number of moves that have been made
let time = 0;			// contains the result of the timer function
let second = 0;			// counting seconds
let minute = 0;			// counting minutes

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// loops through each card, creates its HTML and adds it to the page
function shuffleCards() {
	let shuffled = shuffle(cards);
	for (let i = 0; i < shuffled.length; i++) {
		[].forEach.call(shuffled, function(item) {
			deck.appendChild(item);
		});
		cards[i].classList.remove("open", "show", "match", "lock");
	}
}

// added events to 16 elements of the cards array
for (let i = 0; i < cards.length; i++) {
	cards[i].addEventListener("click", showCard);
	cards[i].addEventListener("click", compare);
	cards[i].addEventListener("click", endGame);
}

// displays clicked card, locks it and adds it to the empty array
function showCard() {
	this.classList.add("open", "show", "lock");
	openedCards.push(this);
}

/************************* the card comparison ***************************/

// if there are two cards opened, checks to see if the two cards match
function compare() {
	if (openedCards.length === 2) {
		counter();
		if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
			match();
		} else {
			nomatch();
		};
	}
}

// locks matched cards in the open position
function match() {
	openedCards[0].classList.add("match");
	openedCards[1].classList.add("match");
	openedCards[0].classList.remove("open", "show");
	openedCards[1].classList.remove("open", "show");
	openedCards = [];
	matched++;
}

// colors two unmatched cards before removing them from the list
function nomatch() {
	openedCards[0].classList.add("nomatch");
	openedCards[1].classList.add("nomatch");
	lock();
	setTimeout(hideCards, 600);
}

// makes the cards unable to click before closing two unmatched cards
function lock() {
	[].filter.call(cards, function(card){
		card.classList.add("lock");
	})
}

// hides the card's symbol and removes them from the list
function hideCards() {
	openedCards[0].classList.remove("open", "show", "nomatch");
	openedCards[1].classList.remove("open", "show", "nomatch");
	unlock();
	openedCards = [];
}

// makes unmatched cards to be able to click again
function unlock() {
	[].filter.call(cards, function(card){
		card.classList.remove("lock");
	});
}

/**************************** the score ********************************/

// increases the number of moves and displays it on the page
function counter() {
	let move = document.querySelector("#move");
	move.innerHTML = " Move";
	number++;
	moves.innerHTML = number;
	if (number === 1) {
		setTimer();
	} else {
		move.innerHTML = " Moves";
	};
	rating();
}

// decreases the number of stars after certain number of moves
function rating() {
	switch (true) {
		case number > 8 && number < 16:
			stars.innerHTML = star.innerHTML + star.innerHTML;
		break;

		case number > 16:
			stars.innerHTML = star.innerHTML;
		break;
	}
}

/******************************** the timer ***************************/

// the timer is on
function setTimer() {
	time = setInterval(function() {
		startTime();
	}, 1000);
}

// increases the number of seconds and minutes
function startTime() {
	second++;
	switch (true) {
		case second < 60:
			timer.innerHTML = minute + " min " + second + " sec";
		break;

		case second > 59:
			minute++;
			second = 0;
			timer.innerHTML = minute + " min " + second + " sec";
		break;
	}
}

// stops the time and sets to zero the time result
function stopTimer() {
	clearInterval(time);
	second = 0;
	minute = 0;
	timer.innerHTML = "";
}

/******************************* start and end of the game *********************************/

// closing the cards and shuffle them; sets the score to the beginning and closing the modal
function startGame() {
	shuffleCards();
	stopTimer();
	number = 0;
	moves.innerHTML = number;
	stars.innerHTML = star.innerHTML + star.innerHTML + star.innerHTML;
	closeModal();
	matched = 0;
}

// stops the time and show the popup window with the score
function endGame() {
	if (matched === 8) {
		modal.style.visibility = "visible";
		clearInterval(time);
		document.querySelector("#close").addEventListener("click", closeModal);
		document.querySelector("#play").addEventListener("click", startGame);
		document.querySelector("#starResult").innerHTML = stars.innerHTML;
		document.querySelector("#moveResult").innerHTML = number;
		document.querySelector("#timeResult").innerHTML = timer.innerHTML;
	}
}

// closes the window and leaves the game finished
function closeModal() {
	modal.style.visibility = "hidden";
}

/*******************************************************************************************/

// the restart button
restart.addEventListener("click", startGame);

// sets the game when the page is onload
window.onload = startGame();

// closes the modal when the click is outside the score area
window.onclick = function(event) {
	if (event.target === modal) {
		closeModal();
	}
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */