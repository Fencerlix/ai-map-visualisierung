
/*
export function enableHover(node, link, graph) {

    node
        .on("mouseenter", (event, hoveredNode) => {
            node.attr("opacity", currentNode => {
                return isConnected(hoveredNode, currentNode, graph)
                    ? 1     // full opacity for nodes connected to hovered node
                    : 0.2;  // low opacity for nodes not connected to hovered node
            });

            link.attr("opacity", currentLink => {
                return (
                    currentLink.source.id === hoveredNode.id ||
                    currentLink.target.id === hoveredNode.id
                )
                    ? 1     // full opacity for links connected to hovered node
                    : 0.1;  // low opacity for links not connected to hovered node
            });
        })

        // reset opacities when hover ends
        .on("mouseleave", () => {
            node.attr("opacity", 1);
            link.attr("opacity", 1);
        });
}*/

export function enableHover(
    node,
    link,
    labels,
    graph,
    nodeBackgrounds,
    disciplineIcons
) {
    node
        .on("mouseenter", (event, hoveredNode) => {
            // Labels zurücksetzen
            labels.style("opacity", 0);

            // Aktives Label anzeigen
            labels
                .filter(labelNode =>
                    labelNode.id === hoveredNode.id
                )
                .style("opacity", 1);

            // Nodes hervorheben
            node.attr("opacity", currentNode => {
                return isConnected(
                    hoveredNode,
                    currentNode,
                    graph
                )
                    ? 1
                    : 0.2;
            });

            nodeBackgrounds.style("opacity", currentNode =>
                currentNode.id === hoveredNode.id ? 1 : 0.1
            );

            disciplineIcons.style("opacity", currentNode =>
                currentNode.id === hoveredNode.id ? 1 : 0.1
            );

            // Links hervorheben
            link.attr("opacity", currentLink => {
                return (
                    currentLink.source.id === hoveredNode.id ||
                    currentLink.target.id === hoveredNode.id
                )
                    ? 1
                    : 0.1;
            });
        })


        .on("mouseleave", () => {
            // Alle Labels wieder verstecken
            labels.style("opacity", 0);
            // Nodes zurücksetzen
            node.attr("opacity", 1);
            // Links zurücksetzen
            link.attr("opacity", 1);
            // Hintergründe zurücksetzen
            nodeBackgrounds.style("opacity", 1);
            // Icons zurücksetzen
            disciplineIcons.style("opacity", 1);    
        });

}

// boolean connection checker
function isConnected(a, b, graph) {

    if (a.id === b.id) {
        return true;
    }

    return graph.links.some(link =>
        (link.source.id === a.id &&
            link.target.id === b.id)
        ||
        (link.target.id === a.id &&
            link.source.id === b.id)
    );

}