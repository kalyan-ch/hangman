const express = require('express');
const path = require('path');
const fs = require('fs');
const lineReader = require('readline');

var bodyParser = require('body-parser');
var wrdMp = new Map();
var game;

//contains the word and the clue for the game
function Word() {
	this.clue;
	this.crtWord;
}

//gets the word and clue by randoming selecting either
Word.prototype.getWord = function() {
	
	this.crtWord = "";
	var keys = Array.from(wrdMp.keys());
	this.clue = keys[Math.floor(Math.random()*keys.length)].trim();
	var wrdList = wrdMp.get(this.clue);
	this.crtWord = wrdList[Math.floor(Math.random()*wrdList.length)].trim();

};


/*
*
*represents the gallow 
*contains different parts of it in a stack
*
*/
function Gallow(){
	this.partList = [];
}

//init the stack with all the parts of the gallow
Gallow.prototype.initParts = function() {
	this.partList.push("Left Leg");
	this.partList.push("Right Leg");
	this.partList.push("Left Arm");
	this.partList.push("Right Arm");
	this.partList.push("Torso");
	this.partList.push("Head");
	this.partList.push("Rope");
	this.partList.push("Ceil");
	this.partList.push("Pole");
	this.partList.push("Base");
};

//pops the stack to give the next part for drawing
Gallow.prototype.getNextPart = function() {
	return this.partList.pop();
};

//game object is a wrapper to word and gallow objects
function Game() {
	this.gallow;
	this.word;
	this.guessWord;
}

Game.prototype.initialize = function(gallow,word) {
	this.gallow = gallow;
	this.word = word;
};

const app = express();


//setting express to use html and url encoding
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//starting server - server starting point
app.listen(3000,function(){
	console.log("Start playing the game on port 3000");
});


/*
*
*post call to initialize everything in the game
*returns
*clue and the word to be used in the game
*game starting point
*
*/

app.post('/init/',function(req,res){
	
	game = new Game();
	var glw = new Gallow();
	glw.initParts();
	var word = new Word();
	game.initialize(glw,word);
	
	//reading from the text file
	var lR = lineReader.createInterface({
		input: fs.createReadStream('wordList.txt')
	});


	//loading the map with clues as keys and array of words as values.
	//map used to retrieve word and clue later
	lR.on('line',function(line){
		var arr = line.split(":");
		var clue = arr[0];
		var wrds = arr[1].split(",");
		wrdMp.set(clue,wrds);
	});

	//retrieving the word
	setTimeout(function() {
		game.word.getWord();
		
		var data = {
			"word":game.word.crtWord,
			"clue":game.word.clue
		};

		res.send(data);
	},500);
});


/*
*
*post call to process the letter that was the user's guess
*returns 
*the indices of the letter in the word if the guess was right
*the next hangman part to draw if the guess was wrong
*game core-logic server-side part
*
*/

app.post('/guess/',function(req,res){
	var guess = req.body.letter;
	var indices = "";
	for(var i = 0; i < game.word.crtWord.length; i++){
		if(game.word.crtWord[i] == guess){
			indices += i+",";
		}
	}
	
	indices = indices.substring(0, indices.length - 1);
	
	var hangman = "";
	if(indices === ""){
		var s = game.gallow.getNextPart();
		hangman = s;
	}

	var data = {
		"indices":indices,
		"hangman":hangman
	}
	res.send(data);
});



