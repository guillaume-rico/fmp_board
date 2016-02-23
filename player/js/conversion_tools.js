

// Convert XY position to cell index
function svgXYtoHexIndex (radius,x,y) {
    icomputed = Math.ceil((x - (radius * 1.5) / 2) / (radius * 1.5));
    if (icomputed >= MapColumns) {
        icomputed = MapColumns - 1;
    }
    if (icomputed < 0) {
        icomputed = 0;
    }
    jcomputed = Math.ceil((y - (radius * 1.75) / 2 - icomputed % 2 * radius) / (radius * 1.75));
    if (jcomputed >= MapRows) {
        jcomputed = MapRows - 1;
    }
    if (jcomputed < 0) {
        jcomputed = 0;
    }
    return {
        i: icomputed,
        j: jcomputed
    };
}

function svgXYtoHexIndeximage (radius,pion,x,y) {
    newposition = svgXYtoHexIndex (radius,x + pion.xoffset,y + pion.yoffset);
    return newposition;
}

// Convert IJ position to XY
function svgIJtoXY (hexRadius,position) {
    return {
        x: hexRadius * position.i * 1.5,
        y: hexRadius * position.j * 1.75 + position.i % 2 * hexRadius
    };
}

// Convert IJ to XY for image 
function svgIJtoXYimage (hexRadius,pion,position) {
    newPosition = svgIJtoXY(hexRadius,position)
    return {
        x: newPosition.x - pion.xoffset,
        y: newPosition.y - pion.yoffset
    };
}

// Compute angular position 
function angularIJ (position1,position2) {
    var returnval = 0;
    console.log("position1:" + position1.i + "-" + position1.j);
    console.log("position2:" + position2.i + "-" + position2.j);
    //console.log("position2:" + position2.i + "-" + position2.j);
    if (position1.i == position2.i) {
        if (position1.j > position2.j) {
            returnval =  180;
        }
        if (position1.j < position2.j) {
            returnval =  0;
        }
    } else if (position1.i < position2.i) {
        if (position2.i % 2 == 0) {
            if (position1.j == position2.j) {
                returnval =  240;
            }
            if (position1.j < position2.j) {
                returnval =  300;
            }
        } else {
            if (position1.j == position2.j) {
                returnval =  300;
            }
            if (position1.j > position2.j) {
                returnval =  240;
            }
        }
    } else {
        if (position2.i % 2 == 0) {
            if (position1.j == position2.j) {
                returnval =  120;
            }
            if (position1.j < position2.j) {
                returnval =  60;
            }
        } else {
            if (position1.j == position2.j) {
                returnval =  60;
            }
            if (position1.j > position2.j) {
                returnval =  120;
            }
        }
    }
    return returnval;
}

function hex_neighbor(hex) {
    var neighbor = [];
    // La cellule du dessus
    if (hex.j - 1 >= 0) {
        neighbor.push({i:hex.i, j:hex.j - 1})
    }
    // La cellule du dessous
    if (hex.j + 1 < MapRows) {
        neighbor.push({i:hex.i, j:hex.j + 1})
    }
    
    // La cellule à gauche en haut
    if (hex.i - 1 >= 0) {
        neighbor.push({i:(hex.i - 1), j:hex.j});
    }
    // La cellule à droite en haut
    if (hex.i + 1 < MapColumns) {
        neighbor.push({i:(hex.i + 1), j:hex.j});
    }
    // Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
    if ((hex.i % 2) == 1) {
        // La cellule à gauche en bas
        if (hex.i - 1 >= 0 && hex.j + 1 < MapRows) {
            neighbor.push({i:(hex.i - 1), j:(hex.j + 1)});
        }
        // La cellule à droite en bas
        if (hex.i - 1 < MapColumns && hex.j + 1 < MapRows) {
            neighbor.push({i:(hex.i + 1), j:(hex.j + 1)});
        }
    } else {
        // La cellule à gauche en haut
        if (hex.i - 1 >= 0 && hex.j - 1 >= 0) {
            neighbor.push({i:(hex.i - 1), j:(hex.j - 1)});
        }
        // La cellule à droite en haut
        if (hex.i + 1 < MapColumns && hex.j - 1 >= 0) {
            neighbor.push({i:(hex.i + 1), j:(hex.j - 1)});
        }
    }

    return neighbor;
}


// L'échelle :
// 0 : Non attribué
// 1 : Eau
// 2 : Recif
// 3 : Marecage
// 4 : Sol
// 5 : Montagne

// Based on the works of http://www.playfuljs.com/realistic-terrain-in-130-lines/

function intoval(intval) {
  if (intval == 0) {
    return "u";
  } else if (intval <= 27) {
    // Eau
    return "e";
  } else if (intval <= 32) {
    return "i";
  } else if (intval <= 44) {
    return "a";
  } else if (intval <= 91) {
    return "s";
  } else {
    return "m";
  }
}
function intoshortint(intval) {
  if (intval == 0) {
    return 0;
  } else if (intval <= 27) {
    // Eau
    return 1;
  } else if (intval <= 32) {
    return 2;
  } else if (intval <= 44) {
    return 3;
  } else if (intval <= 91) {
    return 4;
  } else {
    return 5;
  }
}
function shortintoval(intval) {
  if (intval == 0) {
    return "u";
  } else if (intval <= 1) {
    // Eau
    return "e";
  } else if (intval <= 2) {
    return "i";
  } else if (intval <= 3) {
    return "a";
  } else if (intval <= 4) {
    return "s";
  } else {
    return "m";
  }
}
function valtoshortint(intval) {
  if (intval == "u") {
    return 0;
  } else if (intval == "e") {
    return 1;
  } else if (intval == "i") {
    return 2;
  } else if (intval == "a") {
    return 3;
  } else if (intval == "s") {
    return 4;
  } else {
    return 5;
  }
}
// Conversion float--> couleur
function definecolor(slope) {

  // Les states générales :
  // Eau 27 %
  // Ilot 5% --> 32%
  // Marecage 12 --> 44
  // Sol 47 --> 91
  if (slope == "u") {
    return "rgba(255,255,255,1)";
  } else if (slope == "e") {
    // Eau : 5f788c
    return "rgba(80,130,156,1)";
  } else if (slope == "i") {
      return "url(#ilot)";
    return "rgba(60,176,109,1)";
  } else if (slope == "a") {
      return "url(#marecage)";
    return "rgba(149,169,67,1)";
  } else if (slope == "s") {
    return "rgba(201,145,83,1)";
  } else {
    return "rgba(80,80,80,1)";
  }
}

//“odd-q” vertical layout
function offsetToCube (col, row) {
// convert odd-q offset to cube
return {
    x: col,
    z: row - (col - (col&1)) / 2,
    y: -col - row + (col - (col&1)) / 2,
};
}
function cubeToOffset (x, y) {
// convert cube to odd-q offset
return {
    col : x,
    row : z + (x - (x&1)) / 2
};
}    
function cube_distance(a, b) {
return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}