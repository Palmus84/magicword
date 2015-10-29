'use strict';

var clear_containers = function(containers_array) {
  for (var i in containers_array) {
    var c = containers_array[i];
    while (c.firstChild) {
      c.removeChild(c.firstChild);
    }
  }
};

var run_test = function(test_id) {
  var GRID_SIDE = document.getElementById("grid_side").value;
  var TIMEOUT_MS = 300;
  
  var test = document.getElementById("repeated-test-lookback");
  if (test === null) {
    return;
  }
  // Clear the table
  clear_containers([test]);
  
  // Compute word list
  var word_list = document.getElementById("wordlist").value.toUpperCase().split("\n");

  // Create the test object and "run" it
  var Test = Repeated(LookbackCreatorJS);
  var result = new Test(GRID_SIDE, word_list, TIMEOUT_MS).run();

  // Show the table
  for (var row in result.grid) {
    var tr = document.createElement("tr");
    for (var col in result.grid[row]) {
      var td = document.createElement("td");
      td.innerHTML = result.grid[row][col];
      tr.appendChild(td);
    }
    test.appendChild(tr);
  }
};

window.onload = function() {
  var width = 0;
  var t ="repeated-test-lookback";
    var test = document.createElement("div");
    var test_wrapper = document.createElement("div");
    var table = document.createElement("table");
    var button = document.createElement("button");

    table.id = t;
    button.id = t + "-button";

    button.onclick = function(x) {
      return function() { run_test(x); };
    }(t);

    button.classList.add("test");
    button.innerHTML = "<i class='fa fa-play'></i> " + t;

    test.appendChild(button);
    test.appendChild(table);

    test_wrapper.appendChild(test);
    test_wrapper.classList.add("test");
    document.getElementById("test-container").appendChild(test_wrapper);

    width += test.offsetWidth;
  

  document.body.style.width = width + "px";
};
