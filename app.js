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
let matchesFound = 0;
let waiting = false;

const boardElement = document.getElementById("board");
const movesElement = document.getElementById("moves");
const statusElement = document.getElementById("status");

function createBoard() {
    deck = shuffle([...fruits, ...fruits]);
    matchesFound = 0;

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

    if (waiting) return;
    if (!card.classList.contains("card")) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    if (turnedCards.length >= 2) return;

    const index = card.dataset.index;
    const fruit = deck[index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", `Card ${Number(index) + 1}, ${fruit.name}`);

    turnedCards.push(card);

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
            
            matchesFound++;

            // Check if all 8 pairs have been found
            if (matchesFound === 8) {
                statusElement.textContent = `You found all the pairs in ${moves} moves!`;
                statusElement.classList.add("you-won");
            } else {
                statusElement.textContent = "That's a pair!";
            }

            turnedCards = [];
        } else {
            // Not a match
            statusElement.textContent = "Not a pair. Try again.";
            waiting = true;

            setTimeout(() => {
                card1.textContent = "";
                card1.classList.remove("flipped");
                card1.setAttribute("aria-label", `Card ${Number(card1.dataset.index) + 1}, face down`);

                card2.textContent = "";
                card2.classList.remove("flipped");
                card2.setAttribute("aria-label", `Card ${Number(card2.dataset.index) + 1}, face down`);

                turnedCards = [];
                waiting = false;
            }, 1000);
        }
    }
});

createBoard();