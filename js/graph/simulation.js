import * as d3 from "d3";
import { boundaryForce } from "./boundaryForce.js";
import { nodeStyles } from "../config/nodeStyles.js";

export function createSimulation(nodes, links, width, height){

    return d3.forceSimulation(nodes)

        .force(
            "link",
            d3.forceLink(links)
                .id(d => d.id)
                .distance(50)
        )

        .force(
            "charge",
            d3.forceManyBody()
                .strength(-50)
        )

        .force(
            "center",
            d3.forceCenter(
                width / 2,
                height / 2
            )
        )

        .force(
            "collision",
            d3.forceCollide()
                .radius(d =>
                    nodeStyles[d.type]?.collisionRadius ?? 17
                )
        )
        
        .force(
            "boundary",
            boundaryForce(
                width,
                height,
                10
            )
        );


}