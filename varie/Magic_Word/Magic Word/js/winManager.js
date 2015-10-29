var themes = [
	{
		"id":1,
		"completed":false
	},
	{
		"id":2,
		"completed":false
	},
	{
		"id":3,
		"completed":false
	},
	{
		"id":4,
		"completed":false
	},
	{
		"id":5,
		"completed":false
	},
	{
		"id":6,
		"completed":false
	},
	{
		"id":7,
		"completed":false
	},
	{
		"id":8,
		"completed":false
	},
	{
		"id":9,
		"completed":false
	}
];

$(document).ready(function() {
	window.localStorage.setArray("themes", themes);
	SetThemesArray();
});

Storage.prototype.setArray = function(key, obj) {
	return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key));
}

function SetThemesArray (temaId, finish) {
	var oldThemes = new Array();
	var newThemes = new Array();
	oldThemes = window.localStorage.getArray("themes");
	newThemes = oldThemes;
	//console.log(newThemes);

	for(var i = 0; i < newThemes.length; i++) {
		if(newThemes[i].id == temaId) {
			newThemes[i].completed = finish;
			console.log("tema " + newThemes[i].id + " completato " + newThemes[i].completed);
		}
	}

	window.localStorage.clear("themes");
	window.localStorage.setArray("themes", newThemes);
}


