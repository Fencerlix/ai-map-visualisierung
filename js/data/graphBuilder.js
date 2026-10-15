import { disciplines } from "../config/disciplines.js";
import { categories } from "../config/categories.js";

function createEntityId(index) {
    return `entity-${String(index + 1).padStart(3, "0")}`;
}

/*
export function buildGraph(data) {

    const nodes = [];
    const links = [];

    // --------------------------------------------------
    // 1. Entity Nodes übernehmen
    // --------------------------------------------------

    for (const entity of data.nodes) {
        nodes.push({
            ...entity
        });
    }

    // --------------------------------------------------
    // 2. Discipline Nodes erzeugen
    // --------------------------------------------------

    for (const [id, discipline] of Object.entries(disciplines)) {
        nodes.push({
            id: `discipline-${id}`,
            type: "discipline",
            name: discipline.name,
            icon: discipline.icon
        });
    }

    // --------------------------------------------------
    // 3. Category Nodes erzeugen
    // --------------------------------------------------

    for (const [id, category] of Object.entries(categories)) {
        nodes.push({
            id: `category-${id}`,
            type: "category",
            name: category.name
        });
    }

    // --------------------------------------------------
    // 4. Entity → Discipline Links
    // --------------------------------------------------

    for (const entity of data.nodes) {
        if (!entity.discipline) {
            continue;
        }
        links.push({
            source: entity.id,
            target: `discipline-${entity.discipline}`
        });
    }

    // --------------------------------------------------
    // 5. Entity → Category Links
    // --------------------------------------------------

    for (const entity of data.nodes) {
        if (!entity.categories) {
            continue;
        }
        for (const category of entity.categories) {
            if (!category) {
                continue;
            }
            links.push({
                source: entity.id,
                target: `category-${category}`
            });
        }
    }

    return {
        nodes,
        links
    };

}*/

export function buildGraph(data) {

    const nodes = [];
    const links = [];


    // ========================================
    // Entities
    // ========================================

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

        // Entity -> Categories
        if (Array.isArray(entity.categories)) {
            entity.categories
                .filter(category => category)
                .forEach(category => {
                    links.push({
                        source: entityNode.id,
                        target:
                            `category-${category}`
                    });
                });
        }
    });


    // ========================================
    // Discipline Nodes
    // ========================================

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

    // ========================================
    // Category Nodes
    // ========================================

    for (
        const [id, category]
        of Object.entries(categories)
    ) {
        nodes.push({
            id: `category-${id}`,
            type: "category",
            name: category.name
        });
    }


    return {
        nodes,
        links
    };

}