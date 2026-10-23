import { nodeStyles } from "../config/nodeStyles.js";
import { labelStyles } from "../config/labelStyles.js";

export function createRenderer(container, graph){

    const link = container
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 2);

    const node = container
        .append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .join("circle")
        .attr("r", d =>
            nodeStyles[d.type]?.radius ?? 10
        )
        .attr("fill", d => {
            if (d.type === "category") {
                return "orange";}
            if (d.type === "discipline") {
                return "steelblue";}   
            return "transparent";
        });

    // Rotierende Logo-Hintergründe für alle Nodes
    const nodeBackgrounds = container
        .append("g")
        .attr("class", "node-backgrounds")
        .selectAll("image")
        .data(graph.nodes.filter(d => d.type === "entity"))
        .join("image")
        .attr("class", "node-background")
        .attr("href", "/assets/CDSC_logo.svg")
        .attr("width", d =>
            (nodeStyles[d.type]?.radius ?? 10) * 2
        )
        .attr("height", d =>
            (nodeStyles[d.type]?.radius ?? 10) * 2
        )
        .attr("x", d =>
            (d.x ?? 0) -
            (nodeStyles[d.type]?.radius ?? 20)
        )
        .attr("y", d =>
            (d.y ?? 0) -
            (nodeStyles[d.type]?.radius ?? 20)
        )
        .style("pointer-events", "none");

    const labels = container
        .append("g")
        .selectAll("text")
        .data(graph.nodes)
        .join("text")
        .text(d => d.title || d.name || d.id)
        .attr("font-size", d =>
            labelStyles[d.type]?.fontSize ?? "11px")
        .attr("font-weight", d =>
            labelStyles[d.type]?.fontWeight ?? "400")
        .attr("text-anchor", d =>
            labelStyles[d.type]?.textAnchor ?? "start"
        )
        .attr("dx", d =>
            labelStyles[d.type]?.dx ?? 0)
        .attr("dy", d =>
            labelStyles[d.type]?.dy ?? 0)
        .style("pointer-events", "none")
        .style("opacity", 0);

    const disciplineIcons = container
        .append("g")
        .selectAll("image")
        .data(
            graph.nodes.filter(
                d => d.type === "discipline"
            )
        )
        .join("image")
        .attr("width", nodeStyles.discipline.iconSize)
        .attr("height", nodeStyles.discipline.iconSize)
        .attr("href", d =>
            `/assets/icons/${d.icon}.svg`
        )
        .attr("x", d => d.x - nodeStyles.discipline.iconSize / 2)
        .attr("y", d => d.y - nodeStyles.discipline.iconSize / 2)
        .style("pointer-events", "none");


    return {
        node,
        nodeBackgrounds,
        link,
        labels,
        disciplineIcons
    };
}