'use strict'

function LookbackCreatorJS(grid_side, word_list, timeout_ms) {
  var word_list = word_list
  var grid_side = grid_side

  var result = []
  var inserted = []
  var usati = new Set()
  var candidate = null
  var usati_candidate = null
  var positions = []
  var positions_candidate = []


  this.run = function() {
    var conta = 0
    var insert = false

    //create the raw output
    for (var i = 0; i < grid_side ; i++) {
      var row = []
      for (var i = 0; i < grid_side ; i++) {
        row.push("-")
      }
      result.push(row)
    }

    while (conta < word_list.length) {
      if (insertWord(word_list[conta])) {
        conta += 1
      } else {
        break
      }
    }

    return {
      "grid": result,
      "total": conta,
    }
  }

  function clone(existingArray) {
     var newObj = (existingArray instanceof Array) ? [] : {};
     for (var i in existingArray) {
        if (i == 'clone') continue;
        if (existingArray[i] && typeof existingArray[i] == "object") {
           newObj[i] = clone(existingArray[i]);
        } else {
           newObj[i] = existingArray[i]
        }
     }
     return newObj;
  }

  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  // warning: the result is reversed
  function get_prefix(w, k) {
    var res = ""
    for (var i=0; i<k; i++) {
      res += w[k - i - 1]
    }
    return res
  }

  function get_suffix(w, k) {
    var res = ""
    for (var i=k; i<w.length; i++) {
      res += w[i]
    }
    return res
  }

  function get_sovrap(w) {
    var result = []

    for (var ii in inserted) {
      var p = word_list[ii]
      // find all common substrings of word "w" and word "p"
      for (var i=0; i<p.length; i++) {
        for (var j=0; j<w.length; j++) {
          for (var k=0; i+k<p.length && j+k<w.length; k++) {
            if (w[j + k] === p[i + k]) {
              var set = new Set()
              for (var kk=0; kk<=k; kk++) {
                set.add(inserted[ii][i + kk])
              }
              var pos = []
              for (var kk=0; kk<=k; kk++) {
                pos.push(inserted[ii][i + kk])
              }

              // new candidate
              result.push({
                start: inserted[ii][i],
                start_s: get_prefix(w, j + 1),
                end: inserted[ii][i + k],
                end_s: get_suffix(w, j + k),
                len: k + 1,
                usati: set,
                positions: pos
              })
            } else {
              break
            }
          }
        }
      }
    }

    // sort by length
    result.sort(function(a, b) {
      return b.len - a.len
    })

    return result
  }

  var insertWord = function(word) {
    var sovrap = get_sovrap(word)
    for (var i in sovrap) {
      var s = sovrap[i]
      var positions = []

      usati = new Set(s.usati)
      candidate = null
      // insert first part
      insertvarter(Math.floor(s.start / grid_side), s.start % grid_side, 0, s.start_s)
      if (candidate !== null) {
        result = clone(candidate)
        usati = new Set(usati_candidate)
        positions_candidate.reverse()
        positions_candidate.pop()
        positions = positions.concat(positions_candidate)

        candidate = null
        // insert second part
        insertvarter(Math.floor(s.end / grid_side), s.end % grid_side, 0, s.end_s)
        if (candidate !== null) {
          result = clone(candidate)

          positions = positions.concat(s.positions)
          positions_candidate.shift()
          positions = positions.concat(positions_candidate)

          inserted.push(clone(positions))
          return true
        }
      }
    }

    // le sovrapposizioni non hanno aiutato, quindi provo nel modo classico
    // e se non basta nemmeno quello ritorno false

    var pos = []
    for (var i=0; i<grid_side; i++) {
      console.log(result[i]);
      for (var j=0; j<grid_side; j++) {
        if (result[i][j] === "-") {
          pos.push({"i": i, "j": j})
        }
      }
    }

    shuffle(pos)

    candidate = null
    for (var k in pos) {
      var i = pos[k].i
      var j = pos[k].j
      insertvarter(i, j, 0, word)
      if (candidate !== null) {
        result = clone(candidate)
        inserted.push(clone(positions_candidate))
        return true
      }
    }
    return false
  }

  var insertvarter = function(x, y, count, word) {
    var old = result[x][y]
    result[x][y] = word[count]
    usati.add(x * grid_side + y)
    positions.push(x * grid_side + y)

    if (count === word.length - 1) {
      // a candidate was found, var's clone it
      candidate = clone(result)
      usati_candidate = new Set(usati)
      positions_candidate = clone(positions)
    } else {
      // list all the positions ("promising" ones first)
      var good_ones = []
      var bad_ones = []
      for (var i=-1; i<=1; i++) {
        for (var j=-1; j<=1; j++) {
          if (x+i>=0 && y+j>=0 && x+i<grid_side && y+j<grid_side) {
            var ci = x+i
            var cj = y+j
            if (result[ci][cj] === word[count + 1] && !usati.has(ci * grid_side + cj)) {
              good_ones.push({"i": ci, "j": cj})
            } else if (result[ci][cj] === "-") {
              bad_ones.push({"i": ci, "j": cj})
            }
          }
        }
      }

      shuffle(good_ones)
      shuffle(bad_ones)
      var pos = good_ones.concat(bad_ones)

      // try the positions
      for (var k in pos) {
        var i = pos[k].i
        var j = pos[k].j
        insertvarter(i, j, count + 1, word)
        if (candidate !== null) {
          break
        }
      }
    }

    result[x][y] = old
    usati.devare(x * grid_side + y)
    positions.pop()
  }
}
