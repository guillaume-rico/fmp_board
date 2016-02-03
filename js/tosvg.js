
function download(preview) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tosvg(preview)));
    element.setAttribute('download', 'fmbboard.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

var side = 12;
var t = Math.floor(side / 2.0);			    
var r = Math.floor(side * 0.8660254037844);	
var h = 2 * r;
var shiftX = t + side;




var drawHexStr = "";
function drawHex(startX, startY, style, expand, shiftX, shiftY) {

    if (typeof style === "undefined" || style === null) { 
        style = "none"; 
    }
    if (typeof expand === "undefined" || expand === null) { 
        expand = 1; 
    }
    if (typeof shiftX === "undefined" || shiftX === null) { 
        shiftX = 0; 
    }
    if (typeof shiftY === "undefined" || shiftY === null) { 
        shiftY = 0; 
    }
    // http://www.quarkphysics.ca/scripsi/hexgrid/

    var side2 =  Math.floor(side * expand);
    var t =  Math.floor(side2 / 2.0);			    
    var r =  Math.floor(side2 * 0.8660254037844);	
    var h =  2 * r;
	var w =  side2 + 2 * t;

    var x1 =  startX - ((expand - 1) / 2.0) * w  + t;
    var y1 =  startY - ((expand - 1) / 2.0) * h  ;
    var x2 =  x1 + side2;
    var y2 =  y1;
    var x3 =  x2 + t;
    var y3 =  y2 + r;
    var x4 =  x3 - t;
    var y4 =  y3 + r;
    var x5 =  x4 - side2;
    var y5 =  y4 ;
    var x6 =  x5 - t;
    var y6 =  y5 - r;

    var retstr = "";
    var styleModif = "";
	if (style == "bord") {
        styleModif = "style=\"stroke:none; fill: #ffffff;filter:url(#filterMontagne)\""
	}
	if (style == "stroke") {
        styleModif = "style=\"stroke:rgb(0,0,0);stroke-width:0.1;fill: none\""
	}
    if (style == "preview") {
        styleModif = "style=\"stroke:none; fill: #ffffff\""
    }
    retstr = retstr.concat("        <polygon points=\"" + x1 + "," +y1 + " " + x2 + "," +y2 + " " + x3 + "," +y3 + " " + x4 + ","  +y4 + " " + x5 + "," +y5 + " " + x6 + "," +y6 +"\" " + styleModif + " />");

    // Cette partie permet de générer le masque des ombres pour les montagnes
    
    x1 =  x1 + shiftX;
    y1 =  y1 + shiftY;
    x2 =  x2 + shiftX;
    y2 =  y2 + shiftY;
    x3 =  x3 + shiftX;
    y3 =  y3 + shiftY;
    x4 =  x4 + shiftX;
    y4 =  y4 + shiftY;
    x5 =  x5 + shiftX;
    y5 =  y5 + shiftY;
    x6 =  x6 + shiftX;
    y6 =  y6 + shiftY;
	
    var styleModif = "";
	if (style == "bord") {
        styleModif = "style=\"stroke:none; fill: #ffffff;filter:url(#filterMontagne)\""
	}
	if (style == "stroke") {
        styleModif = "style=\"stroke:rgb(0,0,0);stroke-width:0.1;fill: none\""
	}
    drawHexStr = drawHexStr.concat("        <polygon points=\"" + x1 + "," +y1 + " " + x2 + "," +y2 + " " + x3 + "," +y3 + " " + x4 + ","  +y4 + " " + x5 + "," +y5 + " " + x6 + "," +y6 +"\" " + styleModif + " />");
	
	return retstr;
}

function clipHex (startX, startY) {

    var t =  Math.floor(side / 2.0);			    
    var r =  Math.floor(side * 0.8660254037844);	
    var h =  2 * r;

    var x1 =  startX + t;
    var y1 =  startY;
    var x2 =  x1 + side;
    var y2 =  y1;
    var x3 =  x2 + t;
    var y3 =  y2 + r;
    var x4 =  x3 - t;
    var y4 =  y3 + r;
    var x5 =  x4 - side;
    var y5 =  y4 ;
    var x6 =  x5 - t;
    var y6 =  y5 - r;
	
	var coord = [];
	coord(0) = [x1, y1];
    coord(1) = [x1 + side, y1];
	coord(2) = [x2 + t, y2 + r];
	coord(3) = [x3 - t, y3 + r];
	coord(4) = [x4 - s, y4 ];
	coord(5) = [x5 - t, y5 - r];
	coord(6) = [x1, y1];
	

	var str = "        <path d=\"M "+ coord[0][0] +","+ coord[0][1] +" ";
	
	var qdsiplay = 0
	
	for (var seg = 0 ; seg < 6 ; seg++) {
		// var nbPoint =  Math.floor(Math.random() * 3 + 1);
		var nbPoint = 2 ;

		var dx =  (coord[seg + 1][0] - coord[seg][0]) / nbPoint;
		var dy = (coord[seg + 1][1] - coord[seg][1]) / nbPoint;
		
		var q1 = Math.floor(coord[seg][0]  + 0.1 * dx);
		var q2 = Math.floor(coord[seg][1]  + 0.1 * dy);
		
		if (qdsiplay == 0) {
			str = str.concat( " Q q1 q2, " );
			var qdsiplay = 1;
		}

		
		for (var i = 0  ; i < nbPoint ; i++) {
		
			// Le point intermédiaire doit être entre 30 et 70 %
		
			var px =  Math.floor(coord[seg][0] + i * dx + Math.random() * (dx * 0.7) + dx * 0.15 );
			var py =  Math.floor(coord[seg][1] + i * dy + Math.random() * (dy * 0.7) + dy * 0.15 );

			str = str.concat( "px,py T ");
			
		}
		
		str = str.concat( coord[seg + 1][0] + "," + coord[seg + 1][1]);
		
		if (seg != 5) {
			str = str.concat( " T ");
		}
		
	}
	str = str.concat( " \"  />");
	return str;

}

function drawIlot (startX, startY, style) {

    if (typeof style === "undefined" || style === null) { 
        style = "none"; 
    }

	var nbIlot =  Math.random() * 2 + 4;

    var t =  Math.floor(side / 2.0);			    
    var r =  Math.floor(side * 0.8660254037844);	
    var h =  2 * r;
	var w =  side + 2 * t;

    var retstr = "";
	
	for (var ilot = 0 ; ilot < nbIlot ; ilot++) {
	
		var width =  side / 4.0 + Math.random() * side / (nbIlot - 2 );
		var height =  side / 4.0 + Math.random() * side / (nbIlot - 2 );
		
		// Le priemier dans le quart haut gauche
		var coef = 0.5;
		var offvar = 0.05;
		
		if (ilot == 0) {
			var x1 =  Math.floor(startX 			+ Math.random() * (w * coef - width) + w * offvar);
			var y1 =  Math.floor(startY 			+ Math.random() * (h * coef - height) + h * offvar);
		} else if  (ilot == 1) {
			var x1 =  Math.floor(startX + w * 0.4 + Math.random() * (w * coef - width) + w * offvar );
			var y1 =  Math.floor(startY 			+ Math.random() * (h * coef - height) + h * offvar);
		} else if  (ilot == 2) {
			var x1 =  Math.floor(startX + w * 0.4 + Math.random() * (w * coef - width) + w * offvar );
			var y1 =  Math.floor(startY + h * 0.5 + Math.random() * (h * coef - height) + h * offvar );
		} else if  (ilot == 3) {
			var x1 =  Math.floor(startX 			+ Math.random() * (w * coef - width) + w * offvar );
			var y1 =  Math.floor(startY + h * 0.5 + Math.random() * (h * coef - height) + h * offvar );
		} else if  (ilot == 4) {
			var x1 =  Math.floor(startX + h * 0.25 + Math.random() * (w * coef - width) + w * offvar );
			var y1 =  Math.floor(startY + h * 0.25 + Math.random() * (h * coef - height) + h * offvar );
		}
		

		var q1 =  Math.floor(x1 + Math.random() * side / 4.0);
		var q2 =  Math.floor(y1 + Math.random() * side / 4.0);
		var x2 =  Math.floor(x1 + width / 2.0);
		var y2 =  Math.floor(y1 + height / 2.0);
		var x3 =  Math.floor(x1 + width);
		var y3 =  y1 ;
		var x4 =  Math.floor(x1 + width / 2.0);
		var y4 =  Math.floor(y1 - height / 2.0);

        if (style == "none") {
            retstr = retstr.concat("        <path d=\"M " + x1 + "," + y1 + " Q " + q1 + " "+q2+", " + x2+"," + y2+" T " + x3+"," + y3+" T " + x4+"," + y4+" T " + x1+"," + y1+"\"  />"+ "\n");
        }
        if (style == "bord") {
            retstr = retstr.concat("        <path d=\"M " + x1 + "," + y1 + " Q "+q1+" "+q2+", " + x2+"," + y2+" T " + x3+"," + y3+" T " + x4+"," + y4+" T " + x1+"," + y1+"\" style=\"stroke:none; fill: #ffffff\" />"+ "\n");
        }
	}

    return retstr;
}

function tosvg (preview) {
    
    // On Calcul la taille de l'image compete
    var outputWidth  = (t + side) * nbCol + t;
    var outputHeigth = h * nbRow + r;

    var retstr = '\
<?xml version="1.0" standalone="no"?> \n\
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" \n\
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \n';
    retstr = retstr.concat('<svg width=\"' + outputWidth + 'mm\" height=\"' + outputHeigth + 'mm\" viewBox=\"0 0 ' + outputWidth + ' ' + outputHeigth + '\" \n');
    retstr = retstr.concat('    version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"> \n\
    <defs> \n\
        <filter \n\
           height="1.4" \n\
           y="-0.2" \n\
           width="1.4" \n\
           x="-0.2" \n\
           style="color-interpolation-filters:sRGB;" \n\
           id="filterMontagne"> \n\
          <feTurbulence \n\
             baseFrequency="0.026" \n\
             numOctaves="3" \n\
             type="fractalNoise" \n\
             result="result91" \n\
             id="feTurbulence5464" \n\
             seed="1" \n\
             stdDeviation="2" /> \n\
          <feDisplacementMap \n\
             scale="6" \n\
             result="result5" \n\
             xChannelSelector="R" \n\
             in="SourceGraphic" \n\
             in2="result91" \n\
             id="feDisplacementMap5466" /> \n\
          <feGaussianBlur \n\
             stdDeviation="3" \n\
             id="feGaussianBlur9557" \n\
             result="result92" /> \n\
          <feComposite \n\
             in="SourceGraphic" \n\
             operator="atop" \n\
             in2="result92" \n\
             id="feComposite5468" /> \n\
        </filter> \n\
        <filter \n\
           style="color-interpolation-filters:sRGB;" \n\
           id="filterOmbre"> \n\
          <feFlood \n\
             flood-opacity="0.5" \n\
             flood-color="rgb(0,0,0)" \n\
             result="flood" \n\
             id="feFlood10550" /> \n\
          <feComposite \n\
             in="flood" \n\
             in2="SourceGraphic" \n\
             operator="in" \n\
             result="composite1" \n\
             id="feComposite10552" /> \n\
          <feGaussianBlur \n\
             in="composite1" \n\
             stdDeviation="3.8" \n\
             result="blur" \n\
             id="feGaussianBlur10554" /> \n\
          <feOffset \n\
             dx="-2.6" \n\
             dy="1.3" \n\
             result="offset" \n\
             id="feOffset10556" /> \n\
          <feComposite \n\
             in="offset" \n\
             in2="SourceGraphic" \n\
             operator="out" \n\
             result="composite2" \n\
             id="feComposite10558" /> \n\
        </filter> \n');
        // On ajoute le clip pour l'eau
    retstr = retstr.concat('         <clipPath id="clip_water"> \n');
    for (var i = 0; i < nbCol; i++) {
        for (var j = 0 ; j < nbRow ; j++) {
            localGrndStyle = shortintoval(groundstyle[ i + nbCol * j]);
            if (localGrndStyle == "e"  || localGrndStyle == "i") {
                retstr = retstr.concat(drawHex(shiftX * i,h * j + (i % 2) * r) + "\n");
            }
            if (localGrndStyle == "a") {
                retstr = retstr.concat(drawIlot(shiftX * i,h * j + (i % 2) * r) + "\n");
            }
        }
    }
 retstr = retstr.concat('         </clipPath> \n');
 retstr = retstr.concat('         <mask id="mask_sand"> \n');
    for (var i = 0; i < nbCol; i++) {
        for (var j = 0 ; j < nbRow ; j++) {
            localGrndStyle = shortintoval(groundstyle[ i + nbCol * j]);
            if (localGrndStyle == "s"  || localGrndStyle == "a") {
                retstr = retstr.concat(drawHex(shiftX * i,h * j + (i % 2) * r,"bord",1.2) + "\n");
            }
            if (localGrndStyle == "i") {
                retstr = retstr.concat(drawIlot(shiftX * i,h * j + (i % 2) * r,"bord") + "\n");
            }
        }
    }
 retstr = retstr.concat('         </mask> \n');
 retstr = retstr.concat('         <mask id="mask_charbon"> \n');
    drawHexStr = "";
    for (var i = 0; i < nbCol; i++) {
        for (var j = 0 ; j < nbRow ; j++) {
            localGrndStyle = shortintoval(groundstyle[ i + nbCol * j]);
            if (localGrndStyle == "m") {
                if (!preview) {
                    retstr = retstr.concat(drawHex(shiftX * i,h * j + (i % 2) * r,"bord",1.1,-1 * side / 3,side / 3) + "\n");
                } else {
                    // Si on est en preview, les hexagones doivent faire la taille de la carte
                    retstr = retstr.concat(drawHex(shiftX * i,h * j + (i % 2) * r,"preview") + "\n");
                }
            }
        }
    }
 retstr = retstr.concat('         </mask> \n');
 retstr = retstr.concat('         <mask id="mask_charbon_ombre"> \n');
    retstr = retstr.concat(drawHexStr);
 retstr = retstr.concat('         </mask> \n');
 retstr = retstr.concat('         <mask id="mask_marecage"> \n');
    for (var i = 0; i < nbCol; i++) {
        for (var j = 0 ; j < nbRow ; j++) {
            localGrndStyle = shortintoval(groundstyle[ i + nbCol * j]);
            if (localGrndStyle == "a") {
                retstr = retstr.concat(drawIlot(shiftX * i,h * j + (i % 2) * r,"bord") + "\n");
            }
        }
    }
    retstr = retstr.concat('         </mask> \n');
    retstr = retstr.concat('    </defs> \n');
  
    var imageNameForGround = "sand.JPG";
    var imageNameForMountain = "charbon.png";
  
    // On ajout l'image du sol sur l'ensemble de la carte
    if (!preview) {
        retstr = retstr.concat('     <image xlink:href=\"' + imageNameForGround + '\" x=\"0\" y=\"0\" height=\"' + outputHeigth + '\" width=\"' + outputWidth + '\" preserveAspectRatio=\"none\"  /> \n');
    } else {
        retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" style=\"fill:#CC9959\"  /> \n');
    }
    
    // On ajoute de l'eau uniquement ou c'est nécessaire
    retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" style=\"fill:#5f788c\" clip-path=\"url(#clip_water)\" /> \n');
    
    // On fait dépasser de la terre sur l'eau
    if (!preview) {
        retstr = retstr.concat('     <image xlink:href=\"' + imageNameForGround + '\" x=\"0\" y=\"0\" height=\"' + outputHeigth + '\" width=\"' + outputWidth + '\" preserveAspectRatio=\"none\" mask=\"url(#mask_sand)\"  /> \n');
    } else {
        retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" style=\"fill:#CC9959\" mask=\"url(#mask_sand)\"  />" \n');
    }
    
    // On ajoute de l'eau pour les marécages
    retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" style=\"fill:#5f788c\" mask=\"url(#mask_marecage)\" /> \n');
    
    // On ajoute des montagnes
    if (!preview) {
        retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" mask=\"url(#mask_charbon_ombre)\"  style=\"fill:#000000\" /> \n');
        retstr = retstr.concat('     <image xlink:href=\"' + imageNameForMountain + '\" x=\"0\" y=\"0\" height=\"' + outputHeigth + '\" width=\"' + outputWidth + '\" preserveAspectRatio=\"none\" mask=\"url(#mask_charbon)\" /> \n');
    } else {
        retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" mask=\"url(#mask_charbon)\"  style=\"fill:#000000\" /> \n');
    }
     
    // On dessine les hexagones
    for (var i = 0; i < nbCol; i++) {
        for (var j = 0 ; j < nbRow ; j++) {
            localGrndStyle = shortintoval(groundstyle[ i + nbCol * j]);
            if (localGrndStyle != "" && localGrndStyle != "u") {
                retstr = retstr.concat(drawHex((shiftX * i),(h * j + (i % 2) * r),"stroke") + "\n");
            }
        }
    }
     
    // Contour de la carte
    retstr = retstr.concat('     <rect x=\"0\" y=\"0\" width=\"' + outputWidth + '\" height=\"' + outputHeigth + '\" style=\"fill:none;stroke:#000000;stroke-opacity:1\" />\n');
     
    retstr = retstr.concat('</svg>\n');
    
    return retstr;
}
    