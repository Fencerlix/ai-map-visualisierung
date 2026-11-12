export async function loadGraph(){
    const response = await fetch("/data/entities.json");

    if (!response.ok) {
        throw new Error(
            `Failed to load entities.json: ${response.status}`
        );
    }

    return await response.json();
}