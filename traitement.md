# Documentation du Traitement des Données - Chrono01

## Vue d'ensemble de la page d'émargement

**URL** : `https://emargement.zone01normandie.org/dashboard`

La page d'émargement Zone01 est une application web qui permet de suivre les heures de formation. Elle contient plusieurs sections importantes pour le traitement des données par l'extension Chrono01.

---

## Structure de la page

### 1. En-tête (Banner)

- **Titre** : "Bienvenue [Nom Prénom]"
- **Horloge en temps réel** : Affiche l'heure actuelle (format HH:MM:SS)
- **Liens** : Paramètres, Déconnexion

### 2. Section de contrôle

- **Sélection de période** : Permet de choisir le mois à consulter (ex: "Décembre 2025")
- **Boutons d'action** :
  - "Entrer" : Démarre une session d'émargement
  - "Sortir" : Termine la session en cours

### 3. Résumé hebdomadaire

- **Sélecteur de semaine** : Combobox pour choisir la semaine (ex: "Semaine du 15/12")
- **Tableau de résumé** :
  - Ligne "Total:" avec le total des heures de la semaine (format HH:MM:SS)
  - Ligne "Reste dû" avec les heures restantes pour atteindre 35h (format HH:MM:SS)
- **Indicateur visuel** : Graphique/ratio de progression

### 4. Résumé mensuel

- **Statistiques** : Nombre de jours travaillés (ex: "23j") et total d'heures (ex: "161h")
- **Tableau détaillé** :
  - Ligne "Total:" avec le total mensuel (format HH:MM:SS)
  - Ligne "Heures de formation" : Heures effectives de formation (format HH:MM:SS)
  - Ligne "Congés payés" : Heures de congés (format HH:MM:SS)
  - Ligne "Autre congés" : Autres types de congés (format HH:MM:SS)
  - Ligne "Reste dû" : Heures restantes pour atteindre l'objectif mensuel (format HH:MM:SS)
- **Indicateur visuel** : Graphique/ratio de progression avec répartition

### 5. Tableau des logs (Section principale)

**Sélecteur CSS** : `table tbody tr`

#### Structure du tableau

Le tableau contient un `<thead>` avec les en-têtes et un `<tbody>` avec les données.

**En-têtes** :

- Colonne 1 : "Date"
- Colonne 2 : "Heure d'entrée"
- Colonne 3 : "Heure de sortie"
- Colonne 4 : "Total"

#### Format des données dans les lignes (`<tr>`)

Chaque ligne (`<tr>`) contient 4 cellules (`<td>`) :

1. **Date** : Format français complet

   - Exemples :
     - "mardi 16 décembre 2025"
     - "vendredi 12 décembre 2025"
     - "jeudi 11 décembre 2025"
   - Format : `[jour de la semaine] [jour] [mois] [année]`

2. **Heure d'entrée** : Format HH:MM:SS

   - Exemples : "16:28:00", "20:42:52", "12:54:18"
   - Format : `\d{1,2}:\d{2}:\d{2}`

3. **Heure de sortie** : Format HH:MM:SS ou "-"

   - Si session terminée : Format HH:MM:SS (ex: "21:20:42", "19:35:02")
   - Si session en cours : "-" (indique que la session n'est pas terminée)

4. **Total (Durée)** : Format HH:MM:SS ou "-"
   - Si session terminée : Durée calculée (ex: "00:37:50", "06:40:44")
   - Si session en cours : "-" (pas de durée car session non terminée)

#### Exemples de lignes

**Session en cours** :

```
mardi 16 décembre 2025 | 16:28:00 | - | -
```

**Sessions terminées** :

```
vendredi 12 décembre 2025 | 20:42:52 | 21:20:42 | 00:37:50
vendredi 12 décembre 2025 | 20:41:07 | 20:42:47 | 00:01:40
jeudi 11 décembre 2025 | 12:54:18 | 19:35:02 | 06:40:44
mercredi 10 décembre 2025 | 17:28:28 | 18:01:01 | 00:32:33
```

### 6. Pagination

- Navigation entre les pages de résultats
- Indication : "Page X sur Y"
- Boutons "Précédent" et "Suivant"

### 7. Calendrier des absences

- Affichage mensuel avec les jours de congés
- Légende : Congés payés, Arrêt Maladie, Autre
- Résumé des absences par type

---

## Traitement des données par l'extension

### 1. Détection du tableau

**Fichier** : `src/script/main.ts`

L'extension attend que le tableau soit chargé dans le DOM :

- Sélecteur utilisé : `document.querySelectorAll("tbody tr")`
- Boucle de détection : Vérifie toutes les 500ms pendant 60 tentatives maximum (30 secondes)
- Logs console :
  - `📦 Script d'émargement lancé`
  - `⏳ Attente du tableau... (X/60)`
  - `✅ Tableau détecté après attente`

### 2. Parsing des données

**Fichier** : `src/script/utils/parser.ts`

#### 2.1. Extraction de la date (`findDateCellIndex`)

L'extension recherche une cellule contenant un nom de mois en français :

- Mois recherchés : janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre
- Format attendu : `[jour de la semaine] [jour] [mois] [année]`
- Exemple : "mardi 16 décembre 2025"

**Fonction** : `parseFrenchDate(dateText: string)`

- Parse le texte de date français
- Convertit en objet `Date` JavaScript
- Retourne `null` si le format est invalide

#### 2.2. Extraction des heures (`extractTimeInfo`)

L'extension extrait les informations temporelles depuis les cellules :

- **Stratégie 1** : Si l'index de la date + 3 < nombre de cellules
  - `startText` = cellule à l'index `dateCellIndex + 1`
  - `endText` = cellule à l'index `dateCellIndex + 2`
  - `durationText` = cellule à l'index `dateCellIndex + 3`
- **Stratégie 2** : Parcours séquentiel
  - Recherche la première cellule avec format `HH:MM:SS`
  - Prend les 2 cellules précédentes comme heure d'entrée et sortie

#### 2.3. Détection de session en cours (`getStartTimeFromRow`)

- Recherche les cellules avec format `\d{1,2}:\d{2}:\d{2}` (heure d'entrée)
- Si la cellule suivante contient "-", c'est une session en cours
- Calcule l'heure de début en combinant la date du jour avec l'heure trouvée
- Retourne un objet `Date` représentant le début de la session

#### 2.4. Extraction du total du résumé (`extractTotalFromSummary`)

L'extension cherche dans toutes les lignes du tableau une ligne avec :

- 3 cellules (`cells.length === 3`)
- Cellule 1 contenant "Heures de formation"
- Cellule 2 contenant ":" (format de durée)
- Parse la durée et retourne le total en heures décimales

**Exemple de ligne recherchée** :

```
[cellule vide] | "Heures de formation" | "69:52:45"
```

### 3. Calcul des statistiques

**Fichier** : `src/script/utils/calculator.ts`

#### 3.1. Calcul de la semaine courante

```typescript
const now = new Date();
const currentMonday = new Date(now);
currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
currentMonday.setHours(0, 0, 0, 0);
```

- Calcule le lundi de la semaine courante
- Utilise la formule : `(jour actuel + 6) % 7` pour obtenir le décalage vers le lundi

#### 3.2. Filtrage des lignes de la semaine

Pour chaque ligne du tableau :

1. Parse la date française
2. Calcule la différence en jours avec le lundi de la semaine
3. Si `daysDiff >= 0 && daysDiff < 7` : la ligne appartient à la semaine courante

#### 3.3. Traitement des sessions

**Sessions terminées** :

- Parse la durée (format `HH:MM:SS`) avec `parseDuration`
- Convertit en heures décimales : `h + m/60 + s/3600`
- Ajoute aux totaux hebdomadaires et journaliers

**Sessions en cours** :

- Détecte quand `endText === "-"`
- Calcule le temps écoulé depuis le début : `(now.getTime() - startTime.getTime()) / 3600000`
- Ajoute ce temps aux totaux en temps réel

#### 3.4. Calcul des totaux

**Total hebdomadaire** :

```typescript
const weeklyTotal = weeklyHours.reduce((a, b) => a + b, 0);
```

**Total avec session en cours** :

```typescript
let totalLogged: number;
if (totalFromSummary !== null && totalFromSummary > weeklyTotal) {
  totalLogged = totalFromSummary + sessionHours;
} else {
  totalLogged = weeklyTotal + sessionHours;
}
```

- Utilise le total du résumé si disponible et supérieur au total calculé
- Sinon, utilise la somme manuelle des durées
- Ajoute toujours les heures de la session en cours

**Total du jour** :

```typescript
const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
```

- Somme toutes les durées des sessions du jour
- Ajoute les heures de la session en cours si elle est aujourd'hui

**Heures restantes** :

```typescript
const remaining = 35 - totalLogged;
```

- Objectif fixe : 35 heures par semaine
- Retourne la différence (peut être négative si dépassement)

### 4. Formatage des durées

**Fichier** : `src/script/utils/time.ts`

#### 4.1. Parsing (`parseDuration`)

Convertit une durée au format `HH:MM:SS` en heures décimales :

```typescript
const [h, m, s] = text.split(":").map(Number);
return h + m / 60 + s / 3600;
```

Exemples :

- `"06:40:44"` → `6.6789` heures
- `"00:37:50"` → `0.6306` heures

#### 4.2. Formatage (`formatFullTime`)

Convertit des heures décimales en format lisible :

```typescript
const hours = Math.floor(decimalHours);
const totalMinutes = decimalHours * 60;
const minutes = Math.floor(totalMinutes % 60);
const seconds = Math.floor((totalMinutes * 60) % 60);
return `${hours}h ${minutes}min ${seconds}s`;
```

Exemples :

- `6.6789` → `"6h 40min 44s"`
- `0.6306` → `"0h 37min 50s"`

### 5. Mise à jour du widget

**Fichier** : `src/script/widget/updater.ts`

Le widget affiche 3 slides :

1. **Heures de la semaine** :

   - Affiche `formatFullTime(stats.totalLogged)`
   - Label : "Heures de la semaine"

2. **Heures du jour** :

   - Affiche `formatFullTime(stats.totalToday)`
   - Label : "Heures du jour"

3. **Heures restantes** :
   - Affiche `formatFullTime(Math.max(0, stats.remaining))`
   - Label : "Heures restantes"
   - Utilise `Math.max(0, ...)` pour éviter les valeurs négatives

**Mise à jour** : Toutes les secondes (1000ms) via `setInterval` dans `manager.ts`

---

## Exemple de traitement complet

### Données d'entrée (HTML)

```html
<tbody>
  <tr>
    <td>mardi 16 décembre 2025</td>
    <td>16:28:00</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>vendredi 12 décembre 2025</td>
    <td>20:42:52</td>
    <td>21:20:42</td>
    <td>00:37:50</td>
  </tr>
  <tr>
    <td>jeudi 11 décembre 2025</td>
    <td>12:54:18</td>
    <td>19:35:02</td>
    <td>06:40:44</td>
  </tr>
</tbody>
```

### Traitement

1. **Parsing des dates** :

   - "mardi 16 décembre 2025" → `Date(2025, 11, 16)` (décembre = mois 11)
   - "vendredi 12 décembre 2025" → `Date(2025, 11, 12)`
   - "jeudi 11 décembre 2025" → `Date(2025, 11, 11)`

2. **Détection de la semaine** :

   - Si aujourd'hui est mardi 16 décembre 2025
   - Lundi de la semaine = 15 décembre 2025
   - Toutes les lignes sont dans la semaine courante

3. **Calcul des durées** :

   - Session en cours : `(now - 16:28:00) / 3600000` heures
   - "00:37:50" → `0.6306` heures
   - "06:40:44" → `6.6789` heures

4. **Totaux** :

   - `weeklyTotal` = 0.6306 + 6.6789 = 7.3095 heures
   - `sessionHours` = temps écoulé depuis 16:28:00
   - `totalLogged` = 7.3095 + sessionHours
   - `remaining` = 35 - totalLogged

5. **Affichage** :
   - Slide 1 : "7h 18min 34s" (exemple) - "Heures de la semaine"
   - Slide 2 : "Xh Xmin Xs" - "Heures du jour"
   - Slide 3 : "27h 41min 26s" (exemple) - "Heures restantes"

---

## Points importants

### Cas particuliers

1. **Session en cours** :

   - Heure de sortie = "-"
   - Durée = "-"
   - L'extension calcule le temps en temps réel

2. **Lignes invalides** :

   - Moins de 3 cellules → ignorées
   - Date introuvable → ignorées
   - Format de date invalide → ignorées
   - Durée invalide → ignorées

3. **Total du résumé** :

   - Si disponible et supérieur au total calculé, il est utilisé
   - Permet de prendre en compte des données non visibles dans le tableau

4. **Semaine** :
   - Semaine = du lundi au dimanche
   - Les lignes hors semaine sont ignorées

### Logs de debug

L'extension génère des logs détaillés (une seule fois par chargement) :

- Nombre total de lignes
- Lignes traitées vs ignorées
- Tableau des heures hebdomadaires
- Totaux calculés
- Raisons d'ignorer certaines lignes

Ces logs sont accessibles dans la console du navigateur (F12).

---

## Structure des fichiers de traitement

```
src/script/
├── main.ts              # Point d'entrée, détection du tableau
├── utils/
│   ├── parser.ts        # Extraction des données du DOM
│   ├── calculator.ts    # Calcul des statistiques
│   └── time.ts          # Formatage et parsing des durées
└── widget/
    ├── manager.ts       # Gestion du widget et mise à jour
    ├── updater.ts       # Mise à jour du contenu
    └── widget.ts        # Création de l'interface
```

---

## Notes techniques

- **Sélecteur principal** : `tbody tr` (toutes les lignes du tableau)
- **Format de date** : Français complet avec nom du jour
- **Format d'heure** : `HH:MM:SS` (24h)
- **Objectif hebdomadaire** : 35 heures (fixe dans le code)
- **Fréquence de mise à jour** : 1 seconde (1000ms)
- **Détection du tableau** : Polling toutes les 500ms, max 60 tentatives
