
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


function rules_check_position(position,game) {
    // On récupère la nature du sol
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
            if (naturesol + game.marree < 3 || naturesol == 5) {
                returnval = "invalid";
                break;
            }
            /*
            // Impossible de placer un astronef sur un minerai !
            minerai = terrain.minerai[hex[index].i][hex[index].j];
            if (minerai == 1) {
                returnval = "invalid";
                break;
            }
            */
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

var astrone = {};
function initour (numtour,startOrEnd) {
    
    switch (numtour) {
        case 1 :
            // Placement des astronefs
            if (startOrEnd == "start") {
                astrone = [{
                        i: 0,
                        j: 0,
                        x: 0.7 * width,
                        y: 0.5 * height,
                        type: "astronef",
                        orientation:180
                    }];
                
                var rectangle = container.append("g")
                        .attr("class", "astronef")
                            .selectAll("circle")
                            .data(astrone).enter().append("svg:image")
                                .attr("x", function (d) { return d.x ; })
                                .attr("y", function (d) { return d.y ; })
                                .attr("width", pion.astronef.width)
                                .attr("height", pion.astronef.height)
                                .attr("xlink:href",function (d) { return "img/astronef_" + d.orientation + ".png"; })
                                .call(drag);
            } else {
                //l'IA place ses pions 
                
                // On rend non draggable les astronefs
                astrone[0].drag = "invalid";
            }

            break;
        case 2 :
            // Placement des pions
            break;
        case 3 :
            // 5 points
            break;
        case 4 :
            // 10 points
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

