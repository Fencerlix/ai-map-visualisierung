
import { loadGraph } from "./data/loader.js";
import { buildGraph } from "./data/graphBuilder.js";
import { createGraph, updateGraph } from "./graph/createGraph.js";
import {
    createFilters,
    resetFilters,
    getVisibleElements
} from "./interaction/filters.js";

// ========================================
// Daten laden und Graph aufbauen
// ========================================

const data = await loadGraph();
const graph = buildGraph(data);

// ========================================
// Graph erstellen
// ========================================

const graphElements = createGraph(graph);

// ========================================
// Filter anwenden
// ========================================

function applyFilters(filters) {

    const visibleGraph = getVisibleElements(
        graph,
        filters
    );

    // Temporäre Debug-Ausgabe:
    console.log("Aktive Filter:", filters);
    console.log("Sichtbare Knoten:", visibleGraph.nodes.length);
    console.log("Sichtbare Verbindungen:", visibleGraph.links.length);

    updateGraph(
        graphElements,
        visibleGraph,
        filters,
        graph
    );
}

// ========================================
// Filter initialisieren
// ========================================

createFilters(applyFilters);

// ========================================
// Initialer Zustand
// ========================================

const initialFilters = {
    disciplines: new Set(),
    search: ""
};

applyFilters(initialFilters);

// ========================================
// Reset
// ========================================

const resetButton = document.getElementById("reset-filters");

resetButton?.addEventListener("click", () => {

    // Eingabefelder und internen Filterzustand zurücksetzen
    resetFilters();

    // Filterzustand der Grafik zurücksetzen
    const emptyFilters = {
        disciplines: new Set(),
        search: ""
    };

    applyFilters(emptyFilters);

});
