
function UIupdatePoints(nbPointsPotentiellmentEnMoins) {
    
    var strToAdd = "";
    if (nbPointsPotentiellmentEnMoins != 0 ) {
        strToAdd = " (" + (players[game.player].points + nbPointsPotentiellmentEnMoins) + ") ";
    }
    
    info.point.text("Points restants : " + players[game.player].points + strToAdd + "/" + getNbPoint(game.tour));
}
