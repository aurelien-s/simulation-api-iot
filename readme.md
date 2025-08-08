# WebAPI pour simuler des lectures de capteur IOT

## Quick Start
```
npm i
npm start
```

### Customisation du port de la WebAPI
Par defaut, le serveur utilise sur le port 3000. \
Pour le modifier, il est faut utiliser l'agrument `--port=` ou `-p=`
```
# Commande Node
node src/server.js --port=5555

# Commande Npm
npm start -- --port=5555 
```

## Endpoints

### GET //localhost:3000/api/sensors/current
Permet d'obtenir la valeur des derniers capteurs.

### GET //localhost:3000/api/sensors/history
Permet d'obtenir l'évolution des données. \
Parametre query de la route 
```
sensor: Nom du capteur (Obligatoire)
start : Date de debut au format ISO
end :   Date de fin au format ISO
```
Exemple : 
```
sensor=humidity&start=2025-01-01T20:15:00.000Z&end=2025-01-01T20:30:00.00Z
```

### ws://localhost:3000/api/sensors/realtime
Web Socket pour obtenir les données en temps réel