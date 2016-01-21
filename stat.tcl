
proc stats {surface} {

    # Définition
    set listeType [list s m i a e]
    set nom(s) "Sol"
    set nom(m) "Montagne"
    set nom(i) "Ilot"
    set nom(a) "Marécage"
    set nom(e) "Eau"

    # Taille
    set nbColonne [llength [lindex $surface 0]]
    set nbLigne [llength $surface]
    puts "Nb colonne : $nbColonne"
    puts "Nb ligne : $nbLigne"

    # Calcul du nombre 
    set s 0
    set m 0
    set i 0
    set a 0
    set e 0
    set u 0
    set o 0

    foreach line $surface {
        foreach hex $line {
            switch $hex {
                "s" {incr s}
                "m" {incr m}
                "i" {incr i}
                "a" {incr a}
                "e" {incr e}
                "u" {incr u}
                default {
                    puts "$hex non rec" 
                    incr o
                }
            }
        }
    }
    set nbHexagone [expr $s + $m + $i + $a + $e]
    puts "Nb hexagone : $nbHexagone"
    puts "Nb hexagone non utilise : [expr $u]"
    puts "Nb hexagone non reconnu : [expr $o]"
    puts ""

    puts "Type de terrain | Nombre | Pourcentage"
    puts "------------- | -----------"
    puts "Montagne | $m | [format "%.2f" [expr 100.0 * $m / $nbHexagone]]%"
    puts "Sol | $s | [format "%.2f" [expr 100.0 * $s / $nbHexagone]]%"
    puts "Eau | $e | [format "%.2f" [expr 100.0 * $e / $nbHexagone]]%"	
    puts "Ilot | $i | [format "%.2f" [expr 100.0 * $i / $nbHexagone]]%"
    puts "Marécage | $a | [format "%.2f" [expr 100.0 * $a / $nbHexagone]]%"
    puts ""

    # Calcul des stats par tour de ligne
    if {$nbColonne < $nbLigne} {
        set dimensionMin [expr $nbColonne / 2]
    } else {
        set dimensionMin [expr $nbLigne / 2]
    }

    # On initialise la liste qui contiendra les résultats
    set sliste ""
    set mliste ""
    set iliste ""
    set aliste ""
    set eliste ""
    set nbHexliste ""

    set elemList ""

    for {set index 0} {$index <= $dimensionMin} {incr index} {

        # On initialise les conteurs pour cette largeur
        set s 0
        set m 0
        set i 0
        set a 0
        set e 0
        set nbHex 0
        
        for {set ic 0} {$ic < $nbColonne} {incr ic} {
            for {set j 0} {$j < $nbLigne} {incr j} {
                # Si la distance est égale à l'index
                if {($ic == $index || $j == $index || [expr $nbColonne - 1 - $ic] == $index || [expr $nbLigne - 1 - $j] == $index) && [lsearch $elemList "$ic-$j"] == -1} {
                    incr nbHex
                    switch [lindex $surface $j $ic] {
                        "s" {incr s}
                        "m" {incr m}
                        "i" {incr i}
                        "a" {incr a}
                        "e" {incr e}
                    }
                    
                    lappend elemList "$ic-$j"
                }
            }
        }
        
        lappend sliste $s
        lappend mliste $m
        lappend iliste $i
        lappend aliste $a
        lappend eliste $e
        lappend nbHexliste $nbHex
    }


    puts "Distance bord de carte | Nombre total | Sol | Sol % | Montagne | Montagne % | Ilot | Ilot % | Marécage | Marécage % | Eau | Eau % "
    puts "--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- "
    for {set index 0} {$index <= $dimensionMin} {incr index} {

        puts -nonewline "$index | [lindex $nbHexliste $index] | "
        puts -nonewline "[lindex $sliste $index] | [format "%.2f" [expr 100.0 * [lindex $sliste $index] / [lindex $nbHexliste $index]]]% | "
        puts -nonewline "[lindex $mliste $index] | [format "%.2f" [expr 100.0 * [lindex $mliste $index] / [lindex $nbHexliste $index]]]% | "
        puts -nonewline "[lindex $iliste $index] | [format "%.2f" [expr 100.0 * [lindex $iliste $index] / [lindex $nbHexliste $index]]]% | "
        puts -nonewline "[lindex $aliste $index] | [format "%.2f" [expr 100.0 * [lindex $aliste $index] / [lindex $nbHexliste $index]]]% | "
        puts            "[lindex $eliste $index] | [format "%.2f" [expr 100.0 * [lindex $eliste $index] / [lindex $nbHexliste $index]]]% "
        
    }
    puts ""

    # Calcul de la proximité géographique avec les autres éléments

    # Initialisation
    foreach elem $listeType {
        foreach elem2 $listeType {
            set array${elem}($elem2) 0
        }
    }


    for {set ic 1} {$ic < [expr $nbColonne - 1]} {incr ic} {
        for {set j 1} {$j < [expr $nbLigne - 1]} {incr j} {
        
            # Le type de la cellule
            set type [lindex $surface $j $ic]
        
            # La cellule du dessus
            incr array${type}([lindex $surface [expr $j - 1] $ic])
            # La cellule du dessous
            incr array${type}([lindex $surface [expr $j + 1] $ic])
            
            # Les cellules situés à gauche et à droite, deux cas en fonction de la parité de la colonne
            if {[expr $ic % 2] == 1} {
                # La cellule à gauche en haut
                incr array${type}([lindex $surface $j [expr $ic - 1]])
                # La cellule à gauche en bas
                incr array${type}([lindex $surface [expr $j + 1] [expr $ic - 1]])
                # La cellule à droite en haut
                incr array${type}([lindex $surface $j [expr $ic + 1]])
                # La cellule à droite en bas
                incr array${type}([lindex $surface [expr $j + 1] [expr $ic + 1]])
            } else {
                # La cellule à gauche en bas
                incr array${type}([lindex $surface $j [expr $ic - 1]])
                # La cellule à gauche en haut
                incr array${type}([lindex $surface [expr $j - 1] [expr $ic - 1]])
                # La cellule à droite en bas
                incr array${type}([lindex $surface $j [expr $ic + 1]])
                # La cellule à droite en haut
                incr array${type}([lindex $surface [expr $j - 1] [expr $ic + 1]])
            }
        }
    }

    puts "Type de surface | Sol | Sol % | Montagne | Montagne % | Ilot | Ilot % | Marécage | Marécage % | Eau | Eau % "
    puts "--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- "
    foreach elem $listeType {
        catch {
        set nbTot [expr [set array${elem}(s)] + [set array${elem}(m)] + [set array${elem}(i)] +[set array${elem}(a)] +[set array${elem}(e)]]
        puts "$nom($elem) | [set array${elem}(s)] | [format "%.2f" [expr 100.0 * [set array${elem}(s)] / $nbTot]] | [set array${elem}(m)] | [format "%.2f" [expr 100.0 * [set array${elem}(m)] / $nbTot]] | [set array${elem}(i)] | [format "%.2f" [expr 100.0 * [set array${elem}(i)] / $nbTot]] | [set array${elem}(a)] | [format "%.2f" [expr 100.0 * [set array${elem}(a)] / $nbTot]] | [set array${elem}(e)] | [format "%.2f" [expr 100.0 * [set array${elem}(e)] / $nbTot]] "
        }
    }

}


