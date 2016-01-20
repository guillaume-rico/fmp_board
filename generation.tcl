
# Define hexagone side in mm
set side 30

set imageNameForGround   "sand.JPG"
set imageNameForMountain "charbon_2.png"

# Les symboles disponibles sont :
#   e : eau
#   s : sol
#   i : ilot
#   a : marécage
#   m : montagne
set surface ""
lappend surface [list s s s s m s s s s s s a s a e m m m e e s s s s s a s s a s s s s s s s s ]

lappend surface [list s s s s s s s s s s s a a a a a m s s a s s s s s s a a a a a s s s s s s ]

lappend surface [list s s s s s a a a s s s e s s s s a a a m a s s s s s s a a s a a s s s s s ]

lappend surface [list s s s s m m m m a e e s e s s s s s m m a s s s a e e e a s s s e m s m s ]

lappend surface [list m s s m m s a e s e e e e e s s s e e e e e e e e e e e s e m e e m m s m ]

lappend surface [list s s s s s s e e e i e e e e e s i e e e e e e e e e e e m i e e e s s s s ]

lappend surface [list s s s s s s e e e i s s s i i i i e e e e e e e e e e e i i e m a s s s s ]

lappend surface [list s s s s s s a s s i i s s a i e e i e i e i e e e e e e e s m m a s s s s ]

lappend surface [list s s a s s s a s e e i s a m m e e s i s s i i e e e e e e s s s a a s s s ]

lappend surface [list s s s s s s a e e e e e a a s e s s s m m s e e e i e e e e s s s a s s s ]

lappend surface [list s s s s s a e e e e e e s e e e s s s m s s a s s e e i i e e s s s a a s ]

lappend surface [list a a s s s e s e e e e s s e e e e e s m s a a s s m e e i e e s s s m a a ]

lappend surface [list a a m m e e s i e e e e s s e e e e m s a s a a m s e e e e e s s e a s a ]

lappend surface [list m m a a e s s s i i i e e e e m e a s s a s s e m i i s e e s e e s s s s ]

lappend surface [list m s s a s s s s i s s m e e e m i a s s a s e e i a i e e e s e s s s s s ]

lappend surface [list s s s a s s s e s i e e e m e e i e e e e e e e i a m e a i m e s s s s s ]

lappend surface [list s s s m e m e e i i e e e s i i e e e e e e e e e e e e s s e m s s s s s ]

lappend surface [list s s s m e m m e i e e e a a e e s s s e e e e e e e e e s e e s m m s s s ]

lappend surface [list s s m m e e e i i s e a a a e s s s s s s s s e e e s s e a s s s s m s s ]

lappend surface [list s s m a a a e s s s s a a a a s s s s s s s s s e a s s s m a s s s s s s ]

lappend surface [list s s m a a a a s s s s s a s s s s s s s s s s s s s a a m e a s s s s s s ]

lappend surface [list s s s s s s s s s s s a a e s s s m m m s s s s s s s a e s s s s s s s s ]

lappend surface [list s s s s s s s s s s s a s s e m m m m m s m s s s a a s a s s s s s s s s ]


# Taille standard : 37 colonne4, 23 lignes
# Taille améliorée : 23 x 23
set nbColonne [llength [lindex $surface 0]]
set nbLigne [llength $surface]
 
set s $::side
set t [expr int($s / 2.0)]			    
set r [expr int($s * 0.8660254037844)]	
set h [expr 2 * $r]
set shiftX [expr $t + $s]

# On aclcul la taille de l'image compete
set outputWidth 	[expr ($t + $s) * $nbColonne + $t]
set outputHeigth	[expr ($h) * $nbLigne + $r]



proc drawHex {fid startX startY {style none} {expand 1} {shiftX 0} {shiftY 0}} {

    # http://www.quarkphysics.ca/scripsi/hexgrid/
    
    set s [expr int($::side * $expand)]
    set t [expr int($s / 2.0)]			    
    set r [expr int($s * 0.8660254037844)]	
    set h [expr 2 * $r]
	set w [expr $s + 2 * $t]

    set x1 [expr $startX - (($expand - 1) / 2.0) * $w  + $t]
    set y1 [expr $startY - (($expand - 1) / 2.0) * $h  ]
    set x2 [expr $x1 + $s]
    set y2 [expr $y1]
    set x3 [expr $x2 + $t]
    set y3 [expr $y2 + $r]
    set x4 [expr $x3 - $t]
    set y4 [expr $y3 + $r]
    set x5 [expr $x4 - $s]
    set y5 [expr $y4 ]
    set x6 [expr $x5 - $t]
    set y6 [expr $y5 - $r]

	if {$style == "none"} {
		puts $fid "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" />"
	}
	if {$style == "bord"} {
		puts $fid "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" style=\"stroke:none; fill: #ffffff;filter:url(#filterMontagne)\" />"
	}
	if {$style == "stroke"} {
		puts $fid "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" style=\"stroke:rgb(0,0,0);stroke-width:1;fill: none\" />"
	}

    set x1 [expr $x1 + $shiftX]
    set y1 [expr $y1 + $shiftY]
    set x2 [expr $x2 + $shiftX]
    set y2 [expr $y2 + $shiftY]
    set x3 [expr $x3 + $shiftX]
    set y3 [expr $y3 + $shiftY]
    set x4 [expr $x4 + $shiftX]
    set y4 [expr $y4 + $shiftY]
    set x5 [expr $x5 + $shiftX]
    set y5 [expr $y5 + $shiftY]
    set x6 [expr $x6 + $shiftX]
    set y6 [expr $y6 + $shiftY]
	
	if {$style == "none"} {
		set rstStr "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" />\n"
	}
	if {$style == "bord"} {
		set rstStr "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" style=\"stroke:none; fill: #ffffff;filter:url(#filterMontagne)\" />\n"
	}
	if {$style == "stroke"} {
		set rstStr "        <polygon points=\"$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4 $x5,$y5 $x6,$y6\" style=\"stroke:rgb(0,0,0);stroke-width:1;fill: none\" />\n"
	}
	
	return $rstStr
}

proc clipHex {fid startX startY} {

    set s $::side
    set t [expr int($s / 2.0)]			    
    set r [expr int($s * 0.8660254037844)]	
    set h [expr 2 * $r]

    set x1 [expr $startX + $t]
    set y1 [expr $startY]
    set x2 [expr $x1 + $s]
    set y2 [expr $y1]
    set x3 [expr $x2 + $t]
    set y3 [expr $y2 + $r]
    set x4 [expr $x3 - $t]
    set y4 [expr $y3 + $r]
    set x5 [expr $x4 - $s]
    set y5 [expr $y4 ]
    set x6 [expr $x5 - $t]
    set y6 [expr $y5 - $r]
	
	set coord ""
	lappend coord [list $x1 $y1]
    lappend coord [list [expr $x1 + $s] [expr $y1]]
	lappend coord [list [expr $x2 + $t] [expr $y2 + $r]]
	lappend coord [list [expr $x3 - $t] [expr $y3 + $r]]
	lappend coord [list [expr $x4 - $s] [expr $y4 ]]
	lappend coord [list [expr $x5 - $t] [expr $y5 - $r]]
	lappend coord [list $x1 $y1]
	

	set str "        <path d=\"M [lindex $coord 0 0],[lindex $coord 0 1] "
	
	set qdsiplay 0
	
	for {set seg 0} {$seg < 6} {incr seg} {
		#set nbPoint [expr int(rand() * 3 + 1)]
		set nbPoint 2

		set dx [expr ([lindex $coord [expr $seg + 1] 0] - [lindex $coord $seg 0]) / $nbPoint]
		set dy [expr ([lindex $coord [expr $seg + 1] 1] - [lindex $coord $seg 1]) / $nbPoint]
		
		set q1 [expr int([lindex $coord $seg 0]  + 0.1 * $dx)]
		set q2 [expr int([lindex $coord $seg 1]  + 0.1 * $dy)]
		
		if {$qdsiplay == 0} {
			append str " Q $q1 $q2, "
			set qdsiplay 1
		}

		
		for {set i 0 } {$i < $nbPoint} {incr i} {
		
			# Le point intermédiaire doit être entre 30 et 70 %
		
			set px [expr int([lindex $coord $seg 0] + $i * $dx + rand() * ($dx * 0.7) + $dx * 0.15 )]
			set py [expr int([lindex $coord $seg 1] + $i * $dy + rand() * ($dy * 0.7) + $dy * 0.15 )]

			append str "$px,$py T "
			
		}
		
		append str "[lindex $coord [expr $seg + 1] 0],[lindex $coord [expr $seg + 1] 1] "
		
		if {$seg != 5} {
			append str " T "
		}
		
	}
	append str " \"  />"
	puts $fid $str

}

proc drawIlot {fid startX startY  {style none}} {

	set nbIlot [expr rand() * 2 + 4]
	
    set s $::side
    set t [expr int($s / 2.0)]			    
    set r [expr int($s * 0.8660254037844)]	
    set h [expr 2 * $r]
	set w [expr $s + 2 * $t]
	

	
	for {set ilot 0} {$ilot < $nbIlot} {incr ilot} {
	
		set width [expr $s / 4.0 + rand() * $s / ($nbIlot - 2 )]
		set height [expr $s / 4.0 + rand() * $s / ($nbIlot - 2 )]
		
		# Le priemier dans le quart haut gauche
		set coef 0.5
		set offset  0.05
		
		if {$ilot == 0} {
			set x1 [expr int($startX 			+ rand() * ($w * $coef - $width) + $w * $offset)]
			set y1 [expr int($startY 			+ rand() * ($h * $coef - $height) + $h * $offset)]
		} elseif  {$ilot == 1} {
			set x1 [expr int($startX + $w * 0.4 + rand() * ($w * $coef - $width) + $w * $offset )]
			set y1 [expr int($startY 			+ rand() * ($h * $coef - $height) + $h * $offset)]
		} elseif  {$ilot == 2} {
			set x1 [expr int($startX + $w * 0.4 + rand() * ($w * $coef - $width) + $w * $offset )]
			set y1 [expr int($startY + $h * 0.5 + rand() * ($h * $coef - $height) + $h * $offset )]
		} elseif  {$ilot == 3} {
			set x1 [expr int($startX 			+ rand() * ($w * $coef - $width) + $w * $offset )]
			set y1 [expr int($startY + $h * 0.5 + rand() * ($h * $coef - $height) + $h * $offset )]
		} elseif  {$ilot == 4} {
			set x1 [expr int($startX + $h * 0.25 + rand() * ($w * $coef - $width) + $w * $offset )]
			set y1 [expr int($startY + $h * 0.25 + rand() * ($h * $coef - $height) + $h * $offset )]
		}
		

		set q1 [expr int($x1 + rand() * $s / 4.0)]
		set q2 [expr int($y1 + rand() * $s / 4.0)]
		set x2 [expr int($x1 + $width / 2.0)]
		set y2 [expr int($y1 + $height / 2.0)]
		set x3 [expr int($x1 + $width)]
		set y3 [expr $y1 ]
		set x4 [expr int($x1 + $width / 2.0)]
		set y4 [expr int($y1 - $height / 2.0)]

			if {$style == "none"} {
				puts $fid "        <path d=\"M $x1,$y1 Q $q1 $q2, $x2,$y2 T $x3,$y3 T $x4,$y4 T $x1,$y1\"  />"
			}
			if {$style == "bord"} {
				puts $fid "        <path d=\"M $x1,$y1 Q $q1 $q2, $x2,$y2 T $x3,$y3 T $x4,$y4 T $x1,$y1\" style=\"stroke:none; fill: #ffffff\" />"
			}
	}


}


set fid [open [file join [file dirname [info script]] boardmap.svg] w+]

puts $fid {<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">}
puts $fid "<svg width=\"${outputWidth}mm\" height=\"${outputHeigth}mm\" viewBox=\"0 0 ${outputWidth} ${outputHeigth}\""
puts $fid {     version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink">}

# On définit les paths
puts $fid {<defs>}
puts $fid {
    <filter
       height="1.4"
       y="-0.2"
       width="1.4"
       x="-0.2"
       style="color-interpolation-filters:sRGB;"
       id="filterMontagne">
      <feTurbulence
         baseFrequency="0.025999999999999981"
         numOctaves="3"
         type="fractalNoise"
         result="result91"
         id="feTurbulence5464"
         seed="1"
         stdDeviation="5.5" />
      <feDisplacementMap
         scale="41"
         result="result5"
         xChannelSelector="R"
         in="SourceGraphic"
         in2="result91"
         id="feDisplacementMap5466" />
      <feGaussianBlur
         stdDeviation="5.4679694323144101"
         id="feGaussianBlur9557"
         result="result92" />
      <feComposite
         in="SourceGraphic"
         operator="atop"
         in2="result92"
         id="feComposite5468" />
    </filter>
    <filter
       style="color-interpolation-filters:sRGB;"
       id="filterOmbre">
      <feFlood
         flood-opacity="0.498039"
         flood-color="rgb(0,0,0)"
         result="flood"
         id="feFlood10550" />
      <feComposite
         in="flood"
         in2="SourceGraphic"
         operator="in"
         result="composite1"
         id="feComposite10552" />
      <feGaussianBlur
         in="composite1"
         stdDeviation="6.8"
         result="blur"
         id="feGaussianBlur10554" />
      <feOffset
         dx="-7.6"
         dy="7"
         result="offset"
         id="feOffset10556" />
      <feComposite
         in="offset"
         in2="SourceGraphic"
         operator="out"
         result="composite2"
         id="feComposite10558" />
    </filter>
	}

puts $fid {    <clipPath id="clip_water">}

set formeMontagne ""

for {set i 0} {$i < $nbColonne} {incr i} {
    for {set j 0} {$j < [expr $nbLigne]} {incr j} {
		if {[lindex $surface $j $i] == "e"} {
			drawHex $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r]
		}
		if {[lindex $surface $j $i] == "a"} {
			drawIlot $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r]
		}
		if {[lindex $surface $j $i] == "i"} {
			drawHex $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r]
		}
    }
}
puts $fid {    </clipPath>}
puts $fid {    <mask id="mask_sand">}
for {set i 0} {$i < $nbColonne} {incr i} {
    for {set j 0} {$j < [expr $nbLigne]} {incr j} {
		if {[lindex $surface $j $i] == "s" || [lindex $surface $j $i] == "a"} {
			drawHex $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r] bord
		}
		if {[lindex $surface $j $i] == "i"} {
			drawIlot $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r] bord
		}
    }
}
puts $fid {    </mask>}
puts $fid {    <mask id="mask_charbon">}
for {set i 0} {$i < $nbColonne} {incr i} {
    for {set j 0} {$j < [expr $nbLigne]} {incr j} {
		if {[lindex $surface $j $i] == "m"} {
			append formeMontagne [drawHex $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r] bord 1.2 -15 15]
		}
    }
}
puts $fid {    </mask>}
puts $fid {    <mask id="mask_charbon_ombre">}
puts $fid $formeMontagne
puts $fid {    </mask>}
puts $fid {    <mask id="mask_marecage">}
for {set i 0} {$i < $nbColonne} {incr i} {
    for {set j 0} {$j < [expr $nbLigne]} {incr j} {
		if {[lindex $surface $j $i] == "a"} {
			drawIlot $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r] bord
		}
    }
}
puts $fid {    </mask>}

puts $fid {</defs>}

# On ajoute les images  pattern_eau_2 pattern_sand_stone
puts $fid "<image xlink:href=\"$imageNameForGround\" x=\"0\" y=\"0\" height=\"$outputHeigth\" width=\"$outputWidth\" preserveAspectRatio=\"none\"  />"
puts $fid "<rect x=\"0\" y=\"0\" width=\"$outputWidth\" height=\"$outputHeigth\" style=\"fill:#5f788c\" clip-path=\"url(#clip_water)\" />"
puts $fid "<image xlink:href=\"$imageNameForGround\" x=\"0\" y=\"0\" height=\"$outputHeigth\" width=\"$outputWidth\" preserveAspectRatio=\"none\" mask=\"url(#mask_sand)\"  />"
puts $fid "<rect x=\"0\" y=\"0\" width=\"$outputWidth\" height=\"$outputHeigth\" style=\"fill:#5f788c\" mask=\"url(#mask_marecage)\" />"
puts $fid "<rect x=\"0\" y=\"0\" width=\"$outputWidth\" height=\"$outputHeigth\" mask=\"url(#mask_charbon_ombre)\"  style=\"fill:#000000\" />"
puts $fid "<image xlink:href=\"${imageNameForMountain}\" x=\"0\" y=\"0\" height=\"$outputHeigth\" width=\"$outputWidth\" preserveAspectRatio=\"none\" mask=\"url(#mask_charbon)\" />"



# On dessine les hexagones
for {set i 0} {$i < $nbColonne} {incr i} {
    for {set j 0} {$j < [expr $nbLigne]} {incr j} {
        drawHex $fid [expr $shiftX * $i] [expr $h * $j + ($i % 2) * $r] stroke 
    }
}
     
# On trace un rectangle qui fait le tour
puts $fid "<rect x=\"0\" y=\"0\" width=\"$outputWidth\" height=\"$outputHeigth\" style=\"fill:none;stroke:#000000;stroke-opacity:1\" />"

puts $fid {</svg>}

close $fid

