# Chrono01 ˎˊ˗

Chrono01 est une extension de navigateur qui vous permet de suivre votre progression hebdomadaire sur la plateforme d'émargement de Zone01. Elle affiche directement dans votre navigateur un widget avec vos heures de la semaine, du jour, et le temps restant pour atteindre vos 35 heures hebdomadaires.

## À propos

Ce projet est un fork du travail original d'Erudit Aoué.

## Installation

### Prérequis

- Node.js installé sur votre machine
- Un navigateur basé sur Chromium (Chrome, Brave, Edge, etc.)

### Étapes d'installation

1. Clonez ou téléchargez ce repository sur votre ordinateur

2. Ouvrez un terminal dans le dossier du projet et installez les dépendances :

   ```bash
   npm install
   ```

3. Compilez le projet TypeScript :

   ```bash
   npm run build
   ```

4. Ouvrez votre navigateur et allez sur la page des extensions :

   - Chrome/Edge : `chrome://extensions/`
   - Brave : `brave://extensions/`

5. Activez le mode développeur (bouton en haut à droite)

6. Cliquez sur "Charger l'extension non empaquetée" ou "Load unpacked"

7. Sélectionnez le dossier du projet (celui qui contient le fichier `manifest.json`)

L'extension devrait maintenant être active. Elle se déclenchera automatiquement lorsque vous visiterez la page d'émargement de Zone01.

## Utilisation

Une fois installée, l'extension fonctionne automatiquement. Quand vous visitez votre tableau de bord d'émargement sur Zone01, un widget apparaît en bas à droite de l'écran avec :

- Vos heures de la semaine
- Vos heures du jour
- Le temps restant pour atteindre 35 heures

Le widget se met à jour en temps réel et prend en compte les sessions en cours.

## Développement

Si vous souhaitez modifier le code, les fichiers sources sont dans le dossier `src/`. Après chaque modification, vous devez recompiler avec `npm run build` et recharger l'extension dans votre navigateur.

## Licence

Ce projet est distribué sous la licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer comme bon vous semble. Voir le fichier LICENSE pour plus de détails.

## Aperçu

![Aperçu de l'extension](src/assets/apercu.png)
