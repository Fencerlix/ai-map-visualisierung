import { disciplines } from "../config/disciplines.js";

function createEntityId(index) {
    return `entity-${String(index + 1).padStart(3, "0")}`;
}

export function buildGraph(data) {

    const nodes = [];
    const links = [];

    // Entities
    data.entities.forEach((entity, index) => {

        const entityNode = {
            ...entity,
            id: createEntityId(index),
            type: "entity"
        };
        nodes.push(entityNode);

        // Entity -> Discipline
        if (entity.discipline) {
            links.push({
                source: entityNode.id,
                target:
                    `discipline-${entity.discipline}`
            });
        }
    });


    // Discipline Nodes
    for (
        const [id, discipline]
        of Object.entries(disciplines)
    ) {
        nodes.push({
            id: `discipline-${id}`,
            type: "discipline",
            name: discipline.name,
            icon: discipline.icon
        });
    }

    return {
        nodes,
        links
    };

}