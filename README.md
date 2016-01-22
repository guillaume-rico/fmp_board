# Full Métal Planet : Générateur de carte

## Intoduction

Ce projet est un script qui permet de générer une carte pour le jeu full métal planet à partir d'un tableau Excel.

Exemple :

Carte 23 x 23 :

![Image exemple](https://github.com/guillaume-rico/fmp_board/blob/master/example/23_23_1_miniature.png)

Carte d'origine :

![Image exemple](https://github.com/guillaume-rico/fmp_board/blob/master/example/map_origine_miniature.png)

## Procédure :

### Pré requis

1. Installer tcl/tk  (Distribution disponible là : http://www.activestate.com/activetcl/downloads )

2. Installer Inkscape

3. Télécharger le projet dans un dossier

### Génération aléatoire

1. Exécuter le script : tclsh generation.tcl -rand -nbrow 23 -nbcol 37
(se mettre dans le bon dossier avant de lancer la commande ...)

2. Un fichier boardmap.svg est créé dans le dossier d'installation. Ce fichier est lisible avec tout un tas de logiciel dont Google Chrome, Inkscape ...

3. Ouvrir avec Inkscape le fichier .svg

4. Fichier --> Exporter une image PNG . Cliquer ensuite sur "Exporter"

5.Pour une impression : ouvrir l'image avec paint , dans "Mise en page",  sélectionner l'option "100% de la taille normale", puis imprimer les différentes pages


### Génération a partir d'excel

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

4. Exécuter le script : tclsh generation.tcl  (se mettre dans le bon dossier avant de lancer la commande ...)

6. Un fichier boardmap.svg est créé dans le dossier d'installation. Ce fichier est lisible avec tout un tas de logiciel dont Google Chrome, Inkscape ...

7. Ouvrir avec Inkscape le fichier .svg

8. Fichier --> Exporter une image PNG . Cliquer ensuite sur "Exporter"

9. Pour une impression : ouvrir l'image avec paint , dans "Mise en page",  sélectionner l'option "100% de la taille normale", puis imprimer les différentes pages


## Quelques statistiques

Dans la carte de base, il y a :

Type de terrain | Nombre | Pourcentage
------------- | -----------
Montagne | 72 | 8.46%
Sol | 401 | 47.12%
Eau | 231 | 27.14%
Ilot | 45 | 5.29%
Marécage | 102 | 11.99%

Les statistiques suivantes donnent le nombre d'élément en fonctionnement de l'éloignement du bord de la carte :

Distance bord de carte | Nombre total | Sol | Sol % | Montagne | Montagne % | Ilot | Ilot % | Marécage | Marécage % | Eau | Eau %
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
0 | 116 | 86 | 74.14% | 14 | 12.07% | 0 | 0.00% | 12 | 10.34% | 4 | 3.45%
1 | 108 | 82 | 75.93% | 6 | 5.56% | 0 | 0.00% | 18 | 16.67% | 2 | 1.85%
2 | 100 | 66 | 66.00% | 9 | 9.00% | 0 | 0.00% | 23 | 23.00% | 2 | 2.00%
3 | 92 | 49 | 53.26% | 15 | 16.30% | 0 | 0.00% | 18 | 19.57% | 10 | 10.87%
4 | 84 | 36 | 42.86% | 3 | 3.57% | 2 | 2.38% | 8 | 9.52% | 35 | 41.67%
5 | 76 | 19 | 25.00% | 7 | 9.21% | 4 | 5.26% | 3 | 3.95% | 43 | 56.58%
6 | 68 | 15 | 22.06% | 3 | 4.41% | 11 | 16.18% | 3 | 4.41% | 36 | 52.94%
7 | 60 | 10 | 16.67% | 2 | 3.33% | 11 | 18.33% | 3 | 5.00% | 34 | 56.67%
8 | 52 | 9 | 17.31% | 4 | 7.69% | 11 | 21.15% | 4 | 7.69% | 24 | 46.15%
9 | 44 | 10 | 22.73% | 4 | 9.09% | 6 | 13.64% | 4 | 9.09% | 20 | 45.45%
10 | 36 | 13 | 36.11% | 3 | 8.33% | 0 | 0.00% | 4 | 11.11% | 16 | 44.44%
11 | 15 | 6 | 40.00% | 2 | 13.33% | 0 | 0.00% | 2 | 13.33% | 5 | 33.33%

SAns tenir compte de la rangée d'héxagone du bord de la carte, on peut extraire des statistiques sur quels sont les probabilité d'avoir chaque type de terrain en fonction du type du terrain de l'héxagone :

Type de surface | Sol | Sol % | Montagne | Montagne % | Ilot | Ilot % | Marécage | Marécage % | Eau | Eau %
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
Sol | 1273 | 67.35 | 118 | 6.24 | 54 | 2.86 | 203 | 10.74 | 242 | 12.80
Montagne | 109 | 31.32 | 96 | 27.59 | 13 | 3.74 | 55 | 15.80 | 75 | 21.55
Ilot | 54 | 20.00 | 13 | 4.81 | 86 | 31.85 | 11 | 4.07 | 106 | 39.26
Marécage | 209 | 38.70 | 58 | 10.74 | 11 | 2.04 | 198 | 36.67 | 64 | 11.85
Eau | 239 | 17.55 | 75 | 5.51 | 106 | 7.78 | 63 | 4.63 | 879 | 64.54


## Liens

### Règles

http://eric.alber.free.fr/xmedia/fmp/regle.pdf

### Plateau modulaire

La carte des extensions est disponible à l'adresse suivante : http://eric.alber.free.fr/xmedia/fmp/plateau_modulaire.pdf

Dans cette extension, il y a 3 plateaux en double (dans le PDF précédent, les plateaux 1 (identique au 9), 4 (identique au 8), 14 (identique au 16))



    