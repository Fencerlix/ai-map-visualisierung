import { disciplines } from "../config/disciplines.js";

// Vereinheitlicht Schreibweisen für die Suche
function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("de")
        .trim();
}


// Erstellt einen durchsuchbaren Text aus einer Entität
function getSearchableText(entity) {

    const values = [
        entity.title,
        entity.name,
        entity.description,
        entity.location,
        entity.people,
        entity.emails,
        entity.keywords,
        entity.links?.map(link => [
            link.title,
            link.url
        ]),
        disciplines[entity.discipline]?.name
    ];

    return normalizeText(
        values.flat(Infinity)
            .filter(Boolean)
            .join(" ")
    );
}


// Prüft, ob eine Entität zur Suche passt
export function matchesSearch(entity, searchTerm) {

    const query = normalizeText(searchTerm);

    // Keine Suche: alle Entitäten passen
    if (!query) {
        return true;
    }

    const searchWords = query.split(/\s+/);

    const searchableText = getSearchableText(entity);

    // Alle eingegebenen Wörter müssen vorkommen
    return searchWords.every(word =>
        searchableText.includes(word)
    );
}