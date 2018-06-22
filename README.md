![blackjack](https://i.imgur.com/S7pfDdW.jpg)

#_Game Logic_

##Betting
* Click "Buy-In" button (Max buy-in 5000)
* Enter bet amount in box and click "Place Bet" button (Max bet = 100)
* Dealing occurs

##Dealing
* Player is dealt first card
* Dealer is dealt first card *face down*
* Player is dealt second card
* Dealer is dealt second card *face up*

**_Insurance_** (As an alert function)

* If dealer has an Ace showing, they offer insurance
* Insurance is a side bet that player can bet if they think dealer has blackjack
* Insurance bet must be half original bet
* If dealer has blackjack, you keep your side bet as well as your original bet.
	* If not, you lose your side bet.
* If player and dealer have blackjack AND the dealer is showing an ace, ask for even money instead of insurance.
	* If dealer HAS blackjack, insurance goes back to player AND player receives even money (1:1) on original bet.

##Player Turn
* After cards are dealt, player goes first (hit or stay)
	* If player clicks "Hit", add 1 card to player's hand
	* If player clicks "Stay", dealer's turn

**_Double Down_**

* You will only receive one card
* Adds the same original bet amount to bet

**_Split_**

* If your first two cards have the same face value, you may split and play them as separate hands
* You may split up to 3 times, for a total of 4 hands
* Player can double down on split hands (Same rules apply above)

##Dealer Turn

* Must hit on >= 16
* Must stay on <= 17
* Over 21 = bust

##Comparing Hands

* If dealer or player is > 21, *bust*
* Closest to 21 wins hand
* If player wins, they receive bet paid 1:1
* If they lose, they lose the bet
* Aces are soft and hard (+1 or +11)
	* Dealer must stay on 17

##Winner

* Blackjack - Player receives 1.5x original bet
* Beats dealer - payout 1:1

##Reshuffle

* Reshuffle after every hand

___

#_How to Play_

**Player Acts First**

*	Buy in and place bet 
* If player first two cards equal 17-21, you want to stay
* If player first two cards equal 2-16, you want to hit

**Dealer Turn**

* Must hit if >= 16
* Must stay if <= 17

**Comparing Hands**

* Closest to 21 wins hand
* If ==, game is a push

**Blackjack**

* Can only have blackjack on first two cards. Anytihng else, you have 21
* If dealer and player both have blackjack push

##Buttons
* Hit
* Stay
* Double Down
* Buy In
* Bet
* Restart 