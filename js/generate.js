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
      
      
      
      function Terrain(nbCol,nbRow,hexagone) {

        var sizetemp = 0;
        if (nbRow > nbCol) {
            for (var i = 1; sizetemp < nbRow; i++ ) {
                sizetemp = Math.pow(2, i) + 1;
            }
        } else {
            for (var i = 1; sizetemp < nbCol; i++ ) {
                sizetemp = Math.pow(2, i) + 1;
            }
        }
          
        this.size = Math.pow(2, i - 1) + 1;
        this.max = this.size - 1;
        this.nbCol = nbCol;
        this.nbRow = nbRow;
        this.hexagone = hexagone;
        //this.map = new Float32Array(this.size * this.size);
        
        this.map = new Array(this.size * this.size);
        for (var i = 0; i < this.size * this.size; i++) {
          this.map[i] = 0;
        }
        
      }
      
      Terrain.prototype.get = function(x, y) {
        if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
        return this.map[y + this.size * x];
      };
      
      Terrain.prototype.set = function(x, y, val) {
        this.map[y + this.size * x] = val;
      };
      
      function hexLimits(hexagone,nbCol,row) {
        if (hexagone) {
            // 3 Cas : debut milieu et fin 
            if (row < (1 + (nbCol - 5 ) / 4)) {
                var startX = Math.ceil(nbCol / 2) - 2 - 2 * row;
                if (startX < 0) startX = 0;
                var endX = Math.ceil(nbCol / 2) + 1 + 2 * row;
                if (endX > nbCol) endX =nbCol;
            } else if (row < nbCol - (1 + (nbCol - 5 ) / 4)) {
                var startX = 0;
                var endX = nbCol;
            } else {
                var startX = Math.ceil(nbCol / 2) - 1 - 2 * (nbCol - 1 - row);
                if (startX < 0) startX = 0;
                var endX = Math.ceil(nbCol / 2) + 2 * (nbCol - 1 - row);
                if (endX > nbCol) endX =nbCol;
            }
        } else {
            var startX = 0;
            var endX = nbCol;
        }
        return [startX, endX];
      };
      
    Terrain.prototype.hexagoneLimits = function(row) {
        
        limits = hexLimits(this.hexagone,this.nbCol,row);
        var startX = limits[0];
        var endX = limits[1];

        return [startX, endX];
    };
      
    // On renvoie un entier aléatoire entre une valeur min (incluse)
    // et une valeur max (exclue).
    // Attention : si on utilisait Math.round(), on aurait une distribution
    // non uniforme !
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
      
    // On renvoie un entier aléatoire entre une valeur min (incluse)
    // et une valeur max (incluse).
    // Attention : si on utilisait Math.round(), on aurait une distribution
    // non uniforme !
    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
      
    // Génère des montagnes sur la carte
    Terrain.prototype.mountain = function(nbMountain) {
        
        for (var i = 0 ; i < (nbMountain * this.nbCol * this.nbRow) ; i++) {

            y = getRandomInt(0, this.nbRow);
            
            limits = this.hexagoneLimits(y);
            var startX = limits[0];
            var endX = limits[1];

            x = getRandomInt(startX + 1, endX - 1);
        
            this.set(x , y , 100);
            
            // On agrandi la motagne de 0 à 6 pixels
            // La taille d'expansion doit être entre 0 et 5 hexagones supplémentaires (Taille totale : 1 --> 6)
            var aleaExt = Math.round(Math.random() * 10000)/100.0;
            if (aleaExt <= 36.0) {
                extansion = 0;
            } else if (aleaExt <= 42.0) {
                extansion = 1;
            } else if (aleaExt <= 62.0) {
                extansion = 2;
            } else if (aleaExt <= 72.0) {
                extansion = 3;
            } else if (aleaExt <= 82.0) {
                extansion = 4;
            } else if (aleaExt <= 88.0) {
                extansion = 5;
            } else if (aleaExt <= 94.0) {
                extansion = 6;
            } else {
                extansion = 7;
            }
            
            
            actualX = x;
            actualY = y;
            var nbSearch = 0;
            var listOfEmplacement = [];
            for (var ext = 0 ; ext < extansion ; ext++) {
            
                // On se déplace a partir de l'emplacement actuel
                Xoffset = getRandomIntInclusive(-1,1);
                Yoffset = getRandomIntInclusive(-1,1);
                
                // On vérifie qu'une donnée peut être présente à cette endroit
                if (this.get((actualX + Xoffset), (actualY + Yoffset)) == 0) {
                    Yoffset = 0;
                    Xoffset = 0;
                }

                actualX = (actualX + Xoffset);
                actualY = (actualY + Yoffset);
                
                var finded =  listOfEmplacement.indexOf(actualX + "-" + actualY);
                
                if (finded == -1) {
                    
                    listOfEmplacement.push(actualX + "-" + actualY);
                    
                    this.set(actualX , actualY , 100);
                    nbSearch = 0;
                } else {
                    ext--;
                    
                    // On limite le nombre de recherche à 5
                    nbSearch++;
                    if (nbSearch > 5) {
                        ext = extansion;
                        
                    }
                }

            }
            
        }
        
      };
      
    // Génération du tour de carte 
    Terrain.prototype.tourdecarte = function() {
        
        
        for (var y = 0 ; y < (this.nbRow); y++) {
            
            limits = this.hexagoneLimits(y);
            var startX = limits[0];
            var endX = limits[1];

            for (var x = startX ; x < endX; x++) {
                if (x == startX || y == 0 || x == (endX - 1) || y == (this.nbRow - 1)) {
                    
                    var aleaExt = Math.round(Math.random() * 10000)/100.0;
                    var newValue = 1;
                    if (aleaExt < 82.0) {
                        // Sol
                        newValue = 80;
                    } else if (aleaExt < 95.0) {
                        // Marécage
                        newValue = 38;
                    } else {
                        // Eau
                        newValue = 20;
                    }
                    
                    this.set(x, y, newValue);
                }
            }
        }
    };

    
    // Génération avec 
    Terrain.prototype.stat = function(nbMountain) {
        
        var stat = []
        //stat["s"] = [73.59,0,2.86,10.74,12.8];
        stat["s"] = [100,0,0,0,0];
        stat["m"] = [31.32,27.59,3.74,15.8,21.55];
       // stat["i"] = [24.81,0,31.85,4.07,39.26];
        stat["i"] = [0,0,100,0,0];
        //stat["a"] = [49.44,0,2.04,36.67,11.85];
        stat["a"] = [0,0,0,100,0];
        //stat["e"] = [17.55,0,7.78,4.63,70.05];
        stat["e"] = [0,0,0,0,100];
        
        // Terre
        nbZone = 0;
        var statAll = []
        statAll[nbZone++] = [80,0,0,15,5];
        statAll[nbZone++] = [80,0,0,15,5];
        statAll[nbZone++] = [80,0,0,15,5];
        // Intermediare
        statAll[nbZone++] = [45,0,10,10,45];
        // eau
        statAll[nbZone++] = [0,0,5,5,90];
        statAll[nbZone++] = [0,0,5,5,90];
        // Intermediare
        statAll[nbZone++] = [45,0,10,10,45];
        // Ile
        statAll[nbZone++] = [75,0,10,15,5];
        statAll[nbZone++] = [75,0,10,15,5];
        // Eau
        statAll[nbZone++] = [0,0,0,5,95];
        nbZone = nbZone - 1;
        
        if (this.nbCol < this.nbRow) {
            dimensionMin = this.nbCol / 2;
        } else {
            dimensionMin = this.nbRow / 2;
        }
        
        // Position cubique du centre
        centertCube  = offsetToCube(Math.floor(this.nbCol / 2) , Math.floor(this.nbRow / 2));
        dimensionMax = cube_distance(centertCube, offsetToCube(Math.floor(this.nbCol / 2) , 0));
        

        for (var j = 0;j < this.nbRow; j++) {
            
            limits = this.hexagoneLimits(j);
            var startX = limits[0];
            var endX = limits[1];
            
            for (var i = startX;i < endX; i++) {
                
                    rand = (Math.round(Math.random() * 10000)/100.0);
                
                    // Si c'est le tour de la carte, on ne fait rien
                    if (i == startX || j == 0 || i == (endX - 1) || j == (this.nbRow - 1)) {

                    } else {
                        // On recherche les cellules autour
                        var listCells = [];
                        
                        // La cellule du dessus
                        listCells.push(this.get(i, j - 1));
                        
                        // La cellule du dessous
                        listCells.push(this.get(i, j + 1));
                        
                        // Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
                        if ((i % 2) == 1) {
                            // La cellule à gauche en haut
                            listCells.push(this.get((i - 1),j));
                            // La cellule à gauche en bas
                            listCells.push(this.get((i - 1),(j + 1)));
                            // La cellule à droite en haut
                            listCells.push(this.get((i + 1),j));
                            // La cellule à droite en bas
                            listCells.push(this.get((i + 1),(j + 1)));
                        } else {
                            // La cellule à gauche en bas
                            listCells.push(this.get((i - 1),j));
                            // La cellule à gauche en haut
                            listCells.push(this.get((i - 1),(j - 1)));
                            // La cellule à droite en bas
                            listCells.push(this.get((i + 1),j));
                            // La cellule à droite en haut
                            listCells.push(this.get((i + 1),(j - 1)));
                        }
                        
                        // On compte et on applique les stats associés
                        var proba = [];
                        proba["s"] = 0;
                        proba["m"] = 0;
                        proba["i"] = 0;
                        proba["a"] = 0;
                        proba["e"] = 0;
                        nbHex = 0;

                        $.each( listCells, function( key, hex ) {
                            hex = intoval(hex);
                            if (hex != "u") {
                                proba["s"] = (proba["s"] + stat[hex][0]);
                                proba["m"] = (proba["m"] + stat[hex][1]);
                                proba["i"] = (proba["i"] + stat[hex][2]);
                                proba["a"] = (proba["a"] + stat[hex][3]);
                                proba["e"] = (proba["e"] + stat[hex][4]);
                                nbHex++;
                            }
                        });
                        
                        // On divise les probabilité par le nombre d'hexagone
                        proba["s"] = (proba["s"] / nbHex);
                        proba["m"] = (proba["m"] / nbHex);
                        proba["i"] = (proba["i"] / nbHex);
                        proba["a"] = (proba["a"] / nbHex);
                        proba["e"] = (proba["e"] / nbHex);
                        
                        // On ajout le coeficient pondérateur pour la répartition spaciale
                        distanceHaut    = j;
                        distanceGauche  = i;
                        distanceBas  = (this.nbRow - 1 - j);
                        distanceDroite = (this.nbCol - 1 - i);
                        distance        = Math.min(distanceHaut,distanceGauche,distanceDroite,distanceBas);
                        
                        // Si c'est un hexagone ou un octogone
                        if (this.hexagone) {
                            // Position cubique du centre :
                            pointCube    = offsetToCube(i , j);
                            distanceCube = cube_distance(centertCube, pointCube);
                            distanceCubeNormalisee = Math.round(nbZone * distanceCube / dimensionMax);
                            distanceAll = nbZone - distanceCubeNormalisee;
                        } else {
                        // La distance pour les stat de all doit être entre 0 et 4
                            distanceAll     = Math.round(nbZone * 1.0 * distance / dimensionMin);
                            if (distanceAll > nbZone ) {
                                distanceAll = nbZone;
                            }  
                        }


                        coef = 1.0;
         
                        proba["s"] = ((proba["s"] + coef *  statAll[distanceAll][0]) / (coef + 1));
                        proba["m"] = ((proba["m"] + coef *  statAll[distanceAll][1]) / (coef + 1));
                        proba["i"] = ((proba["i"] + coef *  statAll[distanceAll][2]) / (coef + 1));
                        proba["a"] = ((proba["a"] + coef *  statAll[distanceAll][3]) / (coef + 1));
                        proba["e"] = ((proba["e"] + coef *  statAll[distanceAll][4]) / (coef + 1));
                        
                        
                        if (rand < proba["s"]) {
                            type = "s";
                            type = 60;
                        } else if (rand < (proba["s"] + proba["m"])) {
                            type = "m";
                            type = 91;
                        } else if (rand < (proba["s"] + proba["m"] + proba["i"])) {
                            type = "i" ;
                            type = 30;
                        } else if (rand < (proba["s"] + proba["m"] + proba["i"] + proba["a"])) {
                            type = "a";
                            type = 38;
                        } else {
                            type = "e";
                            type = 20;
                        }
                        
                        this.set(i, j, type);
                    }
                    
                }
            }
        
      };
      
      Terrain.prototype.generate = function() {
        var self = this;

        this.set(0, 0, 50);
        this.set(this.max, 0, 50);
        this.set(this.max, this.max, 50);
        this.set(0, this.max, 50);
        divide(this.max , 2);
        
        function divide(size, divider) {
          var x, y, half = size / 2;

          if (half < 1) return;
          for (y = half; y < self.max; y += size) {
            for (x = half; x < self.max; x += size) {
                // (Math.random() * 2 - 1)  : -1 --> 1
                randomVal = (Math.random() * 100 - 50) / divider;
              square(x, y, half, randomVal );
            }
          }
          for (y = 0; y <= self.max; y += half) {
            for (x = (y + half) % size; x <= self.max; x += size) {
              diamond(x, y, half, (Math.random() * 100 - 50) / divider );
            }
          }
          divide(size / 2 , divider + 1);
        }
        
        function average(values) {
          var valid = values.filter(function(val) { return val !== -1; });
          var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
          return total / valid.length;
        }
        
        function square(x, y, size, offset) {
          var ave = average([
            self.get(x - size, y - size),   // upper left
            self.get(x + size, y - size),   // upper right
            self.get(x + size, y + size),   // lower right
            self.get(x - size, y + size)    // lower left
          ]);
          if (self.get(x, y) == 0) {
              newValue = ave + offset;
              if (newValue > 90) {
                  newValue = 91;
              }
              if (newValue < 1) {
                  newValue = 1;
              }
              
              self.set(x, y, ave + offset);
          }
        }
        
        function diamond(x, y, size, offset) {
          var ave = average([
            self.get(x, y - size),      // top
            self.get(x + size, y),      // right
            self.get(x, y + size),      // bottom
            self.get(x - size, y)       // left
          ]);
          if (self.get(x, y) == 0) {
              newValue = ave + offset;
              if (newValue > 90) {
                  newValue = 91;
              }
              if (newValue < 1) {
                  newValue = 1;
              }
                  
            self.set(x, y, ave + offset);
          }
        }
      };
      
      var color = [];
      var groundstyle = [];
      var positionXY = [];
      
      Terrain.prototype.draw = function() {

        var self = this;
        var waterVal = this.size * 0.3;
        var count = 0


        for (var y = 0; y < this.nbRow; y++) {
            for (var x = 0; x < this.nbCol; x++) {
                var val = this.get(x, y);
                var top = flatproject(x, y);
                var bottom = flatproject(x + 1, y + 1);
                var style = definecolor(intoval(val));
                groundstyle[count] = intoshortint(val);
                positionXY[count] = x + "-" + y + "-" + count;
                count = count + 1;
            }
        }



        function flatproject(flatX, flatY) {
          return {
            x: flatX ,
            y: flatY
          };
        }
        
        return groundstyle;
      };