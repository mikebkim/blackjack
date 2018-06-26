// /*----- constants -----*/
var suits = ['s', 'c', 'd', 'h'];
var ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

var nameLookup = {
  'P': 'Player',
  'D': 'Dealer'
}

var masterDeck = buildMasterDeck();

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
hitStandContolEl.addEventListener('click', handleHit);
// standControlEl.addEventListener('click', handleStand);

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
  betControlEl.style.visibility = handInProgress ? 'hidden' : 'visibile';
  bet === 0 ? dealBtnEl.setAttribute('disabled', 'disabled') : dealBtnEl.removeAttribute('disabled');
  hitStandContolEl.style.visibility = handInProgress ? 'visible' : 'hidden';
  dealerScoreEl.textContent = handInProgress ? '?' : dealerSum;
  playerScoreEl.textContent = playerSum;
  renderHands();
  if (blackjack) {
    messageEl.textContent = `${nameLookup[blackjack]} Has Blackjack!`;
  } else if (winner) {
    if (winner === 'T') {
      messageEl.textContent = `It's a Push`;
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
        // the 'face' property maps to the CSS classes for cards
        face: `${suit}${rank}`,
        // the 'value' property is set for blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

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
  var amt = parseInt(evt.target.textContent.replace('$', ''));
  bet += amt;
  bankroll -= amt;
  render();
}

// deal hands
function handleDeal() {
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

function checkForBlackjack() {
  if (playerSum === 21 && dealerSum === 21) {
    messageEl = `It's a Push`;
  } else {
   playerSum === 21
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

// handle hit
function handleHit() {
  deal(playerHand, 1);
  playerSum = computeHand(playerHand);
  if (playerSum > 21) {
    winner = 'D';
    handInProgress = false;
    bet = 0;
  }
  render();
}

// stand

// render hands
function renderHands() {
  if (!playerHand) return;
  playerCardsEl.innerHTML = '';
  // Let's build the cards as a string of HTML
  var cardsHtml = playerHand.reduce(function (html, card) {
    return html + `<div class="card ${card.face}"></div>`;
  }, '');
  playerCardsEl.innerHTML = cardsHtml;
  dealerCardsEl.innerHTML = '';
  // Let's build the cards as a string of HTML
  var cardsHtml = dealerHand.reduce(function (html, card, idx) {
    var cardClass = handInProgress && idx === 0 ? 'back-blue' : card.face;
    return html + `<div class="card ${cardClass}"></div>`;
  }, '');
  dealerCardsEl.innerHTML = cardsHtml;
}

initialize();
