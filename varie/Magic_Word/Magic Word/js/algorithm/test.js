'use strict'

var Repeated = function(Test) {
  return function(grid_side, word_list, timeout_ms) {
    var start_time = new Date().getTime()

    this.run = function() {
      var best = 0
      var grid = []
      var runs = 0
      var remaining = timeout_ms

      while (remaining > 0) {
        var start = new Date().getTime()

        var candidate = new Test(grid_side, word_list, remaining).run()
        if (candidate.total > best) {
          best = candidate.total
          grid = candidate.grid
        }
        runs += 1

        // subtract elapsed time for this run
        remaining -= (new Date().getTime() - start)
      }

      return {
        "grid": grid,
        "total": best,
        "runs": runs
      }
    }
  }
}

var TESTS = {
  "repeated-test-lookback": [
    Repeated(LookbackCreatorJS),
    ''
  ]
}

var clear_containers = function(containers_array) {
  for (var i in containers_array) {
    var c = containers_array[i]
    while (c.firstChild) {
      c.removeChild(c.firstChild)
    }
  }
}

var clear_all = function() {
  if (confirm('Are you sure?')) {
    clear_containers(document.getElementsByTagName("ol"))
    clear_containers(document.getElementsByTagName("table"))
  }
}

var run_test = function(test_id) {
  var GRID_SIDE = document.getElementById("grid_side").value
  var TIMEOUT_MS = document.getElementById("timeout").value

  var test = document.getElementById(test_id)

  if (test === null) {
    return;
  }

  // Clear the table
  clear_containers([test])

  // Compute word list
  var word_list = document.getElementById("wordlist").value.toUpperCase().split("\n")

  // Start timer
  var start = new Date().getTime()

  // Create the test object and "run" it
  var Test = TESTS[test_id][0]
  var result = new Test(GRID_SIDE, word_list, TIMEOUT_MS).run()

  // Stop timer
  var stop = new Date().getTime()

  // Show the table
  for (var row in result.grid) {
    var tr = document.createElement("tr")
    for (var col in result.grid[row]) {
      var td = document.createElement("td")
      td.innerHTML = result.grid[row][col];
      tr.appendChild(td);
    }
    test.appendChild(tr)
  }

  // Show the time
  var new_time = document.createElement("li")
  new_time.innerHTML = result.total + "/" + word_list.length + " parole inserite in " + (stop - start) + " ms"
  if (result.runs !== undefined) {
    new_time.innerHTML += " (usando " + result.runs + " ripetizioni)"
  }
  var times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)
}

var run_entire_list = function(test_id, start_at) {
  var GRID_SIDE = document.getElementById("grid_side").value
  var TIMEOUT_MS = document.getElementById("timeout").value

  var test = document.getElementById(test_id)

  if (test === null) {
    return;
  }

  // Compute word list
  var word_list = document.getElementById("wordlist").value.toUpperCase().split("\n")
  if (start_at < word_list.length) {
    word_list.splice(0, start_at)
  } else {
    // All words inserted
    return
  }

  // Clear the table
  clear_containers([test])

  // Clear the time (if it's the first series)
  if (start_at === 0) {
    clear_containers([document.getElementById(test_id + "-times")])
  }

  // Start timer
  var start = new Date().getTime()

  // Create the test object and "run" it
  var Test = TESTS[test_id][0]
  var result = new Test(GRID_SIDE, word_list, TIMEOUT_MS).run()

  // Stop timer
  var stop = new Date().getTime()

  // Show the table
  for (var row in result.grid) {
    var tr = document.createElement("tr")
    for (var col in result.grid[row]) {
      var td = document.createElement("td")
      td.innerHTML = result.grid[row][col];
      tr.appendChild(td);
    }
    test.appendChild(tr)
  }

  // Show the time
  var new_time = document.createElement("li")
  new_time.innerHTML = ((start_at ? start_at : 0) + result.total) + "/" + (start_at + word_list.length) + " parole inserite in " + (stop - start) + " ms"
  if (result.runs !== undefined) {
    new_time.innerHTML += " (usando " + result.runs + " ripetizioni)"
  }
  var times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)

  if (result.total == 0) {
    alert("Imprevisto: non si riesce a inserire una parola...")
  } else {
    // Call recursively (but wait, so the browser can redraw everything)
    setTimeout(function() {
      run_entire_list(test_id, start_at + result.total)
    }, 100)
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

window.onload = function() {
  var show = getQueryVariable("show")
  if (show) {
    // only one test is requested, devare the others
    for (var t in TESTS) {
      if (t !== show) {
        devare(TESTS[t])
      } else {
        TESTS[t][1] = '<a style="float:right" href="?">(show all tests)</a><br>' + TESTS[t][1]
      }
    }
  } else {
    // all tests are requested, create links to show single tests
    for (var t in TESTS) {
      TESTS[t][1] = '<a style="float:right" href="?show=' + t + '">(show only this test)</a><br>' + TESTS[t][1]
    }
  }

  var width = 0

  for (var t in TESTS) {
    var test = document.createElement("div")
    var test_wrapper = document.createElement("div")
    var table = document.createElement("table")
    var button = document.createElement("button")
    var button2 = document.createElement("button")
    var description = document.createElement("div")
    var times = document.createElement("ol")

    table.id = t
    times.id = t + "-times"
    button.id = t + "-button"
    button2.id = t + "-button2"

    times.reversed = true

    /*button.onclick = function(x) {
      return function() { run_test(x) }
    }(t);*/

    button2.onclick = function(x) {
      return function() { run_entire_list(x, 0) }
    }(t);

    /*document.getElementById('startGrid').onclick = function() {
      button2.click();
    }*/
    //console.log(t);

    button.classList.add("test")
    button.innerHTML = "<i class='fa fa-play'></i> " + t

    button2.classList.add("insert-all")
    button2.classList.add("test")
    button2.innerHTML = "<i class='fa fa-forward'></i> (insert entire list)"

    description.classList.add("description")
    description.innerHTML = TESTS[t][1]

    test.appendChild(description)
    test.appendChild(button)
    test.appendChild(button2)
    test.appendChild(table)
    test.appendChild(times)

    test_wrapper.appendChild(test)
    test_wrapper.classList.add("test")
    document.getElementById("test-container").appendChild(test_wrapper)

    width += test.offsetWidth
  }

  document.body.style.width = width + "px"
}
