/*
export function boundaryForce(width, height, margin = 40) {
    let nodes;
    function force() {
        for (const node of nodes) {
            if (node.x < margin) {node.x = margin;}
            if (node.x > width - margin) {node.x = width - margin;}
            if (node.y < margin) {node.y = margin;}
            if (node.y > height - margin) {node.y = height - margin;}
        }
    }
    force.initialize = (_nodes) => {
        nodes = _nodes;
    };
    return force;
}*/

export function boundaryForce(
    width,
    height,
    margin = 20
) {

    let nodes = [];
    function force() {
        for (const node of nodes) {
            const radius =
                node.type === "discipline"
                    ? 35
                    : node.type === "category"
                        ? 25
                        : 10;
            const minX =
                margin + radius;
            const maxX =
                width - margin - radius;
            const minY =
                margin + radius;
            const maxY =
                height - margin - radius;
            if (node.x < minX) {
                node.x = minX;
            }
            if (node.x > maxX) {
                node.x = maxX;
            }
            if (node.y < minY) {
                node.y = minY;
            }
            if (node.y > maxY) {
                node.y = maxY;
            }
        }
    }
    force.initialize = _nodes => {
        nodes = _nodes;
    };
    return force;
}