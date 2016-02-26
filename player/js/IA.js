
function IA() {
    // Type d'IA disponible
    // Attaque au sol : peur de l'eau
    
    this.coef = {
        astronef : {
            eau: 100,
            i1 : -3,
            a1 : -2,
            m1 : 20,
            i2 : -2,
            a2 : -1,
            m2 : 10
        }
    };
    
}

IA.prototype.placeastronef = function() {
    var position = {};
    var game = {};
    var scorepos = {};
    position.type = "astronef";
    var selectedPosition = {i:0, j:0};
    
    for (var i = 0; i < MapColumns; i++) {
        position.i = i;
        for (var j = 0; j < MapRows; j++) {
            position.j = j;
            
            var max = -100;
            var orientationchoisie = 0;
            for (var orien = 0; orien < 360; orien = orien + 180) {

                // On regarde si la position est valide
                position.orientation = orien;
                status = rules_check_position(position,game);

                // Si la position est valide, on calcul son score
                if (status == "valid") {
                    // Contre l'astronef : il y a de l'eau : c'est au top : 100 points
                    // A 1 rang du centre :
                    //  - pierre 10 points 
                    //  - marecage -2
                    //  - recif    -3
                    var score = 0;
                    var eau = 0;
                    var voisins = astronef_neighbor(position,1);
                    for (var index = 0; index < voisins.length ; index++) {
                        sol = intoval(terrain.get(voisins[index].i, voisins[index].j));
                        switch (intoval(terrain.get(voisins[index].i, voisins[index].j))) {
                            case "e" :
                                if (eau == 0) {
                                    eau = 1;
                                    score += this.coef.astronef.eau;
                                }
                                break;
                            case "i" :
                                score += this.coef.astronef.i1;
                                break;
                            case "a" :
                                score += this.coef.astronef.a1;
                                break;
                            case "s" :
                                break;
                            case "m" :
                                score += this.coef.astronef.m1;
                                break;
                        } 
                    }
                    // A 2 rangs du centre :
                    //  - pierre 5 points 
                    //  - marecage -1
                    //  - recif    -2
                    var voisins = astronef_neighbor(position,2);
                    for (var index = 0; index < voisins.length ; index++) {
                        switch (intoval(terrain.get(voisins[index].i, voisins[index].j))) {
                            case "e" :
                                if (eau == 0) {
                                    eau = 1;
                                    score += this.coef.astronef.eau;
                                }
                                break;
                            case "i" :
                                score += this.coef.astronef.i2;
                                break;
                            case "a" :
                                score += this.coef.astronef.a2;
                                break;
                            case "s" :
                                break;
                            case "m" :
                                score += this.coef.astronef.m2;
                                break;
                        } 
                    }

                    // On met à jour le max 
                    if (score > max) {
                        max = score;
                        orientationchoisie = orien;
                    }
                }
            }
            
            // On calcul la distance par rapports aux autres astronef 
            var unit = {type:"char"};
            
            //astar (position,goal,unit,game);
            
            
            // En Debug on affiche le texte sur l'image 
            /*if (max >= 120) {
                tstpost = svgIJtoXY(hexRadius,position);
                debug = container.append("text")
                            .attr("x", tstpost.x - 4)
                            .attr("y", tstpost.y)
                            .text(max);
            }*/
            
            // On sauvegarde la valeur 
            scorepos[i + "-" + j + "-" + orientationchoisie] = max;           
            
        }
    }
    
    // On sélection la valeur
    keysSorted = Object.keys(scorepos).sort(function(a,b){return scorepos[a]-scorepos[b]}).reverse();
    
    // On calcul i et j
    itemp = keysSorted[0].split("-")[0];
    jtemp = keysSorted[0].split("-")[1];
    otemp = keysSorted[0].split("-")[2];
    console.log(itemp + "-" + jtemp + "-" + otemp)
    // On place l'astronef
    var astrone = [{
            i: itemp,
            j: jtemp,
            x: 0.7 * width,
            y: 0.5 * height,
            type: "astronef",
            orientation:otemp
    }];
    astrone[0].x = svgIJtoXYimage(hexRadius,pion,astrone[0]).x;
    astrone[0].y = svgIJtoXYimage(hexRadius,pion,astrone[0]).y;
    
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
    
    
    return scorepos[keysSorted[0]];
}
