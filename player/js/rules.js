
// Calcul la distance entre deux positions
// unit doit contenir type
// game doit contenir marree
function astar (start,goal,unit,game) {
    
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
       for (index = 0; index < neig.length; ++index) {
            // S'il n'a pas été déjà visité et que le terrain est valide
            neig[index].type = unit.type;
           if (visited.indexOf(neig[index].i + "-" + neig[index].j) == -1
                && rules_check_position(neig[index],game) == "valid") {
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
    
    return path.reverse(); 
    
}

// Position doit contenir :
// - i j et type
// - Si type est astronef, elle doit aussi contenir orientation
// game doit contenir marree
function rules_check_position(position,game) {
    // On récupere la nature du sol
    sol = intoshortint(terrain.get(position.i, position.j));
    // 3 Marécage - 4 sol - 5 montagne
    var returnval = "invalid";

    // Si c'est un astronef
    if (position.type == "astronef") {
        // On vérifie que les 4 cases sont OK
        hex = getHexOfFigurine(position);
        returnval = "valid";
        for (index = 0; index < hex.length; ++index) {
            naturesol = intoshortint(terrain.get(hex[index].i, hex[index].j));
            if (naturesol < 3 || naturesol == 5) {
                returnval = "invalid";
                break;
            }
        }
    } else {
        // S'il y a un minerai
        if (terrain.minerai[position.i][position.j] != 1) {
            // Si c'est un char 
            switch (position.type) {
                case "pondeuse" :
                case "crabe" :
                case "minerai" :
                case "char":
                    // Si c'est supérieur à 3 c'est que c'est praticable
                    if (sol + game.marree >= 3) {
                        returnval = "valid";
                    }
                    break;
                case "astronef" :
                case "gros_tas":
                    // Si c'est supérieur à 3 mais pas une montagne
                    if (sol + game.marree >= 3 && sol != 5) {
                        returnval = "valid";
                    }
                    break;
                case "barge":
                case "vedette":
                case "ponton":
                    // Si c'est inférieur à 3 c'est que c'est que c'est de l'eau
                    if (sol + game.marree < 3) {
                        returnval = "valid";
                    }
                    break;            
            }
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

function initour (numtour,startOrEnd) {

    var nbpoints = 15;

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
                
                // On enleve les minerais
                var positiona = {i:-1 , j:-1};
                d3.selectAll(".astronef").each(function (d) {
                        positiona.i = d3.select(this).attr("i");
                        positiona.j = d3.select(this).attr("j");
                        console.log(positiona);
                        terrain.removeMinerai(positiona,3);
                    }
                )
            }




            nbpoints = 0;
            
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
                    {x: (MapColumns + 3) * hexRadius * 1.5, y: 3 * hexRadius * 1.75, type: "barge"}
                ];

                var rectangle = container.append("g")
                        .attr("class", "unit")
                            .selectAll("circle")
                            .data(piontoplace).enter().append("svg:image")
                                .attr("class", function (d) { return "unit " + d.type ; })
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
                //position = IA1.placeastronef();
                d3.selectAll(".astronef").attr("dragtype","normal");
                
            }
            nbpoints = 0;
            break;
        case 3 :
            // 5 points
            nbpoints = 5;
            break;
        case 4 :
            // 10 points
            nbpoints = 10;
            break;
        case 5 :
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 :
        case 11 :
        case 12 :
        case 13 :
        case 14 :
        case 15 :
        case 16 :
        case 17 :
        case 18 :
        case 19 :
        case 20 :
        case 22 :
        case 23 :
        case 24 :
            // 15 points
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
        
        // On remet le compteur des points
        players[playerNum].points = 0;
        info.point.text("Points restants : " + players[playerNum].points + "/" + getNbPoint(game.tour));
        
        // on met à jour le texte de la marée actuelle
        info.maree.text("Marée : " + marre.getName(game.tour  - 1));
        
        // on met à jour le texte de la marée actuelle
        info.maree_next.text("future : " + marre.getName(game.tour ));
        
        initour (game.tour,"start");
    }
    
    // Si c'est le début d'un joueur 
    if (state == "start") {
        // On réinitialise le timer 
        
        // Si c'est l'IA , on la fait jouer 
        if (players[playerNum].type == "bot") {
            
            switch (game.tour) {
                case 1 :
                    //l'IA place ses pions 
                    position = players[playerNum].pointer.placeastronef();
                    break;
                
            }
            
            // On fait jouer le perso suivant dans Xms
            setTimeout(function(){ contolleurdetour(game.player,"end");}, 1000)
            
        }
            
                        
        
    }
    
    // Si c'est la fin d'un joueur 
    if (state == "end") {
        
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
        game.player = 1;
        game.tour = game.tour + 1;
        contolleurdetour(game.player, "start");
    }

}
