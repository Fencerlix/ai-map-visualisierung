export async function loadGraph(){
    const response = await fetch("/data/entities.json");
    return await response.json();
}