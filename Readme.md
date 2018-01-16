# Hangman

## About

This is a simple version of the Hangman game. The player clicks on the letter box to guess and the game either fills in the letter in the right places or draws the next part of hangman.

Technology stack - 

1. Database/storage - a text file. This contains the list of words and clues for the game to pick a random variable
2. Server/Back-End - Node.js and Express Js.
3. Client/Front-End - HTML5, Bootstrap, CSS and Javascript+jQuery

## Steps to install

1. Install Node.js
2. Clone the repository into a folder
3. cd into the folder in a terminal window
4. execute command 'node server.js'
5. Go to your favorite browser and enter 'localhost:3000' in the url bar
6. Play the game

## Steps to play

1. Once the webpage opens click on start game. You will be presented with blanks for the word to be completed and buttons for each letter of the english alphabet.
2. Click on the letter or press the letter key that you think will be a part of the word.
3. If it is right the blanks will be filled with letter
4. If not the next part of gallow will be drawn in the area to the right of the screen

### Updated

1. Moved some part of "guess" logic to server-side
2. The word in client side javascript file has been removed and everything needed for client side now resides in the server-side.
3. Stats are now persistent even when the page refreshes. They reset when the server restarts
4. The game can now be played with the key presses.
5. Increased the timeout amount to clear the page of it's content, so that the user when lost can see the actual word for longer.

