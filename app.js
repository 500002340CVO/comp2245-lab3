const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let deck = [];
let turnedCards = [];
let moves = 0;

const boardElement = document.getElementById("board");
const movesElement = document.getElementById("moves");
const statusElement = document.getElementById("status");

function createBoard() {
    deck = shuffle([...fruits, ...fruits]);

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;
        boardElement.appendChild(card);
    });
}

boardElement.addEventListener("click", (event) => {
    const card = event.target;

    // Check that it is a card and not already flipped/matched
    if (!card.classList.contains("card")) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    if (turnedCards.length >= 2) return;

    // Turn the card over
    const index = card.dataset.index;
    const fruit = deck[index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", `Card ${Number(index) + 1}, ${fruit.name}`);

    turnedCards.push(card);

    // When two cards are turned over, it counts as a move
    if (turnedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;

        const [card1, card2] = turnedCards;
        const fruit1 = deck[card1.dataset.index];
        const fruit2 = deck[card2.dataset.index];

        if (fruit1.name === fruit2.name) {
            // Match found
            card1.classList.add("matched");
            card2.classList.add("matched");
            card1.disabled = true;
            card2.disabled = true;
            statusElement.textContent = "That's a pair!";
            turnedCards = [];
        } else {
            // Not a match (we will add Exercise 4 logic here next)
        }
    }
});

createBoard();