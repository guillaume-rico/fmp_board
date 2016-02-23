
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
           if (visited.indexOf(neig[index].i + "-" + neig[index].j) == -1
                && rules_check_position(unit.type,neig[index],game.marree) == "valid") {
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


function rules_check_position(figurine,position,marree) {
    // On récupère la nature du sol
    sol = intoshortint(terrain.get(position.i, position.j));
    // 3 Marécage - 4 sol - 5 montagne
    var returnval = "invalid";
    
    // Si c'est un char 
    switch (figurine) {
        case "char":
            // Si c'est supérieur à 3 c'est que c'est praticable
            if (sol + marree >= 3) {
                returnval = "valid";
            }
            break;
        case "gros_tas":
            // Si c'est supérieur à 3 c'est que c'est praticable
            if (sol + marree >= 3 && sol != 5) {
                returnval = "valid";
            }
            break;
        case "navette":
            // Si c'est supérieur à 3 c'est que c'est praticable
            if (sol + marree < 3) {
                returnval = "valid";
            }
            break;            
    } 

    return returnval;
}