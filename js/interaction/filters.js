import { disciplines } from "../config/disciplines.js";

let activeDisciplines = new Set();

export function createFilters(onFilterChange) {

    const container =
        document.getElementById("filters");
    container.innerHTML = "";

    // ----------------------------------------
    // Disziplinen
    // ----------------------------------------

    const disciplineTitle =
        document.createElement("h3");
    disciplineTitle.textContent =
        "Disziplinen";
    container.appendChild(disciplineTitle);
    const disciplineContainer =
        document.createElement("div");
    disciplineContainer.classList.add("filter-group");

    for (const [id, discipline] of Object.entries(disciplines)) {
        const label =
            document.createElement("label");
        const checkbox =
            document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = id;
        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {
                activeDisciplines.add(id);
            } else {
                activeDisciplines.delete(id);
            }
            onFilterChange(
                getActiveFilters()
            );
        });
        label.appendChild(checkbox);
        label.appendChild(
            document.createTextNode(
                " " + discipline.name
            )
        );
        disciplineContainer.appendChild(label);
    }
    container.appendChild(disciplineContainer);

}

function getActiveFilters() {
    return {
        disciplines:
            new Set(activeDisciplines)
    };
}

export function resetFilters() {
    activeDisciplines.clear();
    const checkboxes =
        document.querySelectorAll(
            "#filters input[type='checkbox']"
        );

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}



export function getVisibleElements(graph, filters) {
    // 2. Keine Filter → kompletter Graph
    if (
        filters.disciplines.size === 0
    ) {

        const defaultNodes =
            graph.nodes.filter(node =>
                node.type === "entity" ||
                node.type === "discipline"
            );

        const defaultNodeIds =
            new Set(
                defaultNodes.map(node => node.id)
            );

        const defaultLinks =
            graph.links.filter(link => {

                const sourceId =
                    typeof link.source === "object"
                        ? link.source.id
                        : link.source;

                const targetId =
                    typeof link.target === "object"
                        ? link.target.id
                        : link.target;

                return (
                    defaultNodeIds.has(sourceId) &&
                    defaultNodeIds.has(targetId)
                );

            });

        return {
            nodes: defaultNodes,
            links: defaultLinks
        };
    }


    // 3. Sichtbare Entity IDs bestimmen
    const visibleEntityIds = new Set();
    graph.nodes
    .filter(node => node.type === "entity")
    .forEach(entity => {
        if (isNodeVisible(entity, filters)) {
            visibleEntityIds.add(entity.id);
        }
    });

    // 4. Sichtbare Nodes
    const visibleNodeIds =
        new Set(visibleEntityIds);

    // Ausgewählte Discipline Nodes
    graph.nodes
        .filter(node => node.type === "discipline")
        .forEach(node => {
            const disciplineId =
                node.id.replace(
                    "discipline-",
                    ""
                );
            // Wenn Disziplinen gefiltert werden,
            // nur ausgewählte anzeigen.
            if (
                filters.disciplines.size > 0 &&
                filters.disciplines.has(disciplineId)
            ) {
                visibleNodeIds.add(node.id);
            }
        });

    // 5. Sichtbare Nodes aus Graph bestimmen
    const visibleNodes =
        graph.nodes.filter(node =>
            visibleNodeIds.has(node.id)
        );

    // 6. Sichtbare Links bestimmen
    const visibleLinks =
        graph.links.filter(link => {

            const sourceId =
                typeof link.source === "object"
                    ? link.source.id
                    : link.source;

            const targetId =
                typeof link.target === "object"
                    ? link.target.id
                    : link.target;

            return (
                visibleNodeIds.has(sourceId) &&
                visibleNodeIds.has(targetId)
            );
        });

    // 7. Ergebnis
    return {
        nodes: visibleNodes,
        links: visibleLinks
    };

}

export function isNodeVisible(node, filters) {
    if (
        filters.disciplines.size === 0
    ) {
        return true;
    }
    
    return filters.disciplines.has(
        node.discipline
    );
}