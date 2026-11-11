import { disciplines } from "../config/disciplines.js";
import { matchesSearch } from "./search.js";

let activeDisciplines = new Set();
let activeSearchTerm = "";

export function createFilters(onFilterChange) {

    const container = document.getElementById("filters");
    container.innerHTML = "";

    // ----------------------------------------
    // Suchfeld
    // ----------------------------------------

    const searchTitle = document.createElement("h3");
    searchTitle.textContent = "Suche";
    container.appendChild(searchTitle);

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.id = "node-search";
    searchInput.placeholder = "Titel, Personen, Themen ...";
    searchInput.setAttribute(
        "aria-label",
        "Forschungsinhalte durchsuchen"
    );

    searchInput.addEventListener("input", () => {
        activeSearchTerm = searchInput.value.trim();
        onFilterChange(getActiveFilters());
    });

    container.appendChild(searchInput);


    // ----------------------------------------
    // Disziplinen
    // ----------------------------------------

    const disciplineTitle = document.createElement("h3");
    disciplineTitle.textContent = "Disziplinen";
    container.appendChild(disciplineTitle);

    const disciplineContainer = document.createElement("div");
    disciplineContainer.classList.add("filter-group");

    for (const [id, discipline] of Object.entries(disciplines)) {

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = id;

        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {
                activeDisciplines.add(id);
            } else {
                activeDisciplines.delete(id);
            }

            onFilterChange(getActiveFilters());
        });

        label.appendChild(checkbox);
        label.appendChild(
            document.createTextNode(" " + discipline.name)
        );

        disciplineContainer.appendChild(label);
    }

    container.appendChild(disciplineContainer);
}

// Aktive Filter abrufen
function getActiveFilters() {
    return {
        disciplines: new Set(activeDisciplines),
        search: activeSearchTerm
    };
}

export function resetFilters() {

    activeDisciplines.clear();
    activeSearchTerm = "";

    // Disziplin-Checkboxen zurücksetzen
    const checkboxes = document.querySelectorAll(
        "#filters input[type='checkbox']"
    );

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Suchfeld zurücksetzen
    const searchInput = document.getElementById("node-search");

    if (searchInput) {
        searchInput.value = "";
    }
}

export function isNodeVisible(node, filters) {

    // Nur Entity-Nodes werden anhand der Filter geprüft
    if (node.type !== "entity") {
        return true;
    }

    // Disziplinfilter:
    // Keine Auswahl bedeutet, dass alle Disziplinen erlaubt sind.
    // Mehrere ausgewählte Disziplinen werden mit ODER verknüpft.
    const matchesDiscipline =
        filters.disciplines.size === 0 ||
        filters.disciplines.has(node.discipline);

    // Suchfilter:
    const matchesSearchTerm = matchesSearch(
        node,
        filters.search ?? ""
    );

    // Beide Filterbedingungen müssen erfüllt sein.
    return matchesDiscipline && matchesSearchTerm;
}

// Sichtbare Nodes und Links bestimmen
export function getVisibleElements(graph, filters) {

    // 1. Passende Entity-Nodes bestimmen
    const visibleEntities = graph.nodes.filter(node =>
        node.type === "entity" &&
        isNodeVisible(node, filters)
    );

    // 2. Zugehörige Disziplinen bestimmen
    const visibleDisciplineIds = new Set(
        visibleEntities.map(entity =>
            `discipline-${entity.discipline}`
        )
    );

    // Sonderfall: Wenn überhaupt keine Filter aktiv sind,
    // sollen alle Disziplin-Nodes sichtbar sein.
    const noFiltersActive =
        filters.disciplines.size === 0 &&
        !(filters.search ?? "").trim();

    const visibleDisciplines = graph.nodes.filter(node => {

        if (node.type !== "discipline") {
            return false;
        }

        return (
            noFiltersActive ||
            visibleDisciplineIds.has(node.id)
        );
    });


    // 3. Sichtbare Nodes zusammenführen
    const visibleNodes = [
        ...visibleDisciplines,
        ...visibleEntities
    ];

    const visibleNodeIds = new Set(
        visibleNodes.map(node => node.id)
    );


    // 4. Links zwischen sichtbaren Nodes bestimmen
    const visibleLinks = graph.links.filter(link => {

        const sourceId =
            typeof link.source === "object"
                ? link.source.id
                : link.source;

        const targetId =
            typeof link.target === "object"
                ? link.target.id
                : link.target;

        return (
            visibleNodeIds.has(sourceId) &&
            visibleNodeIds.has(targetId)
        );
    });


    // 5. Ergebnis zurückgeben
    return {
        nodes: visibleNodes,
        links: visibleLinks
    };
}