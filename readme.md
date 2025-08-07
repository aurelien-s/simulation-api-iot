# WebAPI pour simuler des lectures de capteur IOT

## Quick Start
```
npm i
npm start
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