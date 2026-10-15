import * as d3 from "d3";

export function enableDrag(node, simulation){

    node.call(
        d3.drag()

            .on("start", (event,d)=>{
                if(!event.active){
                    simulation.alphaTarget(0.3).restart();
                }
                d.fx=d.x;
                d.fy=d.y;
            })

            .on("drag",(event,d)=>{
                d.fx=event.x;
                d.fy=event.y;
            })

            .on("end",(event,d)=>{
                if(!event.active){
                    simulation.alphaTarget(0);
                }
                d.fx=null;
                d.fy=null;
            })
    );
}