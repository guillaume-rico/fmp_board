
// Calcul la distance entre deux positions
// unit doit contenir type
function astar (start,goal,unit) {
    
    var frontier = [];
    frontier.push(start);
    
    var visited = [];
    visited.push(start.i + "-" + start.j);
    
    var came_from = [];
    came_from[start.i + "-" + start.j] = "none";
    came_from[goal.i + "-" + goal.j] = "none";

    while( frontier.length != 0) {
       current = frontier[0];
       frontier.splice(0, 1);
       
       if (current.i == goal.i && current.j == goal.j ) {
          break;
       }
       
       var neig = hex_neighbor(current);
       for (var index = 0; index < neig.length; ++index) {
            // S'il n'a pas été déjà visité et que le terrain est valide
            neig[index].type = unit.type;
           if (visited.indexOf(neig[index].i + "-" + neig[index].j) == -1
                && rules_check_position(neig[index]) == "valid") {
             frontier.push(neig[index]);
             visited.push(neig[index].i + "-" + neig[index].j);
             came_from[neig[index].i + "-" + neig[index].j] = current;
          }
       }
    } 
    
    current = goal;
    var path = [current];
    //path.push(current);

    // S'il n'y a pas de sortie
    if (came_from[goal.i + "-" + goal.j] == "none") {
        return path.reverse(); 
    }

    while (current.i != start.i || current.j != start.j) {
       current = came_from[current.i + "-" + current.j];
       path.push(current);
    }
    
    // Si ça fait trop de mouvement
    if (getNbPoint(game.tour) != 0 && (getNbPoint(game.tour) - players[game.player].points - path.length + 1 < 0)) {
        path = [];
    }
    
    return path.reverse(); 
}

// Position doit contenir :
// - i j et type
// - Si type est astronef, elle doit aussi contenir orientation
function rules_check_position(position) {
    // 3 Marécage - 4 sol - 5 montagne

    // On vérifie que les 4 cases sont OK
    hex = getHexOfFigurine(position);
    returnval = "valid";
    for (index = 0; index < hex.length; ++index) {
        naturesol = intoshortint(terrain.get(hex[index].i, hex[index].j));
        unitinside = d3.selectAll("image[i='" + hex[index].i + "']").filter("image[j='" + hex[index].j + "']");
        switch (position.type) {
            case "pondeuse" :
            case "crabe" :
            case "minerai" :
            case "char":
                // Si c'est supérieur à 3 c'est que c'est praticable
                if (naturesol + game.marree < 3 || terrain.minerai[position.i][position.j] == 1 || unitinside != "") {
                    returnval = "invalid";
                }
                break;
            case "astronef" :
                // Si c'est supérieur à 3 mais pas une montagne
                if ((naturesol + game.marree) < 3 || naturesol == 5 || unitinside != "") {
                    returnval = "invalid";
                }
                break;
            case "gros_tas":
                // Si c'est supérieur à 3 mais pas une montagne
                if (naturesol + game.marree < 3 || naturesol == 5 || terrain.minerai[position.i][position.j] == 1 || unitinside != "") {
                    returnval = "invalid";
                }
                break;
            case "barge":
            case "vedette":
            case "ponton":
                // Si c'est inférieur à 3 c'est que c'est que c'est de l'eau
                if (naturesol + game.marree >= 3 || terrain.minerai[position.i][position.j] == 1 || unitinside != "") {
                    returnval = "invalid";
                }
                break;            
        }
    }

    return returnval;
}

// On retourne la liste des hexagones occupés par une figurine
function getHexOfFigurine(position) {
    var hex = [];
    hex.push({"i": position.i,"j": position.j});
    switch (position.type) {
        case "pondeuse" :
        case "crabe" :
        case "minerai" :
        case "char":
        case "gros_tas":
        case "vedette":
        case "ponton":
            break;
        case "astronef" :
            if (position.orientation == 0) {
                hex.push({"i": position.i,"j":  position.j + 1});
                hex.push({"i": position.i - 1,"j":  position.j - 1 + position.i % 2});
                hex.push({"i": position.i + 1,"j":  position.j - 1 + position.i % 2});
            } else {
                hex.push({"i": position.i,"j":  position.j - 1});
                hex.push({"i": position.i - 1,"j":  position.j + position.i % 2});
                hex.push({"i": position.i + 1,"j":  position.j + position.i % 2});
            }
            break;
        case "barge":
            switch (position.orientation) {
                case 0 :
                    hex.push({"i": position.i,"j":  position.j - 1});
                    break;
                case 60 :
                    hex.push({"i": position.i - 1,"j":  position.j + position.i % 2});
                    break;
                case 120 :
                    hex.push({"i": position.i - 1,"j":  position.j - 1 + position.i % 2});
                    break;
                case 180 :
                    hex.push({"i": position.i,"j":  position.j + 1});
                    break;
                case 240 :
                    hex.push({"i": position.i + 1,"j":  position.j - 1 + position.i % 2});
                    break;
                case 300 :
                    hex.push({"i": position.i + 1,"j":  position.j + position.i % 2});
                    break;
            }
            break;            
    }

    return hex;
}

function Marre() {
    this.marrelist  = [];
    this.marrelist  = [0,0]
    this.marrelist  = this.marrelist.concat(this.compute("none"));
    this.marrelist  = this.marrelist.concat(this.compute(this.marrelist [10]));
    this.marrelist  = this.marrelist.concat(this.compute(this.marrelist [18]));
}
Marre.prototype.compute = function(marreeactuelle) {
    var tempmarrelist = [];
    // Il y a 5 cartes de chaque types (sauf si on définit une carte comme étant sur le plateau)
    var marretype = [-1, 0, 1];
    var availablemarre = [];
    for (var marretype = -1; marretype < 2; marretype++) {
        if (marreeactuelle == marretype) {
            nbcarte = 4;
        } else {
            nbcarte = 5;
        }
        for (var index = 0; index < nbcarte; index++) { 
            availablemarre.push(marretype);
        }
    }

    var selected = [];
    // On en prend 9 
    var a;
    for (var index = 0; index < 9; a++) {
        marrIndex = getRandomInt(0, availablemarre.length);
        if (selected.indexOf(marrIndex) == -1) {
            selected.push(marrIndex);
            tempmarrelist.push(availablemarre[marrIndex]);
            index++;
        }
    }
    
    return tempmarrelist;
}
Marre.prototype.get = function(numTour) {
    return this.marrelist[numTour];
}
Marre.prototype.getName = function(numTour) {
    var text = "";
    switch (this.marrelist[numTour]) {
        case -1 :
            text = "basse";
            break;
        case 0 :
            text = "normale";
            break;
        case 1 :
            text = "haute";
            break;
    }
    return text;
}

function getNbPoint (numtour) {
    var nbpoints = 15;
    
    switch (numtour) {
        case 1 :
            nbpoints = 0;
            break;
        case 2 :
            nbpoints = 0;
            break;
        case 3 :
            nbpoints = 5;
            break;
        case 4 :
            nbpoints = 10;
            break;
    }
    return nbpoints;
}

function initourPlayer  (numtour,startOrEnd) {
    switch (numtour) {
        case 1 :
            // Placement des astronefs
            if (startOrEnd == "start") {
                if (players[game.player].type == "player") {
                    var astrone = [{
                            i: 0,
                            j: 0,
                            x: (MapColumns + 1) * hexRadius * 1.5,
                            y: 1 * hexRadius * 1.75,
                            type: "astronef",
                            orientation:180
                        }];
                    units.push(astrone[0]);

                    var rectangle = container.append("g")
                            .attr("class", "unit")
                                .selectAll("circle")
                                .data(astrone).enter().append("svg:image")
                                    .attr("class", "unit astronef player" + game.player)
                                    .attr("x", function (d) { return d.x ; })
                                    .attr("y", function (d) { return d.y ; })
                                    .attr("width", pion.astronef.width)
                                    .attr("height", pion.astronef.height)
                                    .attr("draggable","valid")
                                    .attr("dragtype","init")
                                    .attr("xlink:href","img/astronef_180.png")
                                    .call(drag);
                }
            } else {
                // On rend non draggable les astronefs
                d3.selectAll(".astronef").attr("draggable","invalid");
            }
            break;
        case 2 :
            // Placement des pions
            if (startOrEnd == "start") {
                var piontoplace = [
                    {x: (MapColumns + 1) * hexRadius * 1.5, y: 1 * hexRadius * 1.75, type: "char"},
                    {x: (MapColumns + 2) * hexRadius * 1.5, y: 1 * hexRadius * 1.75, type: "char"},
                    {x: (MapColumns + 3) * hexRadius * 1.5, y: 1 * hexRadius * 1.75, type: "char"},
                    {x: (MapColumns + 4) * hexRadius * 1.5, y: 1 * hexRadius * 1.75, type: "char"},
                    {x: (MapColumns + 1) * hexRadius * 1.5, y: 2 * hexRadius * 1.75, type: "gros_tas"},
                    {x: (MapColumns + 2) * hexRadius * 1.5, y: 2 * hexRadius * 1.75, type: "crabe"},
                    {x: (MapColumns + 3) * hexRadius * 1.5, y: 2 * hexRadius * 1.75, type: "pondeuse"},
                    {x: (MapColumns + 1) * hexRadius * 1.5, y: 3 * hexRadius * 1.75, type: "vedette"},
                    {x: (MapColumns + 2) * hexRadius * 1.5, y: 3 * hexRadius * 1.75, type: "vedette"},
                    {x: (MapColumns + 3) * hexRadius * 1.5, y: 3 * hexRadius * 1.75, type: "barge", orientation: 0}
                ];

                var rectangle = container.append("g")
                        .attr("class", "unit")
                            .selectAll("circle")
                            .data(piontoplace).enter().append("svg:image")
                                .attr("class", function (d) { return "unit " + d.type + " player" + game.player ; })
                                .attr("x", function (d) { return d.x ; })
                                .attr("y", function (d) { return d.y ; })
                                .attr('width', function (d) { return pion[d.type].width;})
                                .attr('height', function (d) { return pion[d.type].height;})
                                .attr("draggable","valid")
                                .attr("dragtype","init")
                                .attr("xlink:href",function (d) { return "img/" + d.type + "_0.png"; })
                                .attr("figurine", function (d) { return d.type; })
                                .call(drag);
                                
            } else {
                //l'IA place ses pions 
                
                // On rend 
                d3.selectAll(".unit").attr("dragtype","normal");
                
            }
            nbpoints = 0;
            break;
    }
}


function initour (numtour,startOrEnd) {

    var nbpoints = 15;

    switch (numtour) {
        case 1 :
            // Placement des astronefs
            if (startOrEnd == "end") {
                var positiona = {i:-1 , j:-1};
                d3.selectAll(".astronef").each(function (d) {
                        positiona.i = parseInt(d3.select(this).attr("i"));
                        positiona.j = parseInt(d3.select(this).attr("j"));
                        positiona.o = parseInt(d3.select(this).attr("orientation"));

                        // On ajoute trois tourelles 
                        if (positiona.o == 0) {
                            var tourelle = [{
                                    i: positiona.i,
                                    j: positiona.j + 1,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:0
                            },{
                                    i: positiona.i - 1,
                                    j: positiona.j - 1 + positiona.i % 2,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:120
                            },{
                                    i: positiona.i + 1,
                                    j: positiona.j - 1 + positiona.i % 2,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:240
                            }];
                        } else {
                            var tourelle = [{
                                    i: positiona.i,
                                    j: positiona.j - 1,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:0
                            },{
                                    i: positiona.i - 1,
                                    j: positiona.j + positiona.i % 2,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:120
                            },{
                                    i: positiona.i + 1,
                                    j: positiona.j + positiona.i % 2,
                                    x: 0,
                                    y: 0,
                                    type: "tourelle",
                                    orientation:240
                            }];
                        }
                        
                        for (var index = 0 ; index < 3; index ++) {
                            tourelle[index].x = svgIJtoXYimage(hexRadius,pion,tourelle[index]).x;
                            tourelle[index].y = svgIJtoXYimage(hexRadius,pion,tourelle[index]).y;
                            console.log(tourelle[index].i + "-" + tourelle[index].j)
                        }
                        
                        var rectangle = container.append("g")
                                    .attr("class", "unit")
                                    .selectAll("circle")
                                    .data(tourelle).enter()
                                        .append("svg:image")
                                        .attr("class", "unit tourelle player" + game.player)
                                        .attr("x", function (d) { return d.x ; })
                                        .attr("y", function (d) { return d.y ; })
                                        .attr("i", function (d) { return d.i ; })
                                        .attr("j", function (d) { return d.j ; })
                                        .attr("orientation", function (d) { return d.orientation ; })
                                        .attr("width", pion.tourelle.width)
                                        .attr("height", pion.tourelle.height)
                                            .attr("xlink:href",function (d) { return "img/tourelle_" + d.orientation + ".png"; })
                                            .call(drag);
                        
                        // On enleve les minerais
                        terrain.removeMinerai(positiona,3);
                    }
                )
            }

            break;
        case 2 :
            // Placement des pions
            if (startOrEnd == "end") {
                //l'IA place ses pions 
                
                // On rend 
                d3.selectAll(".unit").attr("dragtype","normal");
                
            }
            break;
        case 21 :
            // Décollage possible
            break;
        case 25 :
            // Fin de la partie
            break;
    }
}

// Cette fonction régit les tours 
function contolleurdetour(playerNum, state) {
    console.log(playerNum + " " + state);
    // Si c'est le premier joueur qui commmence, on réalise les actions de début de tour 
    if (playerNum == 1 && state == "start") {
        
        // On réalise les actions de début de tour
        // Mise à jour du texte des tours
        info.tour.text("Tour : " + game.tour + "/25");

        // on met à jour le texte de la marée actuelle
        game.marre == marre.get(game.tour );
        info.maree.text("Marée : " + marre.getName(game.tour  - 1));
        
        // on met à jour le texte de la marée actuelle
        info.maree_next.text("future : " + marre.getName(game.tour ));
        
        initour (game.tour,"start");
    }
    
    // Si c'est le début d'un joueur 
    if (state == "start") {
        // On remet le compteur des points
        players[playerNum].points = 0;
        UIupdatePoints(0);
        
        // On réinitialise le timer
        startTimer();
        
        // On initialise le tour du joueur 
        initourPlayer (game.tour,"start");
        
        // Si c'est l'IA , on la fait jouer 
        if (players[playerNum].type == "bot") {
            
            switch (game.tour) {
                case 1 :
                    //l'IA place ses pions 
                    position = players[playerNum].pointer.placeastronef();
                    break;
                
            }
            
            // On fait jouer le perso suivant dans Xms
            setTimeout(function(){ contolleurdetour(game.player,"end");}, 100)
            
        }
            
                        
        
    }
    
    // Si c'est la fin d'un joueur 
    if (state == "end") {
        
        // On arrete le timer 
        stopTimer();
        
        // On termine le tour du joueur 
        initourPlayer (game.tour,"end");
        
        // S'il reste des points, on les crédites
        // Mise à jour des boulettes
        if ((getNbPoint(game.tour) - players[playerNum].points) >= 10 && players[playerNum].boulettes == 0) {
            players[playerNum].boulettes = players[playerNum].boulettes + 2;
        } else if ((getNbPoint(game.tour) - players[playerNum].points) >= 5  && players[playerNum].boulettes < 2) {
            players[playerNum].boulettes = players[playerNum].boulettes + 1;
        }
        info.boulette.text("Nb boulettes : " + players[playerNum].boulettes);
        
        // On lance le tour du deuxième joueur (sauf si c'est le dernier)
        if (playerNum != players.length - 1 ) {
            game.player = playerNum + 1;
            contolleurdetour(game.player, "start");
        }
        
    }
    
    // Si c'est le dernier jouer qui termine, on réalise les actions de fin de tour 
    if (playerNum == players.length - 1 && state == "end") {
        
        initour (game.tour,"end");
        
        game.player = 1;
        game.tour = game.tour + 1;
        contolleurdetour(game.player, "start");
    }

}
