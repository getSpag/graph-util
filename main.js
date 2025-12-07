import Node from './Node.js';
import Edge from './Edge.js';

var area = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth * 0.6
        this.canvas.height = this.canvas.width
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 5);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
  

var r = 30; // nodde
var re = 20; // has to be high because mouse click has an offset (to the right tip, not tip)
var nodes = [new Node(30, 31, 31, 'Add'), new Node(30, 31, 121, 'Del')];
var edges = [];
var directed = false;
var dragging_node = null;
var extending_edge = null;
var dragging_edge = null;
var mousePos = [null, null];
var dummy_node = new Node(0, 0, 0, null);


function updateGameArea() {
    area.clear();
    for (let edge of edges){ 
        if (edge != dragging_edge){
            edge.update(area.context, null); 
        }
        else{
            edge.update(area.context, mousePos); 
        }
    }
    for (let node of nodes){ 
        if (node != dragging_node){
            node.update(area.context); 
        }
    }

    // can move these two into the loops
    // + the new one
    if (dragging_node){
        dragging_node.x = mousePos[0]
        dragging_node.y = mousePos[1]
        dragging_node.update(area.context)
    }
    else if (extending_edge){
        dummy_node.x = mousePos[0];
        dummy_node.y = mousePos[1];
        extending_edge.update(area.context)
    }
}

// return element clicked
function closeTo(e){

    // checks all nodes if click was within radius (r) size of node
    for (let node of nodes){
        if (Math.sqrt(Math.pow(e.clientX - node.x, 2) + Math.pow(e.clientY - node.y, 2)) <= r 
            && node != dragging_node){
            return node;
        }
    }

    // eh a smaller radius
    for (let edge of edges){
        if (Math.sqrt(Math.pow(e.clientX - edge.x, 2) + Math.pow(e.clientY - edge.y, 2)) <= re 
            && !extending_edge){
            return edge;
        }


        /*
        else if click was at edge weight box coordinates
            return that thing
            class so u can check instanceof 
            or just return an array [edge, indicator that edge weight box was clicked]
            idk do it later but it's the next step


        */
    }
    return null;
}

function edge_between(u, v){
    for (let edge of edges){
        // assumed direction inclusion true for both dir & !dire
        if (edge.u == u && edge.v == v){
            return true;
        }
        // only check reverse for !directed
        else if (!directed && edge.v == u && edge.u == v){
            return true;
        }
    }
    return false;
}


function leftClick(e){
    var elem_clicked = closeTo(e);

    // Click to begin dragging a new node
    if (!dragging_node && !dragging_edge && elem_clicked && elem_clicked.n == 'Add'){
        dragging_node = new Node(30, 31, 31, nodes.length - 2); // because first 2 nodes are utility
    }
    // Click to begin dragging an existing node
    else if (!dragging_node && !dragging_edge && elem_clicked && typeof elem_clicked.n === "number"){
        dragging_node = elem_clicked
    }
    // Click to stop dragging node
    else if (dragging_node){
        // Only allow pleasant placement
        if (!elem_clicked) {

            // If new node, append to global list of nodes
            if (dragging_node.n == nodes.length - 2){
                nodes.push(dragging_node);
            }
            // Otherwise, just drop it there
            dragging_node = null;
            console.log(nodes)
            console.log(Math.atan2(0, 1))
        }

        // if drag node to trash
        else if (elem_clicked.n == 'Del'){
            edges = edges.filter(edge => (edge.u != dragging_node && edge.v != dragging_node));
            nodes = nodes.filter(node => node != dragging_node);

            // reassign node numbers, edges should be maintained due to obj references in class
            for (let i = 2; i < nodes.length; i++){
                nodes[i].n = i - 2;
            }
            // 1 million ways to do the above but could do somethign with the class

            dragging_node = null;
            
        }
    }
    // Click edge weight
    else if (!dragging_edge && !dragging_node && elem_clicked && elem_clicked instanceof Edge){
        // console.log(elem_clicked);
        // elem_clicked.w = prompt("New weight", '1');
        dragging_edge = elem_clicked;
        console.log('dragged')
    }
    else if (dragging_edge){
        if (elem_clicked && elem_clicked.n == 'Del'){
            edges = edges.filter(edge => edge != dragging_edge);
        }
        dragging_edge = null;
        console.log('stop drag');
        console.log(edges);
    }
}



function rightClick(e){
    var elem_clicked = closeTo(e);

    // Prevent context menu popup on right click
    e.preventDefault(); 
   
    // Click to begin dragging line frome existing node
    if (!extending_edge && elem_clicked && typeof elem_clicked.n === "number"){//elem_clicked.n != 'Add' && elem_clicked.n != 'Del'){
        extending_edge = new Edge(elem_clicked, dummy_node, 1, directed);
    }
    // Clicks to terminate line dragging from existing node
    else if (extending_edge){
        if (elem_clicked && elem_clicked != extending_edge.u && elem_clicked.n != 'Del' && elem_clicked.n != 'Add' && !edge_between(extending_edge.u, elem_clicked)){
            edges.push(new Edge(extending_edge.u, elem_clicked, 1, directed));
        }
        extending_edge = null; // could also keep same dummy extending edge instead of tarshing ahhh
    }
    console.log(edges)
}



function main(){
    var n0 = new Node(30, 150, 150, 0);
    var n1 = new Node(30, 250, 250, 1);
    var n2 = new Node(30, 350, 350, 2);
    nodes.push(n0, n1, n2)

    // if (confirm("Build directed graph?")){
    //     directed = true;
    // }
    directed = true;

    var e0 = new Edge(n0, n1, 1, directed);
    var e1 = new Edge(n1, n2, 1, directed);
    var e2 = new Edge(n1, n0, 1, directed);
    edges.push(e0, e1, e2);

    area.start();


    area.canvas.addEventListener('mousemove', function(e){ mousePos = [e.clientX, e.clientY]; });
    area.canvas.addEventListener('click', e => leftClick(e));
    area.canvas.addEventListener('contextmenu', e => rightClick(e)); //right click

}

// window.main = main();
window.addEventListener('load', main);