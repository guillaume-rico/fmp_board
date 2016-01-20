# Full Métal Planet : Générateur de carte

## Procédure :

1. Ouvrir le fichier excel board.xls

2. Remplir les cellules avec les caractères suivants :
    * Pour les montagnes : m 
    * Pour le sol normal : s 
    * Pour l'eau : e 
    * Pour les ilots : i
    * Pour les marécages : a 
    * Pour les zones non utilisées : u
    * Pas besoin d'écrire un caractère pour les zones situées à droite ou en bas de la carte

3. Copier coller la colonne "A" de votre feuille excel dans le script generation.tcl (remplacer les lignes contenant les anciennes valeures)

4. Installer tcl/tk si ce n'est pas déjà fait (Distribution disponible là : http://www.activestate.com/activetcl/downloads )

5. Exécuter le script : tclsh generation.tcl  (se mettre dans le bon dossier avant de lancer la commande ...)

6. Un fichier boardmap.svg est créé dans le dossier d'installation. Ce fichier est lisible avec tout un tas de logiciel dont Google Chrome, Inkscape ...

    