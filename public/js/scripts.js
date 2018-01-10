var word = "";
var clue = "";
$(document).ready(function(){
	initGame();
	$("#letters").on("click","a",function() {
		guess($(this).text());
	});
});

function guess(ltr){
	var data = {
		letter: ltr
	};
	$.post('/guess/',data,function(data,status){
		if(data==""){
			drawHangman();
		}else{
			fillBlanks();
		}
	});
}

function initGame() {
	$.post('/init/',function(data,status){
		word = data.word.trim();
		clue = data.clue.trim();
		initCanv();
		$("#clue").html(clue);
		drawBlanks();
		drawLetters();
	});
}

function initCanv() {
	var canvas = $("#game")[0];
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(66, 65, 83)";
	ctx.fillRect(0,0,400,400);
}

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

function drawLetters() {
	var s = "abcdefghijklmnopqrstuvwxyz";
	var liText = "";
	for(var i =0; i < s.length; i++){
		liText += '<li><a href="#" class="btn">'+s[i]+'</a></li>';
	}

	$("#letters ul").html(liText);

}


