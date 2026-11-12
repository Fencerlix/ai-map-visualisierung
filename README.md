# AI Research Map

Interaktive Netzwerkkarte zur Erkundung von KI-bezogener Forschung im universitären Umfeld. Die Visualisierung stellt Forschungseinheiten und ihre Beziehungen zu Disziplinen bzw. Fachbereichen der Universität Münster als Graph dar.

> **Projektstatus:** In Entwicklung. Funktionen, Datenstruktur und Darstellung können sich noch ändern.

## Funktionen

- **Interaktive Netzwerkvisualisierung:** Forschungsentitäten, Disziplinen und Kategorien werden als verbundene Knoten dargestellt.
- **Filter:** Inhalte lassen sich nach Disziplinen und Suchtermen eingrenzen.
- **Detailansicht:** Beim Auswählen einer Entität können ergänzende Informationen wie Beschreibung, beteiligte Personen, E-Mail-Adressen und weiterführende Links angezeigt werden.
- **Datengetrieben:** Forschungsinformationen werden aus einer JSON-Datei geladen und vom Programm in den Graphen überführt.

## Technologie

- JavaScript (ES Modules)
- [D3.js](https://d3js.org/) für die Graph- und Force-Simulation
- [Vite](https://vite.dev/) als Entwicklungsserver und Build-Werkzeug
- HTML und CSS
- JSON zur Beschreibung der Forschungsentitäten

## Voraussetzungen

- [Node.js](https://nodejs.org/) mit npm
- Git, wenn du das Projekt klonen oder Änderungen versionieren möchtest

## Lokal starten

1. Repository klonen oder das Projekt herunterladen:

   ```bash
   git clone https://github.com/Fencerlix/ai-map-visualisierung.git
   cd ai-map-visualisierung
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

4. Die im Terminal angezeigte lokale Adresse im Browser öffnen. Vite zeigt normalerweise eine Adresse wie `http://localhost:5173/` an.

## Produktionsversion erstellen

Mit folgendem Befehl wird eine optimierte Version erstellt:

```bash
npm run build
```

Die erzeugten Dateien liegen üblicherweise im Verzeichnis `dist/`. Um den Build lokal zu testen, kann – sofern im Projekt eingerichtet – folgender Befehl verwendet werden:

```bash
npm run preview
```

## Forschungsdaten bearbeiten

Die Forschungsinformationen werden im JSON-Format im Verzeichnis `data/` gepflegt. Die genaue Dateibezeichnung und der erwartete JSON-Aufbau müssen mit dem Datenlader und `graphBuilder.js` übereinstimmen.

Eine Entität kann beispielsweise so beschrieben werden:

```json
{
  "title": "Beispielprojekt",
  "discipline": "computer-science",
  "keywords": ["developing-ai"],
  "people": ["Vorname Nachname"],
  "location": "",
  "description": "Kurze Beschreibung des Projekts oder der Forschung.",
  "emails": ["kontakt@example.org"],
  "links": [
    {
      "url": "https://example.org",
      "title": "Projektwebsite"
    }
  ]
}
```

Wichtige Hinweise zur Datenpflege:

- `title` ist der angezeigte Name der Entität.
- `discipline` muss auf eine vorhandene Disziplin in `js/config/disciplines.js` verweisen.
- `keywords` enthält eine Liste vorhandener Keywords bzw. Tags, nach denen ein Benutzer suchen kann.
- `people` und `emails` sind Listen; wenn mehrere Einträge vorhanden sind, werden sie als solche gepflegt.
- `links` ist eine Liste von Objekten mit einer `url` und einem lesbaren `title`.
- Disziplinen müssen in den Konfigurationsdateien definiert sein, bevor sie in den Daten verwendet werden.
- Bei einer Änderung des Datenformats müssen auch `js/data/loader.js` und `js/data/graphBuilder.js` angepasst werden.

Die Graph-Implementierung erzeugt die für die Visualisierung benötigten Knoten-IDs und Verbindungen. Deshalb sollten `id`- oder `type`-Felder in den Rohdaten nur ergänzt werden, wenn die aktuelle Implementierung diese ausdrücklich erwartet.

## Projektstruktur

```text
ai-map-visualisierung/
├── assets/
│   └── icons/            # Icons für Disziplinen
├── data/                 # Forschungsdaten im JSON-Format
├── js/
│   ├── config/           # Konfiguration von Disziplinen und Stilen
│   ├── data/             # Laden und Aufbereiten der Daten
│   ├── graph/            # Darstellung und Simulation des Graphen
│   └── interaction/      # Filter, Hover-Verhalten und Detailansicht
├── index.html            # Einstiegspunkt der Webanwendung
├── style.css             # Gestaltung
├── package.json          # Abhängigkeiten und npm-Skripte
└── README.md
```

## Mitarbeit und Datenqualität

Vor dem Veröffentlichen neuer Daten sollten Schreibweisen der Disziplinen, Keywords und Links überprüft werden.
