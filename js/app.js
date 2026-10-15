import { loadGraph } from "./data/loader.js";
import { buildGraph } from "./data/graphBuilder.js";
import { createGraph, updateGraph } from "./graph/createGraph.js";
import { createFilters, resetFilters, getVisibleElements } from "./interaction/filters.js";

const data = await loadGraph();
const graph = buildGraph(data);

// ========================================
// Graph
// ========================================

const graphElements = createGraph(graph);

// ========================================
// Filter
// ========================================

createFilters(filters => {

    const visibleGraph =
        getVisibleElements(
            graph,
            filters
        );


    updateGraph(
        graphElements,
        visibleGraph,
        filters,
        graph
    );

});

// ========================================
// Initialer Zustand
// ========================================

const initialFilters = {
    disciplines: new Set(),
    categories: new Set()
};


const initialVisibleGraph =
    getVisibleElements(
        graph,
        initialFilters
    );


updateGraph(
    graphElements,
    initialVisibleGraph,
    initialFilters,
    graph
);


// ========================================
// Reset
// ========================================

const resetButton =
    document.getElementById("reset-filters");

resetButton.addEventListener("click", () => {

    resetFilters();


    const resetFiltersState = {
        disciplines: new Set(),
        categories: new Set()
    };


    const visibleGraph =
        getVisibleElements(
            graph,
            resetFiltersState
        );


    updateGraph(
        graphElements,
        visibleGraph,
        resetFiltersState,
        graph
    );

});