import * as d3 from "d3";

export function enablePanel(node, graph) {
    node.on("click",(event,d)=>{
        showNode(d, graph);
    });
}

function showNode(node, graph) {
    if (node.type === "entity") {
        showEntity(node);
    } else if (
        node.type === "discipline" ||
        node.type === "category"
    ) {
        showGroup(node, graph);
    }
}

function showEntity(node) {

    const panel = document.getElementById("info-panel");

    // Vorherigen Inhalt entfernen
    panel.innerHTML = "";

    // ----------------------------------------
    // Titel
    // ----------------------------------------

    const title = document.createElement("h2");
    title.textContent = node.title || node.name || node.id;
    panel.appendChild(title);

    // ----------------------------------------
    // Location
    // ----------------------------------------

    if (node.location) {
        const location = document.createElement("p");
        location.innerHTML =
            "<strong>Location:</strong> "
            + node.location;
        panel.appendChild(location);
    }

    // ----------------------------------------
    // Personen
    // ----------------------------------------

    if (node.people) {
        const people = document.createElement("p");
        people.innerHTML =
            "<strong>Personen:</strong> "
            + node.people;
        panel.appendChild(people);
    }

    // ----------------------------------------
    // Beschreibung
    // ----------------------------------------

    if (node.description) {
        const description = document.createElement("p");
        description.textContent = node.description;
        panel.appendChild(description);
    }

    // ----------------------------------------
    // E-Mails
    // ----------------------------------------

    if (node.emails && node.emails.length > 0) {
        const emailSection = document.createElement("div");
        const emailTitle = document.createElement("strong");
        emailTitle.textContent = "E-Mails:";
        emailSection.appendChild(emailTitle);
        const emailList = document.createElement("ul");
        node.emails.forEach(email => {
            if (!email) {
                return;
            }
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = `mailto:${email}`;
            link.textContent = email;
            listItem.appendChild(link);
            emailList.appendChild(listItem);
        });
        emailSection.appendChild(emailList);
        panel.appendChild(emailSection);
    }

    // ----------------------------------------
    // Links
    // ----------------------------------------

    if (node.links && node.links.length > 0) {
        const linksSection = document.createElement("div");
        const linksTitle = document.createElement("strong");
        linksTitle.textContent = "Links:";
        linksSection.appendChild(linksTitle);
        const linksList = document.createElement("ul");
        node.links.forEach(linkData => {
            if (!linkData.url) {
                return;
            }
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = linkData.url;
            link.textContent =
                linkData.title || linkData.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            listItem.appendChild(link);
            linksList.appendChild(listItem);
        });
        linksSection.appendChild(linksList);
        panel.appendChild(linksSection);
    }
}

function showGroup(node, graph) {

    const panel =
        document.getElementById("info-panel");
    panel.innerHTML = "";

    // ----------------------------------------
    // Titel
    // ----------------------------------------

    const title =
        document.createElement("h2");
    title.textContent = node.name;
    panel.appendChild(title);

    // ----------------------------------------
    // Typ
    // ----------------------------------------

    const type =
        document.createElement("p");
    type.textContent =
        node.type === "discipline"
            ? "Discipline"
            : "Category";
    panel.appendChild(type);


    // ----------------------------------------
    // Verbundene Entities finden
    // ----------------------------------------

    const entityIds = new Set();

    graph.links.forEach(link => {
        let sourceId;
        let targetId;

        // D3 kann Links nach der Simulation
        // bereits in Node-Objekte umgewandelt haben

        sourceId =
            typeof link.source === "object"
                ? link.source.id
                : link.source;

        targetId =
            typeof link.target === "object"
                ? link.target.id
                : link.target;

        if (targetId === node.id) {
            entityIds.add(sourceId);
        }
    });


    // ----------------------------------------
    // Entity Nodes aus den IDs holen
    // ----------------------------------------

    const entities =
        graph.nodes.filter(entity =>
            entity.type === "entity" &&
            entityIds.has(entity.id)
        );


    // ----------------------------------------
    // Überschrift
    // ----------------------------------------

    const entityTitle =
        document.createElement("h3");
    entityTitle.textContent =
        `Entities (${entities.length})`;
    panel.appendChild(entityTitle);


    // ----------------------------------------
    // Liste erstellen
    // ----------------------------------------

    const list =
        document.createElement("ul");
    list.classList.add("entity-list");


    entities.forEach(entity => {
        const listItem =
            document.createElement("li");
        const button =
            document.createElement("button");
        button.textContent =
            entity.title;
        button.addEventListener("click", () => {
            showEntity(entity);
        });
        listItem.appendChild(button);
        list.appendChild(listItem);
    });
    panel.appendChild(list);

}