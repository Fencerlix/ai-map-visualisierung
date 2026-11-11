import * as d3 from "d3";

import { createSimulation } from "./simulation.js";
import { createRenderer } from "./renderer.js";

import { enableZoom } from "../interaction/zoom.js";
import { enableDrag } from "../interaction/drag.js";
import { enableHover } from "../interaction/hover.js";
import { enablePanel } from "../interaction/panel.js";

import {
    applyDefaultLayout,
    applyFilterLayout
} from "./filterLayout.js";

import { nodeStyles } from "../config/nodeStyles.js";

export function createGraph(graph) {

    const graphElement = document.getElementById("graph");

    // Dynamische Breite und Höhe
    const width = graphElement.clientWidth;
    const height = graphElement.clientHeight;

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const container = svg.append("g");

    // Zoom aktivieren
    enableZoom(svg, container);

    const {
        node,
        nodeBackgrounds,
        link,
        labels,
        disciplineIcons
    } = createRenderer(container, graph);

    // Simulation erstellen
    const simulation = createSimulation(
        graph.nodes,
        graph.links,
        width,
        height
    );

    // Interaktionen
    enableDrag(node, simulation);

    enableHover(
        node,
        link,
        labels,
        graph,
        nodeBackgrounds,
        disciplineIcons
    );

    enablePanel(node, graph);

    // Simulation aktualisieren
    simulation.on("tick", () => {

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // Hintergrundlogos positionieren
        nodeBackgrounds
            .attr("x", d => d.x - (nodeStyles[d.type]?.radius ?? 10))
            .attr("y", d => d.y - (nodeStyles[d.type]?.radius ?? 10));

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        disciplineIcons
            .attr(
                "x",
                d => d.x - nodeStyles.discipline.iconSize / 2
            )
            .attr(
                "y",
                d => d.y - nodeStyles.discipline.iconSize / 2
            );
    });

    // Default Layout initialisieren
    applyDefaultLayout(
        simulation,
        graph.nodes,
        width,
        height
    );

    return {
        node,
        nodeBackgrounds,
        link,
        labels,
        disciplineIcons,
        simulation,
        width,
        height,

        // Merkt sich die zuletzt angewendete Disziplin-Auswahl.
        // Das verhindert Layout-Neuberechnungen bei jeder Texteingabe.
        disciplineFilterKey: JSON.stringify([])
    };
}


// ========================================
// Graph aktualisieren
// ========================================

export function updateGraph(
    graphElements,
    visibleGraph,
    filters,
    graph
) {

    // IDs aller sichtbaren Knoten
    const visibleNodeIds = new Set(
        visibleGraph.nodes.map(node => node.id)
    );

    // ========================================
    // Aktive Disziplinfilter ermitteln
    // ========================================

    const selectedDisciplineIds = [
        ...(filters.disciplines ?? [])
    ].sort();

    const filterNodeIds = new Set(
        selectedDisciplineIds.map(id => `discipline-${id}`)
    );

    // Prüfen, ob sich die Disziplin-Auswahl verändert hat
    const disciplineFilterKey = JSON.stringify(
        selectedDisciplineIds
    );

    const disciplineFiltersChanged =
        disciplineFilterKey !== graphElements.disciplineFilterKey;


    // ========================================
    // Layout aktualisieren
    // ========================================

    // Nur bei einer Änderung der Disziplin-Auswahl
    // wird das Layout neu berechnet.

    if (disciplineFiltersChanged) {

        if (selectedDisciplineIds.length > 0) {

            // Disziplinfilter aktiv:
            // Ausgewählte Disziplinen und zugehörige Entities
            // neu anordnen.

            graphElements.simulation
                .force("link")
                .distance(150);

            applyFilterLayout(
                graphElements.simulation,
                graph.nodes,
                visibleNodeIds,
                filterNodeIds,
                graphElements.width,
                graphElements.height
            );

        } else {

            // Keine Disziplinfilter aktiv:
            // Standardlayout wiederherstellen.

            graphElements.simulation
                .force("link")
                .distance(60);

            applyDefaultLayout(
                graphElements.simulation,
                graph.nodes,
                graphElements.width,
                graphElements.height
            );
        }

        // Aktuellen Zustand speichern
        graphElements.disciplineFilterKey = disciplineFilterKey;

        // Simulation nur bei Layoutänderungen neu starten
        graphElements.simulation
            .alpha(0.1)
            .restart();
    }


    // ========================================
    // Knoten ein- und ausblenden
    // ========================================
    graphElements.node
        .style("display", d =>
            visibleNodeIds.has(d.id) ? null : "none"
        );

    graphElements.nodeBackgrounds
        .style("display", d =>
            visibleNodeIds.has(d.id) ? null : "none"
        );

    graphElements.disciplineIcons
        .style("display", d =>
            visibleNodeIds.has(d.id) ? null : "none"
        );

    graphElements.labels
        .style("display", d =>
            visibleNodeIds.has(d.id) ? null : "none"
        );

    graphElements.link
        .style("display", d => {

            const sourceId =
                typeof d.source === "object"
                    ? d.source.id
                    : d.source;

            const targetId =
                typeof d.target === "object"
                    ? d.target.id
                    : d.target;

            return (
                visibleNodeIds.has(sourceId) &&
                visibleNodeIds.has(targetId)
            ) ? null : "none";
        });
}