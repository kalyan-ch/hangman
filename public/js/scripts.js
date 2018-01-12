var word = "";
var clue = "";
var ctx;
var guessesLeft;

$(document).ready(function(){
	
	//on click event that starts the game
	$(".start").click(function(){
		initGame();
	});

	//game-core logic client-side part
	$("#letters").on("click","li",function() {
		if( !($(this).find("a").hasClass("disabled")) && (guessesLeft > 0)){
			guess(this);
		}
	});
});

/*
*
* checks if the user's guess is right by sending a post request to the server
* if a wrong guess is made, calls the drawhangman function to draw the next part
* if the guess is right, calls the fillBlanks function to fill in the letter in the positions
* checks for win each time a guess is made
*
*/
function guess(obj){

	var ltr = $(obj).text();

	var data = {
		letter: ltr
	};


	$.post('/guess/',data,function(data,status){
		if(data.indices === "" ){
			drawHangman(data.hangman);
			guessesLeft--;
			$(obj).addClass("wrong");
		}else{
			$(obj).addClass("right");
			fillBlanks(data.indices,ltr);
		}

		$(obj).find("a").addClass("disabled");
		
		checkWinLoss();
	});
}

/*
*
* Initializes everything in the game, calls every relevant function in the game
* calls initCanv, drawBlanks and drawLetters functions to initialize everything
*
*/
function initGame() {
	$.post('/init/',function(data,status){
		word = data.word.trim();
		clue = data.clue.trim();
		initCanv();
		$("#clue").html(clue);
		drawBlanks();
		drawLetters();
		guessesLeft = 10;
	});
}

/*
* inits the canvas for drawing the hangman
*/
function initCanv() {
	var canvas = $("#game")[0];
	ctx = canvas.getContext("2d");
}

/*
* draws the blanks based on the word
*/
function drawBlanks() {
	var text = "";
	for(var i =0; i < word.length; i++){
		if(word[i] == " "){
			text += "  ";
		}else{
			text += "_ ";			
		}
	}

	$("#blanks").html(text);
}

/*
* draws the letter boxes that the user can click to make a guess
*/
function drawLetters() {
	var s = "abcdefghijklmnopqrstuvwxyz";
	var liText = "";
	for(var i =0; i < s.length; i++){
		liText += '<li><a href="#" class="btn">'+s[i]+'</a></li>';
	}

	$("#letters ul").html(liText);
}

/*
* fills the letter in the right positions
*/
function fillBlanks(indices,ltr){
	var ind = indices.split(",");
	var j = 0;
	var curText = $("#blanks").text();	
	var arr = curText.split('');
	for (var i = 0; i < arr.length; i += 2) {
		if(i/2 == ind[j]){
			arr[i] = ltr;
			j++;
		}
	}

	var text = arr.join('');
	$("#blanks").html(text);
}

/*
* draws the hangman's next part
*/
function drawHangman(part){
	ctx.fillStyle = "black";

	switch(part){
		case "Left Leg":
			ctx.beginPath();
			ctx.moveTo(200,225);
			ctx.lineTo(150,275);
			ctx.stroke();
			break;
		case "Right Leg":
			ctx.beginPath();
			ctx.moveTo(200,225);
			ctx.lineTo(250,275);
			ctx.stroke();
			break;
		case "Left Arm":
			ctx.beginPath();
			ctx.moveTo(200,160);
			ctx.lineTo(150,210);
			ctx.stroke();
			break;
		case "Right Arm":
			ctx.beginPath();
			ctx.moveTo(200,160);
			ctx.lineTo(250,210);
			ctx.stroke();
			break;
		case "Torso":
			ctx.beginPath();
			ctx.moveTo(200,150);
			ctx.lineTo(200,225);
			ctx.stroke();
			break;
		case "Head":
			ctx.beginPath();
			ctx.arc(202,125,25,0,2*Math.PI);
			ctx.stroke();
			break;
		case "Rope":
			ctx.fillRect(200,50,5,50);
			break;
		case "Ceil":
			ctx.fillRect(75,50,125,5);
			break;
		case "Pole":
			ctx.fillRect(75,50,5,250);
			break;
		case "Base":
			ctx.fillRect(20,300,360,5);
			break;
	}
}

/*
* checks win or loss
*/

function checkWinLoss() {
	var curText = $("#blanks").text();

	if(curText.indexOf("_") == -1){
		var n = $("#wins").text();
		n = parseInt(n);
		n++;
		$("#wins").text(n);

		showModal(true);
		setTimeout(function(){
			resetGame();
		},2000);
		
	}else if(guessesLeft == 0){
		var n = $("#lost").text();
		n = parseInt(n);
		n++;
		$("#lost").text(n);
		completeWord();
		setTimeout(function(){
			showModal(false);
		},1000);
		
		setTimeout(function(){
			resetGame();
		},2000);
	}
}

/*
* shows the win or loss message
*/

function showModal(win) {
	var title = "Congratulations!";
	var body = "You've won this game!";
	if(!win){
		title = "Sorry";
		body = "You've lost this game!";
	}
	$(".modal-title").html(title);
	$(".modal-body p").text(body);
	$("#messageModal").modal("show");
}

/*
* shows the word if the player is lost
*/
function completeWord() {
	var text = "";
	for(var i =0; i < word.length; i++){
		text += word[i]+" ";
	}
	$("#blanks").html(text);
}

/*
* resets the game
*/
function resetGame(win) {
	word = "";
	clue = "";
	$("#clue").html("");
	$("#blanks").html("");
	$("#letters ul").html("");
	ctx.clearRect(0, 0, 400, 400);
}

