import * as d3 from "d3";

// ============================================================
// FILTER LAYOUT
// ============================================================
export function applyFilterLayout(
    simulation,
    nodes,
    visibleNodeIds,
    filterNodeIds,
    width,
    height
) {

    // Aktive Filter-Nodes
    const filterNodes =
        nodes.filter(node =>
            filterNodeIds.has(node.id)
        );

    // Sichtbare Entities
    const visibleEntities =
        nodes.filter(node =>
            node.type === "entity" &&
            visibleNodeIds.has(node.id)
        );

    // Mittelpunkt des Graphen
    const centerX = width / 2;
    const centerY = height / 2;

    // Filter-Nodes in kleinem Kreis
    // um den Mittelpunkt verteilen
    const filterRadius =
        calculateFilterRadius(
            filterNodes.length
        );

    filterNodes.forEach((node, index) => {

        if (filterNodes.length === 1) {
            node.targetX = centerX;
            node.targetY = centerY;
            return;
        }

        const angle =
            (
                index / filterNodes.length
            ) * Math.PI * 2;

        node.targetX =
            centerX +
            Math.cos(angle) *
            filterRadius;

        node.targetY =
            centerY +
            Math.sin(angle) *
            filterRadius;
    });

    // Entities auf äußerem Kreis
    const entityRadius =
        calculateFilterEntityRadius(
            visibleEntities.length,
            width,
            height
        );


    visibleEntities.forEach((node, index) => {

        if (visibleEntities.length === 1) {
            node.targetX = centerX;
            node.targetY =
                centerY + entityRadius;
            return;
        }


        const angle =
            (
                index /
                visibleEntities.length
            ) * Math.PI * 2;


        node.targetX =
            centerX +
            Math.cos(angle) *
            entityRadius;


        node.targetY =
            centerY +
            Math.sin(angle) *
            entityRadius;

    });

    // X-Force
    simulation.force(
        "layout-x",

        d3.forceX()
            .x(node => {
                if (
                    node.targetX !== undefined
                ) {
                    return node.targetX;
                }
                return width / 2;
            })
            .strength(node => {
                if (
                    visibleNodeIds.has(node.id)
                ) {
                    return 0.35;
                }
                return 0;
            })
    );

    // Y-Force
    simulation.force(
        "layout-y",

        d3.forceY()
            .y(node => {
                if (
                    node.targetY !== undefined
                ) {
                    return node.targetY;
                }
                return height / 2;
            })
            .strength(node => {
                if (
                    visibleNodeIds.has(node.id)
                ) {
                    return 0.35;
                }
                return 0;
            })
    );

    // Simulation neu starten
    simulation
        .alpha(1)
        .restart();
}

function calculateFilterRadius(count) {
    if (count <= 1) {return 0;}
    if (count <= 3) {return 45;}
    if (count <= 6) {return 70;}
    return 90;
}

function calculateFilterEntityRadius(
    count,
    width,
    height
) {

    const maxRadius =
        Math.min(width, height) * 0.30;
    if (count <= 1) {
        return 100;
    }
    if (count <= 5) {
        return Math.min(140, maxRadius);
    }
    if (count <= 10) {
        return Math.min(180, maxRadius);
    }
    if (count <= 20) {
        return Math.min(230, maxRadius);
    }

    return maxRadius;
}

// ============================================================
// DEFAULT LAYOUT
// ============================================================
export function applyDefaultLayout(
    simulation,
    nodes,
    width,
    height
) {
    // Discipline-Nodes
    const disciplines = nodes.filter(
        node => node.type === "discipline"
    );

    const positions =
        calculateDisciplinePositions(
            disciplines.length,
            width,
            height
        );

    // Discipline-ID -> Position
    const disciplinePositions =
        new Map();

    disciplines.forEach((discipline, index) => {

        disciplinePositions.set(
            discipline.id,
            positions[index]
        );
    });

    // Entities nach Discipline gruppieren
    const entitiesByDiscipline = new Map();

    nodes
        .filter(node => node.type === "entity")
        .forEach(entity => {

            const disciplineId =
                `discipline-${entity.discipline}`;

            if (!entitiesByDiscipline.has(disciplineId)) {
                entitiesByDiscipline.set(
                    disciplineId, []
                );
            }

            entitiesByDiscipline
                .get(disciplineId)
                .push(entity);
        });


    // Discipline Positionen setzen
    disciplines.forEach(discipline => {
        const position =
            disciplinePositions.get(
                discipline.id
            );

        if (!position) {
            return;
        }

        discipline.targetX = position.x;
        discipline.targetY = position.y;
    });

    // Entities um ihre Discipline verteilen
    for (
        const [disciplineId, entities]
        of entitiesByDiscipline
    ) {

        const center =
            disciplinePositions.get(
                disciplineId
            );

        if (!center) {
            continue;
        }

        const radius =
            calculateClusterRadius(
                entities.length,
                width,
                height
            );


        entities.forEach((entity, index) => {
            // Bei einer einzelnen Entity direkt
            // unter der Discipline positionieren.
            if (entities.length === 1) {
                entity.targetX = center.x;
                entity.targetY = center.y + 60;
                return;
            }

            const angle =
                (index / entities.length) 
                * Math.PI * 2;

            entity.targetX =
                center.x +
                Math.cos(angle) * radius;

            entity.targetY =
                center.y +
                Math.sin(angle) * radius;
        });
    }

    // X-Force
    simulation.force(
        "layout-x",

        d3.forceX()
            .x(node => {
                if (node.targetX !== undefined) {
                    return node.targetX;
                }
                return width / 2;
            })
            .strength(node => {

                if (node.type === "discipline") {
                    return 0.8;
                }

                if (node.type === "entity") {
                    return 0.25;
                }
                return 0;
            })
    );

    // Y-Force
    simulation.force(
        "layout-y",

        d3.forceY()
            .y(node => {
                if (node.targetY !== undefined) {
                    return node.targetY;
                }
                return height / 2;
            })
            .strength(node => {
                if (node.type === "discipline") {
                    return 0.8;
                }
                if (node.type === "entity") {
                    return 0.25;
                }
                return 0;
            })
    );

    simulation
        .alpha(1)
        .restart();
}

// ============================================================
// DISCIPLINE POSITIONEN
// ============================================================
function calculateDisciplinePositions(
    count,
    width,
    height
) {

    const positions = [];

    if (count === 0) {
        return positions;
    }

    // Möglichst quadratisches Raster
    const columns =
        Math.ceil(Math.sqrt(count));

    const rows =
        Math.ceil(count / columns);

    const horizontalSpacing =
        width / (columns + 1);

    const verticalSpacing =
        height / (rows + 1);

    for (let i = 0; i < count; i++) {
        const column =
            i % columns;

        const row =
            Math.floor(i / columns);

        positions.push({
            x:
                horizontalSpacing *
                (column + 1),
            y:
                verticalSpacing *
                (row + 1)
        });
    }

    return positions;

}

// ============================================================
// CLUSTER-RADIUS
// ============================================================

function calculateClusterRadius(
    entityCount,
    width,
    height
) {

    const maxRadius =
        Math.min(
            width,
            height
        ) * 0.16;


    if (entityCount <= 1) {
        return 0;
    }


    if (entityCount <= 3) {
        return Math.min(
            55,
            maxRadius
        );
    }


    if (entityCount <= 6) {
        return Math.min(
            75,
            maxRadius
        );
    }


    if (entityCount <= 12) {
        return Math.min(
            95,
            maxRadius
        );
    }


    return maxRadius;

}