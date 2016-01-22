
 proc mean2 list {
    set sum 0
    foreach i $list {set sum [expr {$sum+$i*$i}]}
    expr {double($sum)/[llength $list]}
}


proc generateRandomBoard {nbC nbL} {

    set elemType [list s m i a e]
    set stat(s) [list 73.59 0	2.86	10.74	12.8]
    set stat(m) [list 31.32	27.59	3.74	15.8	21.55]
    set stat(i) [list 24.81 0	31.85	4.07	39.26]
    set stat(a) [list 49.44 0	2.04	36.67	11.85]
    set stat(e) [list 17.55	0	7.78	4.63	70.05]

    # set stat(s) [list 67.35	6.24	2.86	10.74	12.8]
    # set stat(m) [list 31.32	27.59	3.74	15.8	21.55]
    # set stat(i) [list 20	4.81	31.85	4.07	39.26]
    # set stat(a) [list 38.7	10.74	2.04	36.67	11.85]
    # set stat(e) [list 17.55	5.51	7.78	4.63	64.54]
    
    # Terre
    set nbZone 0
    set statAll($nbZone)        [list 80 0 0 15 5]
    set statAll([incr nbZone])  [list 80 0 0 15 5]
    # Intermediare
    set statAll([incr nbZone]) [list 45 0 10 10 45]
    # eau
    set statAll([incr nbZone]) [list 0	0 5 5 90]
    set statAll([incr nbZone]) [list 0	0 5 5 90]
    # Intermediare
    set statAll([incr nbZone]) [list 45 0 10 10 45]
    # Ile
    set statAll([incr nbZone]) [list 75 0 10 15 5]
    set statAll([incr nbZone]) [list 75 0 10 15 5]
    # Eau
    set statAll([incr nbZone]) [list 0	0 0 5 95]
    
    
    ## Terre
    # set nbZone 0
    # set statAll($nbZone)        [list 75 5 0 15 5]
    # set statAll([incr nbZone])  [list 75 5 0 15 5]
    ##Intermediare
    # set statAll([incr nbZone]) [list 40 5 10 10 45]
    ##eau
    # set statAll([incr nbZone]) [list 0	0 5 5 90]
    # set statAll([incr nbZone]) [list 0	0 5 5 90]
    ##Intermediare
    # set statAll([incr nbZone]) [list 40 5 10 10 45]
    ##Ile
    # set statAll([incr nbZone]) [list 70 10 10 10 5]
    # set statAll([incr nbZone]) [list 70 10 10 10 5]
    ##Eau
    # set statAll([incr nbZone]) [list 0	0 0 5 95]
    
    set stat(0) [list 74.14	12.07	0.00	10.34	3.45]
    set stat(1) [list 75.93	5.56	0.00	16.67	1.85]
    set stat(2) [list 66.00	9.00	0.00	23.00	2.00]
    set stat(3) [list 53.26	16.30	0.00	19.57	10.87]
    set stat(4) [list 42.86	3.57	2.38	9.52	41.67]
    set stat(5) [list 25.00	9.21	5.26	3.95	56.58]
    set stat(6) [list 22.06	4.41	16.18	4.41	52.94]
    set stat(7) [list 16.67	3.33	18.33	5.00	56.67]
    set stat(8) [list 17.31	7.69	21.15	7.69	46.15]
    #set stat(9) [list 22.73	9.09	13.64	9.09	45.45]
    set stat(9) [list 80	10	0.00	10	0]
    #set stat(10) [list 36.11	8.33	0.00	11.11	44.44]
    set stat(10) [list 80	10	0.00	10	0]
    #set stat(11) [list 40.00	13.33	0.00	13.33	33.33]
    set stat(11) [list 80.00	20	0.00	0	0]

    if {$nbC < $nbL} {
        set dimensionMin [expr $nbC / 2]
    } else {
        set dimensionMin [expr $nbL / 2]
    }
    
    
    # on initialise la surface 
    set surface [lrepeat $nbL [lrepeat $nbC u]]

    for {set i 0} {$i < $nbC} {incr i} {
        for {set j 0} {$j < $nbL} {incr j} {
        
            set rand [expr round(rand() * 10000)/100.0]
        
            # Si c'est le tour de la carte, on ne prend que la stats tour de carte
            if {$i == 0 || $j == 0 || $i == [expr $nbC - 1] || $j == [expr $nbL - 1]} {
                if {$rand < 74.14} {
                    set type "s"
                } elseif {$rand < 86.21} {
                    set type "m"
                } elseif {$rand < 96.55} {
                    set type "a"
                } else {
                    set type "e"
                }
            } else {
                # On recherche les cellules autour
                set listCell ""
                
                # La cellule du dessus
                lappend listCell [lindex $surface [expr $j - 1] $i]
                # La cellule du dessous
                lappend listCell [lindex $surface [expr $j + 1] $i]
                
                # Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
                if {[expr $i % 2] == 1} {
                    # La cellule à gauche en haut
                    lappend listCell [lindex $surface $j [expr $i - 1]]
                    # La cellule à gauche en bas
                    lappend listCell [lindex $surface [expr $j + 1] [expr $i - 1]]
                    # La cellule à droite en haut
                    lappend listCell [lindex $surface $j [expr $i + 1]]
                    # La cellule à droite en bas
                    lappend listCell [lindex $surface [expr $j + 1] [expr $i + 1]]
                } else {
                    # La cellule à gauche en bas
                    lappend listCell [lindex $surface $j [expr $i - 1]]
                    # La cellule à gauche en haut
                    lappend listCell [lindex $surface [expr $j - 1] [expr $i - 1]]
                    # La cellule à droite en bas
                    lappend listCell [lindex $surface $j [expr $i + 1]]
                    # La cellule à droite en haut
                    lappend listCell [lindex $surface [expr $j - 1] [expr $i + 1]]
                }
                
                # On compte et on applique les stats associés
                set proba(s) 0
                set proba(m) 0
                set proba(i) 0
                set proba(a) 0
                set proba(e) 0
                set nbHex 0

                foreach hex $listCell {
                    if {$hex != "u"} {
                        set proba(s) [expr $proba(s) + [lindex $stat($hex) 0]]
                        set proba(m) [expr $proba(m) + [lindex $stat($hex) 1]]
                        set proba(i) [expr $proba(i) + [lindex $stat($hex) 2]]
                        set proba(a) [expr $proba(a) + [lindex $stat($hex) 3]]
                        set proba(e) [expr $proba(e) + [lindex $stat($hex) 4]]
                        incr nbHex
                    }
                }
                # On divise les probabilité par le nombre d'hexagone
                set proba(s) [expr $proba(s) / $nbHex]
                set proba(m) [expr $proba(m) / $nbHex]
                set proba(i) [expr $proba(i) / $nbHex]
                set proba(a) [expr $proba(a) / $nbHex]
                set proba(e) [expr $proba(e) / $nbHex]
                
                # On ajout le coeficient pondérateur pour la répartition spaciale
                set distanceHaut    $i
                set distanceGauche  $j
                set distanceDroite  [expr $nbL - 1 - $j]
                set distanceBas     [expr $nbC - 1 - $i]
                set distance        [expr min($distanceHaut,$distanceGauche,$distanceDroite,$distanceBas)]
                # La distance pour les stat de all doit être entre 0 et 4
                set distanceAll     [expr round($nbZone * 1.0 * $distance / $dimensionMin)]
 
                set coef 2.0
 
                set proba(s) [expr ($proba(s) + $coef * [lindex $statAll($distanceAll) 0]) / ($coef + 1)]
                set proba(m) [expr ($proba(m) + $coef * [lindex $statAll($distanceAll) 1]) / ($coef + 1)]
                set proba(i) [expr ($proba(i) + $coef * [lindex $statAll($distanceAll) 2]) / ($coef + 1)]
                set proba(a) [expr ($proba(a) + $coef * [lindex $statAll($distanceAll) 3]) / ($coef + 1)]
                set proba(e) [expr ($proba(e) + $coef * [lindex $statAll($distanceAll) 4]) / ($coef + 1)]
                
                
                if {$rand < $proba(s)} {
                    set type "s"
                } elseif {$rand < [expr $proba(s) + $proba(m)]} {
                    set type "m"
                } elseif {$rand < [expr $proba(s) + $proba(m) + $proba(i)]} {
                    set type "i" 
                } elseif {$rand < [expr $proba(s) + $proba(m) + $proba(i) + $proba(a)]} {
                    set type "a"
                } else {
                    set type "e"
                }
            }
            
            # On applique le type choisit à la cellule
            set newList ""
            for {set k 0} {$k < $nbL} {incr k} {
                if {$k != $j} {
                    lappend newList [lindex $surface $k]
                } else {
                    lappend newList [lreplace [lindex $surface $k] $i $i $type]
                }
            }
            set surface $newList
        }
    }
    
    # On génére les montagne
    # Le principe :
    # On pose des graines de montagnes , puis on les faits grossir
    # Dans la carte de base , la taille des montagnes est la suivante :
    # Taille 1 : 9 : 36%
    # Taille 2 : 4 : 16% (52%)
    # Taille 3 : 5 : 20% (72%)
    # Taille 4 : 2 : 8%  (80%)
    # Taille 5 : 2 : 8%  (88%)
    # Taille 6 : 2 : 8%  (96%)
    # Taille 8 : 1 : 4%

    for {set i 0} {$i < $nbC} {incr i} {
        for {set j 0} {$j < $nbL} {incr j} {
        
            set rand [expr round(rand() * 10000)/100.0]
            
            # Dans la carte de base, il y a 25 graines pour 851 hexagones, soit 2.93% de probabilité par case
            if {$rand < 2.4} {
            
                # On est dans le cas ou on doit mettre une graine
                lappend listeMontagne [list $i $j]
                puts [list $i $j]
                # La taille d'expansion doit être entre 0 et 5 hexagones supplémentaires (Taille totale : 1 --> 6)
                set aleaExt [expr round(rand() * 10000)/100.0]
                if {$aleaExt <= 36.0} {
                    set extansion 0
                } elseif {$aleaExt <= 52.0} {
                    set extansion 1
                } elseif {$aleaExt <= 72.0} {
                    set extansion 2
                } elseif {$aleaExt <= 80.0} {
                    set extansion 3
                } elseif {$aleaExt <= 88.0} {
                    set extansion 4
                } elseif {$aleaExt <= 92.0} {
                    set extansion 5
                } elseif {$aleaExt <= 96.0} {
                    set extansion 6
                } else {
                    set extansion 7
                }
                
                
                set actualX $i
                set actualY $j
                
                for {set ext 0} {$ext < $extansion} {incr ext} {
                
                    # On se déplace a partir de l'emplacement actuel
                    set Xoffset [expr round(rand() * 3 - 1.5)]
                    set Yoffset [expr round(rand() * 3 - 1.5)]
                    
                    if {[expr $actualX + $Xoffset] < 0 || [expr $actualX + $Xoffset] > [expr $nbL - 1]} {
                        set Xoffset 0
                    }
                    if {[expr $actualY + $Yoffset] < 0 || [expr $actualY + $Yoffset] > [expr $nbC - 1]} {
                        set Yoffset 0
                    }
                    
                    set actualX [expr $actualX + $Xoffset]
                    set actualY [expr $actualY + $Yoffset]
                    lappend listeMontagne [list $actualX $actualY]
                    puts [list $actualX $actualY]
                    
                }
            }
        }
    }
    
    foreach montagne $listeMontagne {
        set colonne [lindex $montagne 0]
        set ligne [lindex $montagne 1]
        
        set newLine [lreplace [lindex $surface $ligne] $colonne $colonne "m"]
        
        set surface [lreplace $surface $ligne $ligne $newLine]
        
    }
    
    return $surface
}

proc surfaceToInt {surface} {
    return [string map {"e" 0 "i" 1 "a" 2 "s" 3 "m" 4} $surface]
}

proc intToSurface {surface} {
    return [string map {-1 "e" -2 "e" -3 "e" 0 "e" 1 "i" 2 "a" 3 "s" 4 "m"  5 "m"  6 "m" 7 "m" } $surface]
}

proc morpho {surfaceInt type} {

    set nbC [llength [lindex $surfaceInt 0]]
    set nbL [llength $surfaceInt]
    
    set technique 2
    
    set newlist $surfaceInt
    
    if {$type == "dilatation"} {
        set type "max"
    } else {
        set type "min"
    }
    
    for {set i 1} {$i < [expr $nbC - 1]} {incr i} {
        for {set j 1} {$j < [expr $nbL - 1]} {incr j} {
            
            set hexVal [lindex $surfaceInt $j $i]

            set oldLinenm1 [lindex $newlist [expr $j - 1]]
            set oldLine    [lindex $newlist $j]
            set oldLinenp1 [lindex $newlist [expr $j + 1]]
            
            if {$technique == 1} {
                # Pour chaque hexagone autour, on applique le max entre la valeur du pixel centrale et du pixel
                
                # La cellule du dessus
                set newlist [lreplace $newlist [expr $j - 1] $i [expr ${type}($hexVal,[lindex $surfaceInt [expr $j - 1] $i],[lindex $newlist [expr $j - 1] $i])]]
                # La cellule du dessous
                set newlist [lreplace $newlist [expr $j + 1] $i [expr ${type}($hexVal,[lindex $surfaceInt [expr $j + 1] $i],[lindex $newlist [expr $j + 1] $i])]]
                
                # Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
                if {[expr $i % 2] == 1} {
                    # La cellule à gauche en haut
                    set newlist [lreplace $newlist $j [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt $j [expr $i - 1]],[lindex $newlist $j [expr $i - 1]])]]
                    # La cellule à gauche en bas
                    set newlist [lreplace $newlist [expr $j + 1] [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt [expr $j + 1] [expr $i - 1]],[lindex $newlist [expr $j + 1] [expr $i - 1]])]]
                    # La cellule à droite en haut
                    set newlist [lreplace $newlist $j [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt $j [expr $i - 1]],[lindex $newlist $j [expr $i - 1]])]]
                    # La cellule à droite en bas
                    set newlist [lreplace $newlist [expr $j + 1] [expr $i + 1] [expr ${type}($hexVal,[lindex $surfaceInt [expr $j + 1] [expr $i + 1]],[lindex $newlist [expr $j + 1] [expr $i + 1]])]]
                } else {
                    # La cellule à gauche en haut
                    set newlist [lreplace $newlist $j [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt $j [expr $i - 1]],[lindex $newlist $j [expr $i - 1]])]]
                    # La cellule à gauche en bas
                    set newlist [lreplace $newlist [expr $j - 1] [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt [expr $j - 1] [expr $i - 1]],[lindex $newlist [expr $j - 1] [expr $i - 1]])]]
                    # La cellule à droite en haut
                    set newlist [lreplace $newlist $j [expr $i - 1] [expr ${type}($hexVal,[lindex $surfaceInt $j [expr $i - 1]],[lindex $newlist $j [expr $i - 1]])]]
                    # La cellule à droite en bas
                    set newlist [lreplace $newlist [expr $j - 1] [expr $i + 1] [expr ${type}($hexVal,[lindex $surfaceInt [expr $j - 1] [expr $i + 1]],[lindex $newlist [expr $j - 1] [expr $i + 1]])]]
                }
            } else {
            
                # Chaucne des celulles est le max des alentours
                set listCell ""
                
                # La cellule du dessus
                lappend listCell [lindex $surfaceInt [expr $j - 1] $i]
                
                # La cellule du dessous
                lappend listCell [lindex $surfaceInt [expr $j + 1] $i]
                
                # Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
                if {[expr $i % 2] == 1} {
                    # La cellule à gauche en haut
                    lappend listCell [lindex $surfaceInt $j [expr $i - 1]]
                    # La cellule à gauche en bas
                    lappend listCell [lindex $surfaceInt [expr $j + 1] [expr $i - 1]]
                    # La cellule à droite en haut
                    lappend listCell [lindex $surfaceInt $j [expr $i + 1]]
                    # La cellule à droite en bas
                    lappend listCell [lindex $surfaceInt [expr $j + 1] [expr $i + 1]]
                } else {
                    # La cellule à gauche en bas
                    lappend listCell [lindex $surfaceInt $j [expr $i - 1]]
                    # La cellule à gauche en haut
                    lappend listCell [lindex $surfaceInt [expr $j - 1] [expr $i - 1]]
                    # La cellule à droite en bas
                    lappend listCell [lindex $surfaceInt $j [expr $i + 1]]
                    # La cellule à droite en haut
                    lappend listCell [lindex $surfaceInt [expr $j - 1] [expr $i + 1]]
                }
                
                set coefDilatation 2
                set coefErrosion -1
                if {[expr [mean2 $listCell] / 6.0 + $coefDilatation ] > $hexVal && ${type} == "max"} {
                    incr hexVal
                } 
                if {[expr [mean2 $listCell] / 6.0 - $coefErrosion ] < $hexVal && ${type} == "min"} {
                    incr hexVal -1
                }                 

                set newLine [lreplace $oldLine $i $i $hexVal]
                set newlist [lreplace $newlist $j $j $newLine]
            
            }
            
            
        }
    }
    
    return $newlist 
}


# For test : foreach line [intToSurface [morpho [morpho [surfaceToInt [generateRandomBoard 37 23]] erosion] dilatation]] {puts $line}

