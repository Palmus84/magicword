var playTimer = true;

var hours = 0;
var minutes = 0;
var seconds = 0;

var timerLoop = null;

function startTimer(field) {
    var timer = 0;
    timerLoop = setInterval(function () {
        var secondsTxt = '',
            minutesTxt = '',
            hoursTxt = '';

        // ======================================
        if(playTimer)
            seconds++;

        if(seconds == 60) {
            seconds = 0;
            minutes++;
            if(minutes == 60) {
                minutes = 0;
                hours++;
                if(hours == 24) {
                    hours = 0;
                }
            }
        }
        // ======================================
        if(seconds < 10) {
            if(seconds <= 0) {
                secondsTxt = '00';
            } else {
                secondsTxt = '0' + seconds.toString();
            }
        } else {
            secondsTxt = seconds.toString();
        }

        if(minutes < 10) {
            minutesTxt = '0' + minutes.toString();
        } else {
            minutesTxt = minutes.toString();
        }

        if(hours < 10) {
            hoursTxt = '0' + hours.toString();
        } else {
            hoursTxt = hours.toString();
        }
        // ======================================

        field.textContent = hoursTxt + ":" + minutesTxt + ":" + secondsTxt;

    }, 1000);
}

function GetTimer () {
    var timerArr = [3];
    timerArr[0] = hours;
    timerArr[1] = minutes;
    timerArr[2] = seconds;

    return timerArr;
}
function SetTimer (hh, mm, ss, fld) {
    if(timerLoop != null)
        clearInterval(timerLoop);

    hours = hh;
    minutes = mm;
    seconds = ss - 1;
    startTimer(fld);
}

function pauseResumeTimer () {
	playTimer = !playTimer;
    if(playTimer == true) {
        $.ajax({
          type: "GET",
          url: "txt_modificabili/bottone_interrompi.txt",
          dataType: "text",
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: function(data) {
                $('#interrompi').html(bottoneINTERROMPI);
                $('#interrompi').css("background", "rgba(255, 148, 119, 1.0)");
           },
           error: function (error) {alert("Errore nella chiamata AJAX");}
        });
    } else {
        $.ajax({
          type: "GET",
          url: "txt_modificabili/bottone_continua.txt",
          dataType: "text",
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: function(data) {
                $('#interrompi').html(bottoneCONTINUA);
                $('#interrompi').css("background", "rgba(9, 184, 177, 1.0)");
           },
           error: function (error) {alert("Errore nella chiamata AJAX");}
        });
        
    }
}