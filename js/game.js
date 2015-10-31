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
var thisRoundWords = [];

var wordsPoints = [];
var middlePoints = [];
//var totalPoints = 0;

var risultato;
var splice = 0;
var selectedButtons = [0];

$(document).ready(function() {
    	Storage.prototype.setArray = function(key, obj) {
		return this.setItem(key, JSON.stringify(obj));
	};
	Storage.prototype.getArray = function(key) {
	    return JSON.parse(this.getItem(key));
	};

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
                $.ajax({
                    type: "GET",
                    url: "categorie/"+temaButtonNome.toLowerCase()+".txt",
                    dataType: "text",
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    success: function(data) {
                        word_list = data.replace("à", "\u00E0").replace("è", " \u00E8").replace("ò", "\u00F2").replace("ù", "\u00F9").replace("ì", "\u00EC").toUpperCase().split(",");
                        nuovaGriglia();
                        PopulateGameView(temaButtonID, temaButtonNome, temaButtonRound, temaBackground);},
                    error: function (error) {alert("Errore nella chiamata AJAX");}
                });                
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
									firstRow.append('<div class="temaDiv"><button class="tema-off" id="' + id + '" onclick="SelectTema(' + id + ',' + nameString + ',' + round + ',' + bgString + ')"><img src="images/star.png" class="star"></img><div class="tema-off-cont"><label class="tema-off-label">' + name.toString() + '</label></div></button></div>');
								} else if(id > 5 && id <= 10) {
									secondRow.append('<div class="temaDiv"><button class="tema-off" id="' + id + '" onclick="SelectTema(' + id + ',' + nameString + ',' + round + ',' + bgString + ')"><img src="images/star.png" class="star"></img><div class="tema-off-cont"><label class="tema-off-label">' + name.toString() + '</label></div></button></div>');
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
        grigliaON = true;
        wordsPoints = [];
        thisRoundWords=[];
        
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
	leftHintStr += 'Trova le parole relative al lessico di <span class="intestazione">' + capName + '</span><br><br>In questa griglia sono presenti <span class="intestazione">'+risultato.total+' parole</span>';
        leftHintStr += '<br><br><span onClick="abbandonaRound();" class="cursor">Abbandona round</span>';
        
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
	s += 			'<button class="grid-button" id="1" onclick="SelectGridButton(1)">'+risultato.grid[0][0]+'</button>';
	s += 			'<button class="grid-button" id="2" onclick="SelectGridButton(2)">'+risultato.grid[0][1]+'</button>';
	s += 			'<button class="grid-button" id="3" onclick="SelectGridButton(3)">'+risultato.grid[0][2]+'</button>';
	s += 			'<button class="grid-button" id="4" onclick="SelectGridButton(4)">'+risultato.grid[0][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="5" onclick="SelectGridButton(5)">'+risultato.grid[1][0]+'</button>';
	s += 			'<button class="grid-button" id="6" onclick="SelectGridButton(6)">'+risultato.grid[1][1]+'</button>';
	s += 			'<button class="grid-button" id="7" onclick="SelectGridButton(7)">'+risultato.grid[1][2]+'</button>';
	s += 			'<button class="grid-button" id="8" onclick="SelectGridButton(8)">'+risultato.grid[1][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="9" onclick="SelectGridButton(9)">'+risultato.grid[2][0]+'</button>';
	s += 			'<button class="grid-button" id="10" onclick="SelectGridButton(10)">'+risultato.grid[2][1]+'</button>';
	s += 			'<button class="grid-button" id="11" onclick="SelectGridButton(11)">'+risultato.grid[2][2]+'</button>';
	s += 			'<button class="grid-button" id="12" onclick="SelectGridButton(12)">'+risultato.grid[2][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row-last">';
	s += 			'<button class="grid-button" id="13" onclick="SelectGridButton(13)">'+risultato.grid[3][0]+'</button>';
	s += 			'<button class="grid-button" id="14" onclick="SelectGridButton(14)">'+risultato.grid[3][1]+'</button>';
	s += 			'<button class="grid-button" id="15" onclick="SelectGridButton(15)">'+risultato.grid[3][2]+'</button>';
	s += 			'<button class="grid-button" id="16" onclick="SelectGridButton(16)">'+risultato.grid[3][3]+'</button>';
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
        grigliaON = true;
        wordsPoints = [];
        thisRoundWords=[];
        nuovaGriglia();
        
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
	leftHintStr += 'Trova le parole relative al lessico di <span class="intestazione">' + capName + '</span><br><br>In questa griglia sono presenti <span class="intestazione">'+risultato.total+' parole</span>';
        leftHintStr += '<br><br><span onClick="abbandonaRound();" class="cursor">Abbandona round</span>';
        
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
	s += 			'<button class="grid-button" id="1" onclick="SelectGridButton(1)">'+risultato.grid[0][0]+'</button>';
	s += 			'<button class="grid-button" id="2" onclick="SelectGridButton(2)">'+risultato.grid[0][1]+'</button>';
	s += 			'<button class="grid-button" id="3" onclick="SelectGridButton(3)">'+risultato.grid[0][2]+'</button>';
	s += 			'<button class="grid-button" id="4" onclick="SelectGridButton(4)">'+risultato.grid[0][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="5" onclick="SelectGridButton(5)">'+risultato.grid[1][0]+'</button>';
	s += 			'<button class="grid-button" id="6" onclick="SelectGridButton(6)">'+risultato.grid[1][1]+'</button>';
	s += 			'<button class="grid-button" id="7" onclick="SelectGridButton(7)">'+risultato.grid[1][2]+'</button>';
	s += 			'<button class="grid-button" id="8" onclick="SelectGridButton(8)">'+risultato.grid[1][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row">';
	s += 			'<button class="grid-button" id="9" onclick="SelectGridButton(9)">'+risultato.grid[2][0]+'</button>';
	s += 			'<button class="grid-button" id="10" onclick="SelectGridButton(10)">'+risultato.grid[2][1]+'</button>';
	s += 			'<button class="grid-button" id="11" onclick="SelectGridButton(11)">'+risultato.grid[2][2]+'</button>';
	s += 			'<button class="grid-button" id="12" onclick="SelectGridButton(12)">'+risultato.grid[2][3]+'</button>';
	s += 		'</div>';
	s += 		'<div class="grid-row-last">';
	s += 			'<button class="grid-button" id="13" onclick="SelectGridButton(13)">'+risultato.grid[3][0]+'</button>';
	s += 			'<button class="grid-button" id="14" onclick="SelectGridButton(14)">'+risultato.grid[3][1]+'</button>';
	s += 			'<button class="grid-button" id="15" onclick="SelectGridButton(15)">'+risultato.grid[3][2]+'</button>';
	s += 			'<button class="grid-button" id="16" onclick="SelectGridButton(16)">'+risultato.grid[3][3]+'</button>';
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

function SelectGridButton (id) {
	if(playTimer == true) {
		if(!$("#" + id).hasClass('grid-button-selected')) {
                    var p=selectedButtons[selectedButtons.length-1];
                    if(p==0||isAjdacent(id,p)){
                        $("#" + id).addClass('grid-button-selected');
                        currentWord += document.getElementById(id).innerHTML.toString();
                        document.getElementById('wordField').innerHTML = currentWord;
                        selectedButtons.push(id);
                        console.log(selectedButtons);
                    }
		} /*else {
			$("#" + id).removeClass('grid-button-selected');
		}*/
		
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
            selectedButtons=[0];
		if(document.getElementById('wordField').innerHTML.length > 0) {
			var tempArr = new Array();
                        tempArr = thisRoundWords;
                        if(tempArr.indexOf(currentWord) < 0){//controllo parola gia inserita
                            thisRoundWords.push(currentWord);
                            CalculatePoints(currentWord);
                        
                            setTimeout( function () {
                                    SetPunti(pt);	
                            }, 100);
                        }else{
                            alert("Parola gia' inserita");
                        }
		} else {
			alert("Nessuna parola da inviare");
		}
        
    }
}

function SetPunti(punti) {
	document.getElementById('founded-words').innerHTML += currentWord + ' - ' + punti + ' punti<br>';

	if(pt == 200) {
		wordsPoints.push(200);
		if(currentWordboxCounter == risultato.total-1) {
			currentWordboxCounter = 0;
			if(currentRound != maxRound) {
				RoundFinished();
			} else {
				MatchFinished();
			}
		} else {
			currentWordboxCounter++;
		}
                var tempArr = new Array();
                tempArr = wordboxWords;
                if(tempArr.indexOf(currentWord) < 0){
                    totalWordboxCounter++;
                    UpdateWordboxStorage(currentWord);
                }
	} else if(pt == 100) {
		wordsPoints.push(100);
		var tempArr = new Array();
                tempArr = wordboxWords;
                if(tempArr.indexOf(currentWord) < 0){
                    totalWordboxCounter++;
                    UpdateWordboxStorage(currentWord);
                }
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
	/*if(playTimer == true) {
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
	}*/
        ResetGridButtons();
        currentWord = "";
        document.getElementById('wordField').innerHTML = "";
        selectedButtons=[0];
}

function RoundFinished () {
	var str = '';
	str += '<span class="intestazione">Bravo</span>, hai trovato tutte le parole di questa griglia';
	str += '<br><br>';
	str += '<a onclick="UpdateGameView(temaButtonID, temaButtonNome, currentRound + 1, temaBackground)" class="intestazione cursor" >Prosegui con la prossima griglia >></a>';
	document.getElementById('founded-words').innerHTML += '<hr>';
	document.getElementById('founded-words').innerHTML += 'Totale Round - ' + CalcMiddlePoints() + ' punti<br>';
	document.getElementById('hint').innerHTML = str;
}

function MatchFinished () {
	var str = '';
	str += '<span class="intestazione">Bravo</span>, hai trovato tutte le parole di questa partita';
	str += '<br><br>';
	str += '<a onclick="PopulateGameHome()" class="intestazione cursor">Gioca una nuova partita >></a>';
	SetThemesArray(temaButtonID, true);
	document.getElementById('founded-words').innerHTML += '<hr>';
	document.getElementById('founded-words').innerHTML += 'Totale Partita - ' + CalcTotalPoints() + ' punti<br>';
	document.getElementById('hint').innerHTML = str;
}

function CheckDictionary(word) {
        $.ajax({
            type: "GET",
            url: "dizionario/dizionarioITA.txt",
            dataType: "text",
            success: function(data) {
                var diz = data.toLowerCase().split(" ");
                for(var i = 0; i < diz.length; i++) {
                        if(word.toLowerCase() == diz[i]) {
                                pt = 100;
                                break;
                        } else {
                                if(i == diz.length - 1) {
                                        pt = 0;
                                        //console.log(word.toLowerCase() + " non esiste");
                                        break;
                                }
                        }
                }
            },
            error: function (error) {alert("Errore nella chiamata AJAX");}
        });           
}

function CalculatePoints (word) {
        pt=0;
	for(n=0; n<risultato.total; n++){
            if (word_list[n].toUpperCase() == word.toUpperCase()){
                pt=200;
            }
        }
        if(pt==0){
            CheckDictionary(word);
        }
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
                $('#popup').addClass('dictionary');
		$('#popup').removeClass('popup-hidden');
		$('#popupCont').innerHTML = '';

		var str = '';
		/*str += '<ul>';
		for(var i = 0; i < risultato.total ; i++) {
			
			str += '<li>' + word_list[i].toUpperCase() + '</li>';
		}
		str += '</ul>';*/
                str+='<div id="wiki"><input type="text" id="parolaWiki" name="parola" placeholder="cerca il significato di una parola">';
                str+='<input type="submit" id="cercaWiki" onclick="Wikizionario()" name="invia" value="Cerca su Wikizionario"></div>';
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

        } else if(type == 2) {
		$('#popup').removeClass('popup-hidden');
		$('#popupCont').innerHTML = '';

		var str = '<div id="credits">';
                $.ajax({
                    type: "GET",
                    url: "credits.txt",
                    dataType: "text",
                    success: function(data) {
                        str+=data.replace("à", "\u00E0").replace("è", " \u00E8").replace("ò", "\u00F2").replace("ù", "\u00F9").replace("ì", "\u00EC").replace(/\n/g, "<br />");;
                        str+='</div>';
                        $('#popupCont').append(str);
                    },
                    error: function (error) {alert("Errore nella chiamata AJAX");}
                });    	
	}
}

function ClosePopup () {
        $('#popup').removeClass('dictionary');
	$('#popup').addClass('popup-hidden');
}


function nuovaGriglia(){
    word_list.splice(0, splice);
    var Test = Repeated(LookbackCreatorJS);
    risultato = new Test(4, word_list, 500).run();
    for (var row in risultato.grid) {
        for (var col in risultato.grid[row]) {
            if(risultato.grid[row][col].toString().contains("-")){
                risultato.grid[row][col]=lettere[Math.floor(Math.random()*lettere.length)].toUpperCase();
            }
        }
    }
    splice=risultato.total;
}
function isAjdacent(id , p) {
    var x1 = toX(id);
    var x2 = toX(p);
    var y1 = toY(id);
    var y2 = toY(p);
    if(x1==x2&&y1==y2-1||x1==x2&&y1==y2+1){return true;}
    if(y1==y2&&x1==x2-1||y1==y2&&x1==x2+1){return true;}
    if(x1==x2+1&&y1==y2+1||x1==x2+1&&y1==y2-1||x1==x2-1&&y1==y2+1||x1==x2-1&&y1==y2-1){return true;}
}
function toY(val) {
    var x=1;
    if(val>4){x=2;}
    if(val>8){x=3;}
    if(val>12){x=4;}
    return x;
}
function toX(val){
    if(val==1||val==5||val==9||val==13){return 1;}
    if(val==2||val==6||val==10||val==14){return 2;}
    if(val==3||val==7||val==11||val==15){return 3;}
    if(val==4||val==8||val==12||val==16){return 4;}

}
function Wikizionario(){
    var url="https://it.wiktionary.org/wiki/";
    url+=document.getElementById("parolaWiki").value;
    window.open(url, '_blank');
}
 function abbandonaRound(){
    if(currentRound != maxRound) {
            var str = '';
            str += '<span class="intestazione">Round abbandonato.</span>';
            str += '<br><br>';
            str += '<a onclick="UpdateGameView(temaButtonID, temaButtonNome, currentRound + 1, temaBackground)" class="intestazione cursor" >Prosegui con la prossima griglia >></a>';
            var str2="Le parole di questo round erano:";
            str += '<ul>';
            for(var i = 0; i < risultato.total ; i++) {

                    str2 += '<li>' + word_list[i].toUpperCase() + '</li>';
            }
            str2 += '</ul>';
            str2 += '<hr>';
            str2+='Totale Round - ' + CalcMiddlePoints() + ' punti<br>';
            document.getElementById('founded-words').innerHTML += str2;
            document.getElementById('hint').innerHTML = str;
    } else {
            var str = '';
            str += '<span class="intestazione">Ultimo round abbandonato.</span>';
            str += '<br><br>';
            str += '<a onclick="PopulateGameHome()" class="intestazione cursor">Gioca una nuova partita >></a>';
            SetThemesArray(temaButtonID, true);
            var str2="Le parole di questo round erano:";
            str += '<ul>';
            for(var i = 0; i < risultato.total ; i++) {

                    str2 += '<li>' + word_list[i].toUpperCase() + '</li>';
            }
            str2 += '</ul>';
            str2 += '<hr>';
            str2+= 'Totale Partita - ' + CalcTotalPoints() + ' punti<br>';
            document.getElementById('founded-words').innerHTML += str2;
            document.getElementById('hint').innerHTML = str;
    }
 }