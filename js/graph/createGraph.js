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

export function createGraph(graph){

    const graphElement = document.getElementById("graph");

    // dynamic width and height
    const width = graphElement.clientWidth;
    const height = graphElement.clientHeight;

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    const container = svg.append("g");

    // zoom enabler before simulation
    enableZoom(svg, container);

    const {
        node,
        nodeBackgrounds,
        link,
        labels,
        disciplineIcons
    } = createRenderer(container, graph);

    const simulation = createSimulation(
        graph.nodes,
        graph.links,
        width,
        height
    );

    // interactions
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

    // updating simulation
    simulation.on("tick",()=>{
        link
            .attr("x1",d=>d.source.x)
            .attr("y1",d=>d.source.y)
            .attr("x2",d=>d.target.x)
            .attr("y2",d=>d.target.y);
        node
            .attr("cx",d=>d.x)
            .attr("cy",d=>d.y);
        nodeBackgrounds
            .attr("x", d =>
                d.x - nodeStyles[d.type]?.radius)
            .attr("y", d =>
                d.y - nodeStyles[d.type]?.radius);
        labels
            .attr("x",d=>d.x)
            .attr("y",d=>d.y);
        disciplineIcons
            .attr("x", d => d.x - nodeStyles.discipline.iconSize / 2)
            .attr("y", d => d.y - nodeStyles.discipline.iconSize / 2);
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
        height
    };
}

export function updateGraph(graphElements, visibleGraph, filters, graph) {

    const visibleNodeIds =
        new Set(
            visibleGraph.nodes.map(node => node.id)
        );

    const filterNodeIds = new Set();

    filters.disciplines.forEach(id => {
        filterNodeIds.add(
            `discipline-${id}`
        );
    });
    filters.categories.forEach(id => {
        filterNodeIds.add(
            `category-${id}`
        );
    });
    if (filterNodeIds.size === 0) {
        graphElements.simulation
            .force("link")
            .distance(60);
        applyDefaultLayout(
            graphElements.simulation,
            graph.nodes,
            graphElements.width,
            graphElements.height
        );
    } else {
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
    }

    // Nodes ein-/ausblenden
    graphElements.node
        .style("display", d => {
            return visibleNodeIds.has(d.id)
                ? null
                : "none";
        });

    graphElements.disciplineIcons
        .style("display", d => {
            return visibleNodeIds.has(d.id)
                ? null
                : "none";
        });

    // Labels ein-/ausblenden
    graphElements.labels
    .style("display", d => {

        return visibleNodeIds.has(d.id)
            ? null
            : "none";

    });

    // Links ein-/ausblenden
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
            )
                ? null
                : "none";
        });

    
    // Simulation
    graphElements.simulation
        .alpha(0.1)
        .restart();
}
