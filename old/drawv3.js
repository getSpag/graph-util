/*
- issue with adding edges w/out obj copy use google
- might make more sense to draw from an adj_lst
- is desktop only because of your control scheme lol (is okay who cares)

shii now this is kind of a mess too
v3?
yeah there are a lot of holes with just hooking listerns kup to canvas blindly

still need editable edge weights, proper edge drawing -- definite rework
still want to fix having to create new edge instead of just pushing adding_edge to edges

interesting option:
https://stackoverflow.com/questions/58674443/why-cant-i-change-object-property-in-javascript


*/

// 'use strict';

var area = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth * 0.6
        this.canvas.height = this.canvas.width
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
  
function Node(r, x, y, n) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.n = n;
    this.update = function(){

        ctx = area.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(n, this.x, this.y + 10);
    }
}

function Edge(u, v, w){
    this.u = u;
    this.v = v, writeable=true;
    this.w = w;
    this.update = function(){

        ctx = area.context;
        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();

        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.w, Math.round((u.x + v.x) / 2), Math.round((u.y + v.y) / 2) + 20);

    }
}



r = 30
nodes = [new Node(30, 31, 31, 'Add')]
edges = []
directed = false
adding_node = null
adding_edge = null
mouse_pos = [null, null]


function updateGameArea() {
    area.clear();
    for (let node of nodes){ 
        if (node != adding_node){
            node.update(); 
        }
    }
    for (let edge of edges){ 
        edge.update(); 
    }
    if (adding_node){
        adding_node.x = mouse_pos[0];
        adding_node.y = mouse_pos[1];
        adding_node.update()
    }
    else if (adding_edge){
        adding_edge.v.x = mouse_pos[0];
        adding_edge.v.y = mouse_pos[1];
        adding_edge.update()
    }
}

function closeTo(e){
    for (let node of nodes){
        if (Math.abs(e.clientX - node.x) <= 2 * r && 
            Math.abs(e.clientY - node.y) <= 2 * r &&
            node != adding_node){
            return node;
        }
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

function add_node(e){
    near_nei = closeTo(e);

    // Click to begin dragging a new node
    if (!adding_node && near_nei && near_nei.n == 'Add'){
        adding_node = new Node(30, 31, 31, nodes.length - 1);
    }
    // Click to begin dragging an existing node
    else if (!adding_node && near_nei && near_nei.n != 'Add'){
        adding_node = near_nei
    }
    // Click to stop dragging node
    else if (adding_node){
        // Only allow pleasant placement
        if (!near_nei) {
            // If new node, append to global list of nodes
            if (adding_node.n == nodes.length - 1){
                nodes.push(adding_node);
            }
            adding_node = null;
        }
    }
}



function add_edge(e){
    near_nei = closeTo(e);

    // Prevent context menu popup on right click
    e.preventDefault(); 
   
    // Click to begin dragging line frome existing node
    if (!adding_edge && near_nei && near_nei.n != 'Add'){
        adding_edge = new Edge(near_nei, new Node(30, mouse_pos[0], mouse_pos[1], 'dummy'), 1);
    }
    // Clicks to terminate line dragging from existing node
    else if (adding_edge){
        if (near_nei && near_nei != adding_edge.u && !edge_between(adding_edge.u, near_nei)){
            adding_edge.v = near_nei;
            edges.push(adding_edge);
            // edges.push(new Edge(adding_edge.u, near_nei, 1));
        }
        adding_edge = null;
    }
    
}



function main(){
    n0 = new Node(30, 150, 150, 0);
    n1 = new Node(30, 250, 250, 1);
    n2 = new Node(30, 350, 350, 2);
    nodes.push(n0, n1, n2)

    e0 = new Edge(n0, n1, 1);
    e1 = new Edge(n1, n2, 1);
    edges.push(e0, e1);

    area.start();

    area.canvas.addEventListener('mousemove', function(e){ mouse_pos = [e.clientX, e.clientY]; });
    area.canvas.addEventListener('click', e => add_node(e));
    area.canvas.addEventListener('contextmenu', e => add_edge(e));

}