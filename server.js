const express = require('express');
const path = require('path');

const app = express();

function Word() {
	this.word;
	this.clue;
}

Word.prototype.getWord = function() {
	this.word = "";
	this.clue = "";
	return this;
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


Game.prototype.initialize = function(player,gallow,10,0,word) {
	this.player = player;
	this.gallow = gallow;
	this.totalSteps = 10;
	this.curSteps = 0;
	this.word = word;
};



app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000,function(){
	console.log("Start playing the game on port 3000");
});



