/*
project: how 2 be a bad electrical engineer heheheeh
*/

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
        ctx.fillText(this.n, this.x, this.y + 10);
    }
}

function Edge(u, v, w){
    this.u = u;
    this.v = v;
    this.w = w;
    this.x = -1;
    this.y = -1;
    this.update = function(){
        dx = - u.x;
        dy = - u.y;
        if (this.v){
            dx += v.x;
            dy += v.y;
        }
        else{
            dx += mouse_pos[0];
            dy += mouse_pos[1];
        }
    
        theta_x = Math.atan(Math.abs(dy / dx));
        x_comp = Math.round(r * Math.cos(theta_x));
        y_comp = Math.round(r * Math.sin(theta_x));

        // Assume Q4, change for other Qs
        if (dx < 0 && dy > 0) {
            x_comp = -x_comp;
        }
        else if (dx < 0 && dy < 0) {
            x_comp = -x_comp;
            y_comp = -y_comp;
        }
        else if (dx > 0 && dy < 0) {
            y_comp = -y_comp;
        }

        pu = [u.x + x_comp, u.y + y_comp];

       
        pv = [null, null];
        pm = [null, null];

        if (this.v){
            pv = [v.x - x_comp, v.y - y_comp];
            pm = [Math.round((u.x + v.x) / 2), Math.round((u.y + v.y) / 2)];
        }
        else {
            pv = [mouse_pos[0] - x_comp, mouse_pos[1] - y_comp];
            pm = [Math.round((u.x + mouse_pos[0]) / 2), Math.round((u.y + mouse_pos[1]) / 2)];
        }


        if (!directed){

            this.x = pm[0]
            this.y = pm[1]
            ctx.beginPath()
            ctx.moveTo(pu[0], pu[1])
            ctx.lineTo(pv[0], pv[1])
            ctx.stroke()

            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.w, pm[0], pm[1] + 20);

        }
        else {
        /*
        EW!
        problems with the trig here when dx or dy == 0 or close to
        arrows can get fucked  as well
        rework this entire section 
            variable names
            efficiency
            functions
            make quadrants better (do u even need the if blocks ?)
            poop time.
        */
            const graphHasBackEdge = () => {
                for (let edge of edges){
                    if (edge.u == this.v && edge.v == this.u){
                        return true;
                    }
                }
                return false;
            };

            d1 = Math.sqrt(Math.pow(pm[0] - pu[0], 2) + Math.pow(pm[1] - pu[1],2))
            d2 = d1 / 2 // calculating angles lol (fix this later)
            h = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2))

            angle = Math.PI/2 - (theta_x + Math.atan(d2 / d1))
            x_comp = h * Math.sin(angle)
            y_comp = h * Math.cos(angle)

            if (graphHasBackEdge()) {
                angle = (theta_x - Math.atan(d2 / d1))
                x_comp = h * Math.cos(angle)
                y_comp = h * Math.sin(angle)
            }

            if (dx < 0 && dy > 0) {
                x_comp = -x_comp;
            }
            else if (dx < 0 && dy < 0) {
                x_comp = -x_comp
                y_comp = -y_comp
            }
            else if (dx > 0 && dy < 0) {
                y_comp = -y_comp
            }

            cp_x = pu[0] + x_comp
            cp_y = pu[1] + y_comp

            ctx.beginPath();
            ctx.moveTo(pu[0], pu[1]);
            ctx.quadraticCurveTo(cp_x, cp_y, pv[0], pv[1]);
            ctx.stroke();

            /*
            Quadradic Bezier: 
            B(t) = (1-t)^2P0 + 2(1 - t)tP1 + t^2P2
            B(0.5) = P0/4 + P1/2 + P2/4

            use to translate arrow points to

            also use later to attach clickable boxes or something idk

            */

            const quadBezier = function(t) {
                x = Math.round(pu[0] * Math.pow(1 - t, 2) + 2 * (1 - t) * t * cp_x + Math.pow(t, 2) * pv[0]);
                y = Math.round(pu[1] * Math.pow(1 - t, 2) + 2 * (1 - t) * t * cp_y + Math.pow(t, 2) * pv[1]);
                return [x, y];
            };

            p_arrow = quadBezier(0.5);


            /*
                use theta_x to calculate arrow line endpoints from pm
                clean this up
            */
            alpha = Math.atan(20 / (Math.sqrt(2) * d1 - 20));
            hyp = d1 - 20 / (Math.sqrt(2));
            p1 = [pu[0] + hyp * Math.cos(alpha + theta_x), pu[1] - hyp * Math.sin(alpha + theta_x)]
            p2 = [pu[0] + hyp * Math.cos(-alpha + theta_x), pu[1] - hyp * Math.sin(-alpha + theta_x)]

            // Q3
            if (dx < 0 && dy > 0) {
                p1 = [pu[0] - hyp * Math.cos(alpha + theta_x), pu[1] + hyp * Math.sin(alpha + theta_x)]
                p2 = [pu[0] - hyp * Math.cos(-alpha + theta_x), pu[1] + hyp * Math.sin(-alpha + theta_x)]
            }
            // Q2
            else if (dx < 0 && dy < 0) {
                p1 = [pu[0] - hyp * Math.cos(alpha + theta_x), pu[1] - hyp * Math.sin(alpha + theta_x)]
                p2 = [pu[0] - hyp * Math.cos(-alpha + theta_x), pu[1] - hyp * Math.sin(-alpha + theta_x)]
            }
            // Q4
            else if (dx > 0 && dy > 0) {
                p1 = [pu[0] + hyp * Math.cos(alpha + theta_x), pu[1] + hyp * Math.sin(alpha + theta_x)]
                p2 = [pu[0] + hyp * Math.cos(-alpha + theta_x), pu[1] + hyp * Math.sin(-alpha + theta_x)]
            }

            /* translate points to p_arrow from bezier */

            p1 = [p1[0] + p_arrow[0] - pm[0], p1[1] + p_arrow[1] - pm[1]]
            p2 = [p2[0] + p_arrow[0] - pm[0], p2[1] + p_arrow[1] - pm[1]]

            /* draw the lines */
            ctx.beginPath();
            ctx.moveTo(p_arrow[0], p_arrow[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.stroke()
            ctx.moveTo(p_arrow[0], p_arrow[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke()


            ctx.font = "15px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.w, cp_x, cp_y);

            p_point=quadBezier(0.55);
            this.x = p_point[0];
            this.y = p_point[1];
        }

        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

/*
figure out how to delete edges
clean up trig in edges, the rest of this code

then make pretty (shadows, background, aww yeee)
return the testcase


write functions to test for properties for popup card


*/



/* 
maybe: animate stuff
add properties to node & edge class to temporarily change
styling (width, colour, etc) to help with animatino stuff
- could make sure elements never overlap (closeTo modification), but save for l8er 

(maybe then investigate mobile UI options if u care enough.)

*/


/*
    figure out js events what's going on under the hood which are handled first etc
    so u can get rid of some tabs.
*/

var r = 30 // nodde
var re = 20 // edge weight click
var nodes = [new Node(30, 31, 31, 'Add'), new Node(30, 31, 121, 'Del')]
var edges = []
var directed = false
var dragging_node = null
var extending_edge = null
var mouse_pos = [null, null]


function updateGameArea() {
    area.clear();
    for (let node of nodes){ 
        if (node != dragging_node){
            node.update(); 
        }
    }
    for (let edge of edges){ 
        edge.update(); 
    }
    if (dragging_node){
        dragging_node.x = mouse_pos[0]
        dragging_node.y = mouse_pos[1]
        dragging_node.update()
    }
    else if (extending_edge){
        extending_edge.update()
    }
}

/*
may want to extend to edges as well for middle points
Math.sqrt(Math.pow(e.clientX - node.x, 2) + Math.pow(e.clientY - node.y, 2)) <= r
*/
function closeTo(e){
    for (let node of nodes){
        if (Math.sqrt(Math.pow(e.clientX - node.x, 2) + Math.pow(e.clientY - node.y, 2)) <= r 
            && node != dragging_node){
            return node;
        }
    }
    // eh
    for (let edge of edges){
        if (Math.sqrt(Math.pow(e.clientX - edge.x, 2) + Math.pow(e.clientY - edge.y, 2)) <= re 
            && !extending_edge){
            return edge;
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


function leftClick(e){
    elem_clicked = closeTo(e);

    // Click to begin dragging a new node
    if (!dragging_node && elem_clicked && elem_clicked.n == 'Add'){
        dragging_node = new Node(30, 31, 31, nodes.length - 2); // because first 2 nodes are utility
    }
    // Click to begin dragging an existing node
    else if (!dragging_node && elem_clicked && typeof elem_clicked.n === "number"){
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
    else if (!dragging_node && elem_clicked && elem_clicked instanceof Edge){
        console.log(elem_clicked);
        // handle input from user to change the weight
        // lol check for garbage input
        elem_clicked.w = prompt("New weight", '1');
    }
}



function rightClick(e){
    elem_clicked = closeTo(e);

    // Prevent context menu popup on right click
    e.preventDefault(); 
   
    // Click to begin dragging line frome existing node
    if (!extending_edge && elem_clicked && typeof elem_clicked.n === "number"){//elem_clicked.n != 'Add' && elem_clicked.n != 'Del'){
        extending_edge = new Edge(elem_clicked, null, 1);
    }
    // Clicks to terminate line dragging from existing node
    else if (extending_edge){
        if (elem_clicked && elem_clicked != extending_edge.u && elem_clicked.n != 'Del' && elem_clicked.n != 'Add' && !edge_between(extending_edge.u, elem_clicked)){
            edges.push(new Edge(extending_edge.u, elem_clicked, 1));
        }
        extending_edge = null;
    }
    console.log(edges)
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

    if (confirm("Build directed graph?")){
        directed = true;
    }

    area.canvas.addEventListener('mousemove', function(e){ mouse_pos = [e.clientX, e.clientY]; });
    area.canvas.addEventListener('click', e => leftClick(e));
    area.canvas.addEventListener('contextmenu', e => rightClick(e));

}