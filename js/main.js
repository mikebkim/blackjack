// /*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

var nameLookup = {
  'P': 'Player',
  'D': 'Dealer'
}

var masterDeck = buildMasterDeck();

var chipNoise = new Audio('audio/chipnoisemp3.mp3');
var cardNoise = new Audio('audio/cardshufflemp3.mp3');
var cardHit = new Audio('audio/cardshitmp3.mp3');
var blackjackWin = new Audio('audio/blackjackwinmp3.mp3');
var playerLose = new Audio('audio/losemp3.mp3');
var pushNoise = new Audio('audio/pushmp3.mp3');

// /*----- app's state (variables) -----*/
var shuffledDeck, playerHand, dealerHand;
var playerSum, dealerSum;
var bankroll, bet;
var handInProgress, blackjack, winner;

// /*----- cached element references -----*/
var playerCardsEl = document.querySelector('#player-section div.cards');
var playerScoreEl = document.querySelector('#player-section h3 span');
var bankrollEl = document.getElementById('bankroll');
var dealerCardsEl = document.querySelector('#dealer-section div.cards');
var dealerScoreEl = document.querySelector('#dealer-section h3 span');

var betControlEl = document.querySelector('#bet-deal-controls');
var dealBtnEl = document.querySelector('#deal-btn');
var hitStandContolEl = document.querySelector('#hit-stand-controls');
var playerBankroll = document.getElementsByClassName('bankroll')[0];

var playerBetEl = document.querySelector(".bet-amount");
var messageEl = document.getElementById("message");

// /*----- event listeners -----*/
dealBtnEl.addEventListener('click', handleDeal);
document.getElementById('bet-btns').addEventListener('click', handleIncreaseBet);
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('stand-btn').addEventListener('click', handleStand);

// /*----- functions -----*/
function initialize() {
  handInProgress = false;
  winner = null;
  bankroll = 1000;
  bet = 0;
  render();
}

function render() {
  bankrollEl.textContent = '$' + bankroll;
  playerBetEl.textContent = '$' + bet;
  dealBtnEl.style.visibility = handInProgress ? 'hidden' : 'visible';
  bet === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
  hitStandContolEl.style.visibility = handInProgress ? 'visible' : 'hidden';
  dealerScoreEl.textContent = handInProgress ? '?' : dealerSum;
  playerScoreEl.textContent = playerSum;
  renderHands();
  if (blackjack) {
    messageEl.textContent = `${nameLookup[blackjack]} Blackjack!`;
  } else if (winner) {
    if (winner === 'T') {
      messageEl.textContent = `Push`;
    } else {
      messageEl.textContent = `${nameLookup[winner]} Wins!`;
    }
  } else {
    messageEl.textContent = '';
  }
}

// master deck
function buildMasterDeck() {
  var deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

// shuffle deck
function shuffleDeck() {
  var tempDeck = masterDeck.slice();
  shuffledDeck = [];
  while (tempDeck.length) {
    var rndIdx = Math.floor(Math.random() * tempDeck.length);
    shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
}

// place bets
function handleIncreaseBet(evt) {
  if (evt.target.tagName !== 'BUTTON') return;
  var amt = parseInt(evt.target.textContent.replace('$', ''));
  bet += amt;
  bankroll -= amt;
  chipNoise.play();
  render();
}

// deal hands
function handleDeal() {
  cardNoise.play();
  shuffleDeck();
  handInProgress = true;
  winner = blackjack = null;
  playerHand = [];
  dealerHand = [];
  deal(playerHand, 2);
  deal(dealerHand, 2);
  playerSum = computeHand(playerHand);
  dealerSum = computeHand(dealerHand);
  checkForBlackjack();
  render();
}

// blackjack check
function checkForBlackjack() {
  if (playerSum === 21 && dealerSum === 21) {
    winner = 'T';
    bet = 0;
    pushNoise.play();
    handInProgress = false;
  } else if (playerSum === 21) {
    blackjack = 'P';
    bankroll += ((bet * 1.5) + bet);
    bet = 0;
    blackjackWin.play();
    handInProgress = false;
  } else if (dealerSum === 21) {
    blackjack = 'D';
    playerLose.play();
    handInProgress = false;
    bet = 0;
  }
}

function deal(hand, numCards) {
  hand.push(...shuffledDeck.splice(0, numCards));
}

// comparing hands
function computeHand(hand) {
  var sum = 0;
  var aces = 0;
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    var ace = card.face.split('').includes('A')
    if (ace) {
      aces++;
    }
    sum += card.value
  }
  while (sum > 21 && aces) {
    sum -= 10;
    aces--;
  }
  return sum;
}

// handle double down

// handle hit
function handleHit() {
  cardHit.play();
  deal(playerHand, 1);
  playerSum = computeHand(playerHand);
  if (playerSum > 21) {
    winner = 'D';
    playerLose.play();
    handInProgress = false;
    bet = 0;
  }
  render();
}

// stand
function handleStand() {
  handInProgress = false;
  playerSum = computeHand(playerHand);
  dealerPlay();
  dealerSum = computeHand(dealerHand);
  if (playerSum === dealerSum) {
    winner = 'T';
    pushNoise.play();
    bankroll += bet;
  } else if (dealerSum > playerSum && dealerSum < 22) {
    winner = 'D';
    playerLose.play();
  } else {
    winner = 'P';
    bankroll += bet * 2;
    blackjackWin.play();
  }
  bet = 0;
  render();
}

function dealerPlay() {
  while (computeHand(dealerHand) < 17) {
    deal(dealerHand, 1);
    if (computeHand(dealerHand) > 21) {
      winner = 'P';
    }
  }
}

// render hands
function renderHands() {
  if (!playerHand) return;
  playerCardsEl.innerHTML = '';
  var cardsHtml = playerHand.reduce(function (html, card) {
    return html + `<div class="card ${card.face}"></div>`;
  }, '');
  playerCardsEl.innerHTML = cardsHtml;
  dealerCardsEl.innerHTML = '';
  var cardsHtml = dealerHand.reduce(function (html, card, idx) {
    var cardClass = handInProgress && idx === 0 ? 'back-blue' : card.face;
    return html + `<div class="card ${cardClass}"></div>`;
  }, '');
  dealerCardsEl.innerHTML = cardsHtml;
}

initialize();