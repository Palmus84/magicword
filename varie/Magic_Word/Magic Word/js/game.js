var temaButtonID = 0;
var temaButtonNome = "";
var temaButtonRound = 0;
var temaBackground = "";

var gameContainer = null;

var currentWord = "";
var previousWordCounter = 0;
var currentRound = 0;
var maxRound = 0;

var totalWordboxCounter = 0;
var currentWordboxCounter = 0;

var pt = 0;

var wordboxWords = [];

var wordsPoints = [];
var middlePoints = [];
//var totalPoints = 0;

$(document).ready(function() {
	Storage.prototype.setArray = function(key, obj) {
		return this.setItem(key, JSON.stringify(obj));
	}
	Storage.prototype.getArray = function(key) {
	    return JSON.parse(this.getItem(key));
	}

	if(window.localStorage.getItem("wordbox") == null) {
		window.localStorage.setItem("wordbox", wordboxWords);
	} else {
		window.localStorage.clear("wordbox");
		window.localStorage.setItem("wordbox", wordboxWords);
		//wordboxWords = window.localStorage.getItem("wordbox");
	}


	//totalWordboxCounter = wordboxWords.length;
});

function UpdateWordboxStorage (wordItem) {
	var tempArr = new Array();
	tempArr = wordboxWords;
	tempArr.push(wordItem.toString());
	window.localStorage.setItem("wordbox", tempArr);
}

function SelectTema (temaID, temaName, temaRound, temaBG) {
	temaButtonID = temaID;
	temaButtonNome = temaName;
	temaButtonRound = temaRound;
	temaBackground = temaBG;

	getWords();
}

$(document).ready(function () {
	gameContainer = $("#game-content");
	PopulateGameHome();
});

function GiocaButtonDown () {
	if(temaButtonID == 0) {
		alert("seleziona un tema e poi premi GIOCA");
	} else {
		/*document.getElementById('gioca').onclick = function() {
			var t = 'repeated-test-lookback';
			document.getElementById(t + "-button2").click();
		};*/

		/*document.getElementById('gioca').onclick = function(x) {
			return function () {
				run_entire_list(Repeated(LookbackCreatorJS), 0);
			}
		}(Repeated(LookbackCreatorJS));*/
		
		PopulateGameView(temaButtonID, temaButtonNome, temaButtonRound, temaBackground);
	}
}

function PopulateGameHome () {
	//console.log(dizionario);

	temaButtonID = 0;
	temaButtonNome = "";
	temaButtonRound = 0;
	temaBackground = "";

	$.ajax({
		type: "GET",
		url: "magicWord.xml",
		dataType: "xml",
		success: function(xml) {
			gameContainer.html("");
			$('#bgCont').css('background-image', 'url("images/background/bolognaplus.jpg")');
			var initText = '';

			initText += '<div class="rows-cont" id="rows-cont">';
			initText += '<div class="first-row" id="row-1">';
			initText += '</div>';

			initText += '<div class="second-row" id="row-2">';
			initText += '</div>';

			initText += '<button class="gioca-button" id="gioca" onclick="GiocaButtonDown()">GIOCA!</button>';

			initText += '</div>';

			gameContainer.append(initText);

			var firstRow = $('.first-row');
			var secondRow = $('.second-row');

			var matchNumber = $(xml).find("matchNumber").text();
			var s = "";
			
			if(matchNumber > 0) {
				$(xml).find("match").each(function() {
					var id = $(this).attr("id");
					var name = $(this).find("name").text().toUpperCase();
					var round = $(this).find("currentRound").text();
					var bgImg = $(this).find("themeBg").text();

					var nameString = "";
					nameString += "'";
					nameString += name.toString();
					nameString += "'";

					var bgString = "";
					bgString += "'";
					bgString += bgImg.toString();
					bgString += "'";

					var chkThemes = new Array();
					chkThemes = window.localStorage.getArray("themes");

					for(var i = 0; i < matchNumber; i++) {
						if(chkThemes[i].id == id) {
							if(chkThemes[i].completed == false) {
								if(id <= 5) {
									firstRow.append('<div class="temaDiv"><button class="tema-button" id="' + id + '" onclick="SelectTema(' + id + ',' + nameString + ',' + round + ',' + bgString + ')"><div class="tema-button-cont"><label class="tema-button-label">' + name.toString() + '</label></div></button></div>');
								} else if(id > 5 && id <= 10) {
									secondRow.append('<div class="temaDiv"><button class="tema-button" id="' + id + '" onclick="SelectTema(' + id + ',' + nameString + ',' + round + ',' + bgString + ')"><div class="tema-button-cont"><label class="tema-button-label">' + name.toString() + '</label></div></button></div>');
								}
							} else {
								if(id <= 5) {
									firstRow.append('<div class="temaDiv"><button class="tema-off" id="' + id + '"><img src="images/star.png" class="star"></img><div class="tema-off-cont"><label class="tema-off-label">' + name.toString() + '</label></div></button></div>');
								} else if(id > 5 && id <= 10) {
									secondRow.append('<div class="temaDiv"><button class="tema-off" id="' + id + '"><img src="images/star.png" class="star"></img><div class="tema-off-cont"><label class="tema-off-label">' + name.toString() + '</label></div></button></div>');
								}
							}
						}
					}

					
				});
			} else {
				s += '<h1>No Matches found</h1>';
			}

			var firstRow_width = (firstRow.width() / 2);
			var styleLeft_1 = 'calc(50% - ' + firstRow_width + 'px)';

			var secondRow_width = (secondRow.width() / 2);
			var styleLeft_2 = 'calc(50% - ' + secondRow_width + 'px)';

			$('.tema-button-cont').each(function() {
				if($(this).height() == 30.0) {
					$(this).css("line-height", "30px");
				}
			});

			$('.tema-off-cont').each(function() {
				if($(this).height() == 30.0) {
					$(this).css("line-height", "30px");
				}
			});


			document.getElementById("row-1").style.left = styleLeft_1;
			document.getElementById("row-2").style.left = styleLeft_2;
		},
		error: function (error) {
			alert("Errore nella chiamata AJAX");
		}
	});

	/*document.getElementById('gioca').onclick = function(x) {
      return function() { run_entire_list(x, 0) }
    }('repeated-test-lookback');*/
}

function PopulateGameView (idTema, nomeTema, numeroRound, bgTema) {
	currentRound = numeroRound;
	gameContainer.html("");
	bgTema.replace("'", "");
	$('#bgCont').css('background-image', 'url("images/background/' + bgTema + '.jpg")');

	var capName = "";
	for(var i = 0; i < nomeTema.length; i++) {
		if(i == 0) {
			capName += nomeTema[0].toUpperCase();
		} else {
			capName += nomeTema[i].toLowerCase();
		}
	}

	$.ajax({
		type: "GET",
		url: "magicWord.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find("match").each(function() {
				var id = $(this).attr("id");
				if(id == temaButtonID) {
					maxRound = $(this).find("numberOfSubmatch").text();
				}
			});
		},
		error: function (error) {
			alert("Errore nella chiamata AJAX");
		}
	});

	var leftHintStr = '';
	leftHintStr += 'Trova le parole relative al lessico di <span class="intestazione">' + capName + '</span><br><br>In questa griglia sono presenti <span class="intestazione">9 parole</span>';
	
	var s = '';
	
	s += '<div class="match-title">';
	s += 	'<span>' + nomeTema.toUpperCase() + ' - ROUND ' + currentRound + '</span>';
	s += '</div>';
	s += '<div class="left-column">';
	s += 	'<div class="left-hint">';
	s +=		'<div class="left-bg" id="hint">' + leftHintStr + '</div>';	
	s += 	'</div>';
	s += 	'<button class="left-button" id="interrompi" onclick="pauseResumeTimer()">INTERROMPI</button>';
	s += '</div>';

	s += '<div class="middle-column">';
		
	s += 	'<div class="grid-cont" id="grid">';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="1" onclick="SelectGridButton(1)">N</button>';
	s += 			'<button class="grid-button" id="2" onclick="SelectGridButton(2)">I</button>';
	s += 			'<button class="grid-button" id="3" onclick="SelectGridButton(3)">P</button>';
	s += 			'<button class="grid-button" id="4" onclick="SelectGridButton(4)">C</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="5" onclick="SelectGridButton(5)">T</button>';
	s += 			'<button class="grid-button" id="6" onclick="SelectGridButton(6)">O</button>';
	s += 			'<button class="grid-button" id="7" onclick="SelectGridButton(7)">G</button>';
	s += 			'<button class="grid-button" id="8" onclick="SelectGridButton(8)">U</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="9" onclick="SelectGridButton(9)">E</button>';
	s += 			'<button class="grid-button" id="10" onclick="SelectGridButton(10)">I</button>';
	s += 			'<button class="grid-button" id="11" onclick="SelectGridButton(11)">N</button>';
	s += 			'<button class="grid-button" id="12" onclick="SelectGridButton(12)">A</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row-last">';
	s += 			'<button class="grid-button" id="13" onclick="SelectGridButton(13)">A</button>';
	s += 			'<button class="grid-button" id="14" onclick="SelectGridButton(14)">Z</button>';
	s += 			'<button class="grid-button" id="15" onclick="SelectGridButton(15)">O</button>';
	s += 			'<button class="grid-button" id="16" onclick="SelectGridButton(16)">T</button>';
	s += 		'</div>';
	s += 	'</div>';
		
	s += 	'<div class="word-field-cont">';
	s += 		'<div class="word-field">';
	s += 			'<button class="sendWord" id="sendWord" onclick="SendWord()">send</button>';
	s += 			'<button class="deleteChar" id="deleteChar" onclick="DeleteLastChar()">x</button>';
	s += 			'<label id="wordField"></label>';
	s += 		'</div>'
	s += 	'</div>';
	s += 	'<div class="timer-field"><label id="timerField"></label></div>';
	s += '</div>';

	s += '<div class="right-column">';
	s += 	'<div class="found-field">';
	s +=		'<div class="right-bg" id="founded-words"></div>';
	s +=	'</div>';

	s += 	'<button class="dizionario-button" id="dizionario" onclick="PopulatePopup(0)">';
	s += 		'<img src="images/buttons/dizionario.png">';
	s += 		'<p>DIZIONARIO</p>';
	s += 	'</button>';

	s += 	'<button class="wordbox-button" id="wordbox" onclick="PopulatePopup(1)">';
	s +=		'<div class="wordCount">';
	s +=			'<label id="wordboxCounter">' + totalWordboxCounter + '</label>';
	s +=		'</div>';
	s += 		'<img src="images/buttons/wordbox.png">';
	s += 		'<p>WORDBOX</p>';
	s += 	'</button>';

	s += '</div>';
	
	gameContainer.append(s);

	var timerField = document.getElementById('timerField');
    SetTimer(0,0,0,timerField);

    setTimeout(function () {
    	for(var i = 1; i < 17; i++) {
	    	$('#' + i).fadeIn("slow");
	    }
    }, 500);
}

function UpdateGameView (idTema, nomeTema, numeroRound, bgTema) {
	currentRound = numeroRound;
	gameContainer.html("");
	bgTema.replace("'", "");
	$('#bgCont').css('background-image', 'url("images/background/' + bgTema + '.jpg")');

	var capName = "";
	for(var i = 0; i < nomeTema.length; i++) {
		if(i == 0) {
			capName += nomeTema[0].toUpperCase();
		} else {
			capName += nomeTema[i].toLowerCase();
		}
	}

	var leftHintStr = '';
	leftHintStr += 'Trova le parole relative al lessico di <span class="intestazione">' + capName + '</span><br><br>In questa griglia sono presenti <span class="intestazione">9 parole</span>';
	
	var s = '';
	
	s += '<div class="match-title">';
	s += 	'<span>' + nomeTema.toUpperCase() + ' - ROUND ' + numeroRound + '</span>';
	s += '</div>';
	s += '<div class="left-column">';
	s += 	'<div class="left-hint">';
	s +=		'<div class="left-bg" id="hint">' + leftHintStr + '</div>';	
	s += 	'</div>';
	s += 	'<button class="left-button" id="interrompi" onclick="pauseResumeTimer()">INTERROMPI</button>';
	s += '</div>';

	s += '<div class="middle-column">';
		
	s += 	'<div class="grid-cont" id="grid">';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="1" onclick="SelectGridButton(1)">N</button>';
	s += 			'<button class="grid-button" id="2" onclick="SelectGridButton(2)">I</button>';
	s += 			'<button class="grid-button" id="3" onclick="SelectGridButton(3)">P</button>';
	s += 			'<button class="grid-button" id="4" onclick="SelectGridButton(4)">C</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="5" onclick="SelectGridButton(5)">T</button>';
	s += 			'<button class="grid-button" id="6" onclick="SelectGridButton(6)">O</button>';
	s += 			'<button class="grid-button" id="7" onclick="SelectGridButton(7)">G</button>';
	s += 			'<button class="grid-button" id="8" onclick="SelectGridButton(8)">U</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="9" onclick="SelectGridButton(9)">E</button>';
	s += 			'<button class="grid-button" id="10" onclick="SelectGridButton(10)">I</button>';
	s += 			'<button class="grid-button" id="11" onclick="SelectGridButton(11)">N</button>';
	s += 			'<button class="grid-button" id="12" onclick="SelectGridButton(12)">A</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row-last">';
	s += 			'<button class="grid-button" id="13" onclick="SelectGridButton(13)">A</button>';
	s += 			'<button class="grid-button" id="14" onclick="SelectGridButton(14)">Z</button>';
	s += 			'<button class="grid-button" id="15" onclick="SelectGridButton(15)">O</button>';
	s += 			'<button class="grid-button" id="16" onclick="SelectGridButton(16)">T</button>';
	s += 		'</div>';
	s += 	'</div>';
		
	s += 	'<div class="word-field-cont">';
	s += 		'<div class="word-field">';
	s += 			'<button class="sendWord" id="sendWord" onclick="SendWord()">send</button>';
	s += 			'<button class="deleteChar" id="deleteChar" onclick="DeleteLastChar()">x</button>';
	s += 			'<label id="wordField"></label>';
	s += 		'</div>'
	s += 	'</div>';
	s += 	'<div class="timer-field"><label id="timerField"></label></div>';
	s += '</div>';

	s += '<div class="right-column">';
	s += 	'<div class="found-field">';
	s +=		'<div class="right-bg" id="founded-words"></div>';
	s +=	'</div>';

	s += 	'<button class="dizionario-button" id="dizionario" onclick="PopulatePopup(0)">';
	s += 		'<img src="images/buttons/dizionario.png">';
	s += 		'<p>DIZIONARIO</p>';
	s += 	'</button>';

	s += 	'<button class="wordbox-button" id="wordbox" onclick="PopulatePopup(1)">';
	s +=		'<div class="wordCount">';
	s +=			'<label id="wordboxCounter">' + totalWordboxCounter + '</label>';
	s +=		'</div>';
	s += 		'<img src="images/buttons/wordbox.png">';
	s += 		'<p>WORDBOX</p>';
	s += 	'</button>';

	s += '</div>';
	
	gameContainer.append(s);

	var timerField = document.getElementById('timerField');
	var timerValues = new Array();
	
	timerValues = GetTimer();
    SetTimer(timerValues[0],timerValues[1],timerValues[2],timerField);

    setTimeout(function () {
    	for(var i = 1; i < 17; i++) {
	    	$('#' + i).fadeIn("slow");
	    }
    }, 500);
}

function SelectGridButton (buttonId) {
	if(playTimer == true) {
		if(!$("#" + buttonId).hasClass('grid-button-selected')) {
			$("#" + buttonId).addClass('grid-button-selected');
		} else {
			$("#" + buttonId).removeClass('grid-button-selected');
		}
		currentWord += document.getElementById(buttonId).innerHTML.toString();
		document.getElementById('wordField').innerHTML = currentWord;
	}
}

function ResetGridButtons () {
	for(var i = 0; i < 16; i++) {
		if( $("#" + (i + 1)).hasClass('grid-button-selected') ) {
			$("#" + (i + 1)).removeClass('grid-button-selected');
		}
	}
}

function SendWord () {
	if(playTimer == true) {
		if(document.getElementById('wordField').innerHTML.length > 0) {
			CalculatePoints(currentWord);

			setTimeout( function () {
				SetPunti(pt);	
			}, 100);
		} else {
			alert("Nessuna parola da inviare");
		}
	}
}

function SetPunti(punti) {
	document.getElementById('founded-words').innerHTML += currentWord + ' - ' + punti + ' punti<br>';

	if(pt == 200) {
		totalWordboxCounter++;
		wordsPoints.push(200);
		if(currentWordboxCounter == 3) {
			currentWordboxCounter = 0;
			if(currentRound != maxRound) {
				RoundFinished();
			} else {
				MatchFinished();
			}
		} else {
			currentWordboxCounter++;
		}
		UpdateWordboxStorage(currentWord);
	} else if(pt == 100) {
		wordsPoints.push(100);
		totalWordboxCounter++;
		UpdateWordboxStorage(currentWord);
	}

	
	currentWord = "";
	document.getElementById('wordField').innerHTML = currentWord;
	document.getElementById('wordboxCounter').innerHTML = totalWordboxCounter;
	ResetGridButtons();
}

function UpdateWordbox () {
	document.getElementById('wordField').innerHTML = currentWord;
	document.getElementById('wordboxCounter').innerHTML = totalWordboxCounter;
}

function DeleteLastChar () {
	if(playTimer == true) {
		var lastWord = document.getElementById('wordField').innerHTML;

		if(lastWord.length > 0) {
			var newStr = "";
			for(var i = 0; i < lastWord.length-1; i++) {
				newStr += lastWord[i];
			}
			currentWord = newStr;
			document.getElementById('wordField').innerHTML = newStr;

			if(lastWord.length == 1) {
				ResetGridButtons();
			}
		}
	}
}

function RoundFinished () {
	var str = '';
	str += '<span class="intestazione">Bravo</span>, hai trovato tutte le parole di questa griglia';
	str += '<br><br>';
	str += '<a onclick="UpdateGameView(temaButtonID, temaButtonNome, currentRound + 1, temaBackground)" class="intestazione">Prosegui con la prossima griglia >></a>';
	document.getElementById('founded-words').innerHTML += '<hr>';
	document.getElementById('founded-words').innerHTML += 'Totale Round - ' + CalcMiddlePoints() + ' punti<br>';
	document.getElementById('hint').innerHTML = str;
	wordsPoints = [];
}

function MatchFinished () {
	var str = '';
	str += '<span class="intestazione">Bravo</span>, hai trovato tutte le parole di questa partita';
	str += '<br><br>';
	str += '<a onclick="PopulateGameHome()" class="intestazione">Gioca una nuova partita >></a>';
	SetThemesArray(temaButtonID, true);
	document.getElementById('founded-words').innerHTML += '<hr>';
	document.getElementById('founded-words').innerHTML += 'Totale Partita - ' + CalcTotalPoints() + ' punti<br>';
	document.getElementById('hint').innerHTML = str;
}

function CheckDictionary(word) {
	for(var i = 0; i < dizionario.length; i++) {
		if(word.toLowerCase() === dizionario[i].toLowerCase()) {
			pt = 100;
			//console.log(word.toLowerCase() + " trovata nel dizionario ==> " + dizionario[i].toLowerCase());
			break;
		} else {
			if(i == dizionario.length - 1) {
				pt = 0;
				//console.log(word.toLowerCase() + " non esiste");
				break;
			}
		}
	}
}

function CalculatePoints (word) {
	$.ajax({
		type: "GET",
		url: "magicWord.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find("match").each(function() {
				var id = $(this).attr("id");
				if(id == temaButtonID) {
					var entries = new Array();
					entries = $(this).find("entries").text().split(',');

					for(var i = 0; i < entries.length; i++) {
						if(i != entries.length - 1) {
							if(word.toLowerCase() === entries[i].toLowerCase()) {
								pt = 200;
								//console.log(word.toLowerCase() + " trovata nelle entries ==> " + entries[i].toLowerCase());
								break;
							}
						} else if(i == entries.length - 1) {
							if(word.toLowerCase() === entries[i].toLowerCase()) {
								pt = 200;
								//console.log(word.toLowerCase() + " trovata nelle entries ==> " + entries[i].toLowerCase());
								break;
							} else {
								//console.log("cerco nel dizionario");
								CheckDictionary(word);
							}
						}
					}
				}
			});
		},
		error: function (error) {
			alert("Errore nella chiamata AJAX");
		}
	});
}

function CalcMiddlePoints() {
	var tempPt = 0;
	for(var i = 0; i < wordsPoints.length; i++) {
		tempPt += wordsPoints[i];
	}
	middlePoints.push(tempPt);
	//console.log(wordsPoints);
	return tempPt;
}

function CalcTotalPoints() {
	CalcMiddlePoints();

	var tempPt = 0;
	for(var i = 0; i < middlePoints.length; i++) {
		tempPt += middlePoints[i];
	}
	totalPoints = tempPt;
	//console.log(middlePoints);
	return tempPt;
}

function PopulatePopup (type) {
	$('#popup').html('');
	$('#popup').append('<button class="popup-close" onclick="ClosePopup()"><img src="images/close.png"></button>');
	$('#popup').append('<div class="popup-cont" id="popupCont"></div>');

	if(type == 0) {
		$('#popup').removeClass('popup-hidden');
		$('#popupCont').innerHTML = '';

		var str = '';
		str += '<ul>';
		for(var i = 0; i < dizionario.length; i++) {
			
			str += '<li>' + dizionario[i].toUpperCase() + '</li>';
		}
		str += '</ul>';
		$('#popupCont').append(str);
	} else if(type == 1) {
		$('#popup').removeClass('popup-hidden');
		$('#popupCont').innerHTML = '';

		var str = '';
		str += '<ul>';
		for(var i = 0; i < wordboxWords.length; i++) {
			
			str += '<li>' + wordboxWords[i].toUpperCase() + '</li>';
		}
		str += '</ul>';
		$('#popupCont').append(str);
	}
}

function ClosePopup () {
	$('#popup').addClass('popup-hidden');
}
