import * as d3 from "d3";

export function enableZoom(svg, container){
    svg.call(
        d3.zoom()
            .scaleExtent([0.3,5])
            .on("zoom", event => {
                container.attr(
                    "transform",
                    event.transform
                );
            })
    );
}