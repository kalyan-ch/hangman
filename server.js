const express = require('express');
const path = require('path');
const fs = require('fs');
const lineReader = require('readline');

var bodyParser = require('body-parser');
var wrdMp = new Map();
var game;

function Word() {
	this.clue;
	this.crtWord;
	
}

Word.prototype.getWord = function() {
	
	this.crtWord = "";

	var keys = Array.from(wrdMp.keys());
	this.clue = keys[Math.floor(Math.random()*keys.length)].trim();
	var wrdList = wrdMp.get(this.clue);
	this.crtWord = wrdList[Math.floor(Math.random()*wrdList.length)].trim();

};

function Player(){
	this.wonNum;
	this.lostNum;
	this.streak;
}

Player.prototype.guess = function() {
	// body...
};

function Gallow(){
	this.partList = [];
}

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


Gallow.prototype.getNextPart = function() {
	return this.partList.pop();
};

function Game() {
	this.player;
	this.gallow;
	this.totalSteps;
	this.curSteps;
	this.word;
	this.guessWord;
}


Game.prototype.initialize = function(player,gallow,word) {
	this.player = player;
	this.gallow = gallow;
	this.totalSteps = 10;
	this.curSteps = 0;
	this.word = word;
};

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000,function(){
	console.log("Start playing the game on port 3000");
});

app.post('/init/',function(req,res){
	
	game = new Game();
	var plyr = new Player();
	var glw = new Gallow();
	var word = new Word();
	game.initialize(plyr,glw,word);
		
	var lR = lineReader.createInterface({
		input: fs.createReadStream('wordList.txt')
	});

	lR.on('line',function(line){
		var arr = line.split(":");
		var clue = arr[0];
		var wrds = arr[1].split(",");
		wrdMp.set(clue,wrds);
	});


	setTimeout(function() {
		game.word.getWord();
		
		var data = {
			"word":game.word.crtWord,
			"clue":game.word.clue
		};

		res.send(data);
	},500);
	
});

app.post('/guess/',function(req,res){
	var guess = req.body.letter;
	var indices = "";
	for(var i = 0; i < game.word.crtWord.length; i++){
		if(game.word.crtWord[i] == guess){
			indices += i+",";
		}
	}

	var hangman = "";
	if(indices === ""){
		hangman = game.gallow.getNextPart();
	}

	var data = {
		"indices":indices,
		"hangman":hangman
	}

	res.send(data);
});

