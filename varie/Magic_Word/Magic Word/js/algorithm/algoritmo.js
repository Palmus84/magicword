var wrdArr = [];

function getWords() {
    console.log("getWords");
    $.ajax({
        type: "GET",
        url: "magicWord.xml",
        dataType: "xml",
        success: function(xml) {
            $('#wordlist').html('');
            $(xml).find("match").each(function() {
                var id = $(this).attr("id");
                if(id == temaButtonID) {
                    var wrd = $(this).find("entries").text().split(",");
                    for(var i = 0; i < wrd.length; i++) {
                        if(i == wrd.length - 1)
                            $('#wordlist').append(wrd[i]);
                        else
                            $('#wordlist').append(wrd[i]+"\n");
                    }
                }
            });
        },
        error: function (error) {
            alert("Errore nella chiamata AJAX");
        }
    });

    wrdArr = document.getElementById("wordlist").value.toUpperCase().split("\n");
}