/*----- constants -----*/
var rank = 'A23456789TJQK';
var suit = 'hcds';
var cards = [];
for (var s = 0; s < suit.length; s++) {
    for (var f = 0; f < rank.length; f++) {
        cards.push(rank[f] + suit[s]);
    }
}

var suitDeck = {
    'h': 'hearts',
    'c': 'clubs',
    'd': 'diamonds',
    's': 'spades'
}

var rankDeck = {
    'A': 'A',
    '2': 'r02',
    '3': 'r03',
    '4': 'r04',
    '5': 'r05',
    '6': 'r06',
    '7': 'r07',
    '8': 'r08',
    '9': 'r09',
    'T': 'r10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
}

/*----- app's state (variables) -----*/
var board, score;

/*----- cached element references -----*/
var scoreEl = document.querySelector('h2');

/*----- event listeners -----*/
// adding chips
document.getElementById('inc-btn').addEventListener('click', function () {
    handleUpdateScore(5)
});
document.getElementById('inc-btn2').addEventListener('click', function () {
    handleUpdateScore(10)
});

document.getElementById("dealBtn").addEventListener('click', function() {
    var randomCard = getRandomCard();
    var playerCards = document.getElementById("playercards");
    var rank = rankDeck[randomCard[0]]
    var suit = suitDeck[randomCard[1]]
    console.log(randomCard)
    playerCards.innerHTML += '<img src="card-deck-css/images/'+suit+'/'+suit+'-'+rank+'.svg">';
});



/*----- functions -----*/
function initialize() {
    board = [];
    score = 0;
    // add more state here
    render();
}

function getRandomCard() {
    return cards[Math.floor(Math.random() * cards.length)];
}



// responsible for transfering all state to the DOM (visualization)
function render() {
    scoreEl.textContent = score;
}

function handleUpdateScore(diff) {
    score += diff;

    render();
}

initialize();