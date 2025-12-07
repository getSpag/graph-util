/*

would be cool to have list going of propereties graph currently has 
(as being built) that relate to algorithms or something with links to more info?
depends


*/

/*
AFTER THIS iteration, check out Neetcode leetcode roadmap JS
ig screenshot
fuck front end dev yo

maybe look at curves to fit bnum methods
TODO - Naive implementation (no libraries)

    most important
    - directed edge function with curves
    - force user to pick if directed or not at the start to ensure nothing gets fucked up



    - make look prettier 
    - making edge weights editable (NOT node numbers)
    - making edge weight display positions make sense for mostly vertical lines

    kind of important but really want to do and will likely be a headache
    - transient states before locking in upon mouseup
    - ability to drag nodes, and draw moving edge lines in transition 

    adding a purpose
    - write function to return the testcase in language of choice

    cool
    - make edge lines more complex to dodge components already in thing

    later:
    - radius from windowsize/canvas size
    - linewidth stuff
    - refactor to make far less ugly
    - grid paper backing?

    more purpose
    - refactor involves adding properties to nodes and edges to support 
        (colour, thickness) visualization of various algorithms

*/

var area = {
    canvas : document.createElement('canvas'),
    start : function() {
        this.canvas.width = window.innerWidth * 0.6
        this.canvas.height = this.canvas.width
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById('src'));
    }
}

var radius = 30
var lnwidth = 2
var directed = true

var adding_node = false
var adding_edge = [false, null]
var moving_node = false

var add_node_pos = [radius + lnwidth, radius + lnwidth]

var n = 0
var adj_lst = {}
var pos = {'-1':add_node_pos}
var edges = []
var edges_dct = {}


function main(){
    area.start()
    var canvas = document.querySelector('canvas')
    var ctx = canvas.getContext('2d')



    // border
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    // ctx.strokeRect(0, 0, 100, 100)

    // where to add nodes from
    ctx.beginPath();
    ctx.arc(add_node_pos[0], add_node_pos[1], radius, 0, 2*Math.PI);
    ctx.stroke();

    // make this a popoup l8er heh
    var dirBox = document.createElement('input')
    dirBox.setAttribute("type", "checkbox");
    document.body.insertBefore(dirBox, document.getElementById('src'));
    dirBox.checked = true;
    dirBox.addEventListener('click', function(e){
        directed = dirBox.checked;
        console.log(directed)
    });

    // the meat
    canvas.addEventListener('mousedown', function(e){
        console.log(e.clientX, e.clientY)
        if (Math.abs(e.clientX - add_node_pos[0]) <= 2 * radius && Math.abs(e.clientY - add_node_pos[1]) <= 2 * radius){
            adding_node = true;
        }

        if (!adding_node){
            for (const [node, posi] of Object.entries(pos)){
                if (Math.abs(e.clientX - posi[0]) <= 2 * radius && Math.abs(e.clientY - posi[1]) <= 2 * radius){
                    console.log(node, typeof(node))
                    adding_edge = [true, node]
                }
            }
        }
    });

    canvas.addEventListener('mouseup', function(e){

        if (e.clientX >= 0 && e.clientX <= canvas.width - radius && e.clientY >= 0 && e.clientY <= canvas.height - radius){

            closeTo = ''
            for (const [node, posi] of Object.entries(pos)){
                if (Math.abs(e.clientX - posi[0]) <= 2 * radius && Math.abs(e.clientY - posi[1]) <= 2 * radius){
                    console.log(node, typeof(node))
                    closeTo = node
                    break;
                }
            }

            if (adding_node && closeTo == ''){
                adj_lst[String(n)] = []
                pos[String(n)] = [e.clientX, e.clientY]
                draw_node(String(n), ctx)
                n += 1
            }
            else if (adding_edge[0] && closeTo != '' && closeTo != parent){
                if (directed && !([adding_edge[1], closeTo] in edges_dct)){
                    // check for ui, vi
                    edges_dct[[adding_edge[1], closeTo]] = true;
                    edges.push([adding_edge[1], closeTo, 1])
                    draw_edge(adding_edge[1], closeTo, '1', ctx)
                }
                else if (!directed && !([adding_edge[1], closeTo] in edges_dct) && !([closeTo, adding_edge[1]] in edges_dct)){
                    
                    // check for ui, vi & vi, ui
                    edges_dct[[adding_edge[1], closeTo]] = true;
                    edges_dct[[closeTo, adding_edge[1]]] = true;
                    edges.push([adding_edge[1], closeTo, 1])


                    // need directed edge function with arrows and curves
                    draw_edge(adding_edge[1], closeTo, '1', ctx)  
                }
                console.log(Object.entries(edges_dct))

                
                
            }
        }

        adding_node = false
        adding_edge = [false, null]

    });

}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

function draw_transient(x, y){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.stroke();
}

function draw_node(node, ctx){
    ctx.beginPath();
    ctx.arc(pos[node][0], pos[node][1], radius, 0, 2*Math.PI);
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(node, pos[node][0], pos[node][1] + 10);
}

function draw_edge(ui, vi, wi, ctx){

    dx = pos[vi][0] - pos[ui][0]
    dy = pos[vi][1] - pos[ui][1]

    theta_x = Math.atan(Math.abs(dy / dx))
    x_comp = Math.round(radius * Math.cos(theta_x))
    y_comp = Math.round(radius * Math.sin(theta_x))

    pu = [0, 0]
    pv = [0, 0]
    // pu = pos[ui].map(x=>x) tink
    // pv = pos[vi].map(x=>x)

    // vi Q4 relative to ui @ origin
    if (dx > 0 && dy > 0){
        pu = [pos[ui][0] + x_comp, pos[ui][1] + y_comp]
        pv = [pos[vi][0] - x_comp, pos[vi][1] - y_comp]
    }
    // Q3
    else if (dx < 0 && dy > 0){
        pu = [pos[ui][0] - x_comp, pos[ui][1] + y_comp]
        pv = [pos[vi][0] + x_comp, pos[vi][1] - y_comp]
    }
    // Q2
    else if (dx < 0 && dy < 0){
        pu = [pos[ui][0] - x_comp, pos[ui][1] - y_comp]
        pv = [pos[vi][0] + x_comp, pos[vi][1] + y_comp]
    }
    // Q1
    else if (dx > 0 && dy < 0){
        pu = [pos[ui][0] + x_comp, pos[ui][1] - y_comp]
        pv = [pos[vi][0] - x_comp, pos[vi][1] + y_comp]
    }

    pm = [Math.round((pu[0] + pv[0]) / 2), Math.round((pv[1] + pu[1]) / 2)]
    // split below into directed and non directed

    if (!directed) {
        ctx.beginPath()
        ctx.moveTo(pu[0], pu[1])
        ctx.lineTo(pv[0], pv[1])
        ctx.stroke()
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(wi, pm[0], pm[1] + 20);
    }
    else {

        d1 = Math.sqrt(Math.pow(pm[0] - pu[0], 2) + Math.pow(pm[1] - pu[1],2))
        d2 = d1 / 2
        h = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2))
        angle1 = Math.PI/2 - (theta_x + Math.atan(d2 / d1))
        angle2 = (theta_x - Math.atan(d2 / d1))

        console.log(dx, dy, d1, d2, h, angle1, angle2)
        pb1x = null
        pb1y = null
        pb2x = null
        pb2y = null

        // vi Q4 relative to ui @ origin
        if (dx > 0 && dy > 0){
            // pu = [pos[ui][0] + x_comp, pos[ui][1] + y_comp]
            pb1x = pu[0] + h * Math.sin(angle1)
            pb1y = pu[1] + h * Math.cos(angle1)
            pb2x = pu[0] + h * Math.cos(angle2)
            pb2y = pu[1] + h * Math.sin(angle2)
        }
        // Q3
        else if (dx < 0 && dy > 0){
            // pu = [pos[ui][0] - x_comp, pos[ui][1] + y_comp]
            pb1x = pu[0] - h * Math.sin(angle1)
            pb1y = pu[1] + h * Math.cos(angle1)
            pb2x = pu[0] - h * Math.cos(angle2)
            pb2y = pu[1] + h * Math.sin(angle2)
        }
        // Q2
        else if (dx < 0 && dy < 0){
            // pu = [pos[ui][0] - x_comp, pos[ui][1] - y_comp]
            pb1x = pu[0] - h * Math.sin(angle1)
            pb1y = pu[1] - h * Math.cos(angle1)
            pb2x = pu[0] - h * Math.cos(angle2)
            pb2y = pu[1] - h * Math.sin(angle2)
        }
        // Q1
        else if (dx > 0 && dy < 0){
            // pu = [pos[ui][0] + x_comp, pos[ui][1] - y_comp]
            pb1x = pu[0] + h * Math.sin(angle1)
            pb1y = pu[1] - h * Math.cos(angle1)
            pb2x = pu[0] + h * Math.cos(angle2)
            pb2y = pu[1] - h * Math.sin(angle2)
        }

        // split the below for da back edges faaaam
        ctx.beginPath();
        ctx.moveTo(pu[0], pu[1]);
        ctx.quadraticCurveTo(pb1x, pb1y, pv[0], pv[1])
        ctx.moveTo(pu[0], pu[1]);
        ctx.quadraticCurveTo(pb2x, pb2y, pv[0], pv[1])
        ctx.stroke()


        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(wi, pb1x, pb1y);
        ctx.fillText(wi, pb2x, pb2y);
        
    }




}

function draw_from_memory(ctx){
    adj_lst = {0:[1], 1:[2], 2:[3]}
    pos = {0:[150,150], 1:[250,250], 2:[350,350]}
    edges = [[0,1,1], [1,2,1]]


    for (const [node, neis] of Object.entries(adj_lst)){
        console.log(node, typeof(node))
        draw_node(node, ctx)
    }

    for (const [ui, vi, wi] of edges){
        console.log(ui, vi, wi, typeof(ui))
        draw_edge(String(ui), String(vi), String(wi), ctx)
    }


}

// if (adding_node){

// }

// if (adding_edge[0]){

// }

// if (moving_node){

// }
