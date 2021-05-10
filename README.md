# WODSS Gruppe 02 Frontend

Frontend für den Workshop in der Vertiefung "Distributed Software Systems" (WODSS).

---

## Setup
``` ZSH/CMD
cd corona-navigator
npm install
npm start
```

## Swagger Client für Backend
Da das [Backend](https://github.com/JanickHuerzeler/wodss-02-gr-backend) mit Swagger dokumentiert ist, kann der dazugehörige Client einfach generiert werden.

Mit folgendem Befehl werden die Model-Klassen und API-Aufrufe bei gestartetem Backend (localhost) automatisch generiert:

```CMD/ZSH
cd corona-navigator
npm run openapigen 
```

## Common Pitfalls

Apple's neuer M1 ARM-Prozessor wird von einigen hier verwendeten Komponenten noch nicht vollständig unterstützt (z.B. Node nur v16+, node-sass noch gar nicht, etc.). Dies kann zu einem speziellen Verhalten beim Installieren oder Builden führen.

Mit der folgenden Konfiguration konnte die Applikation schlussendlich auf einem Apple Macbook Pro M1 erfolgreich gestartet werden:

- Node: v14.16.1
- Terminal: Terminal mit Rosetta 2 (siehe [dev.to post](https://dev.to/courier/tips-and-tricks-to-setup-your-apple-m1-for-development-547g))
- Angepasster `npm start` Befehl:
```ZSH
env FAST_REFRESH=false npm start
```

## Continuous Integration
- Gemacht mit "GitHub Actions"
