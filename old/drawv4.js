// https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/#:~:text=Adjacency%20List%20is%20one%20of,list%2C%20set%2C%20etc.)
/*

Basically you're gonna need to add properties to classes so that u can draw the canvas

like node.x, node.y...
and a draw(args?) method for graph class. (or for this module)

some NOODLEING:
--------------

really what you need is to decide on the best way to implement the UI
and the best way to implement graph draw(args?) based on that.
also balancing updating mouse_pos with drawing

1)
"Click to add nodes" checkbox
    checked: 
        if click(s) not on node(s):
            add node @ pos to graph
            (spawn node @ that position)


// harder to implement
"Click to add edges" checkbox
    checked:
        if mousedown on node:
            continually draw line to mouse position from node
            upon mouseup:
                if on different node:
                    add edge to graph

neither checked:
    if mousedown on existing node:
        @ interval:
            update clicked node position to mouse_pos
            draw graph


---
mouse position updating -- figure this out WITHOUT a canvas event listener
can't u just recall the event?
having this all depend onmousemove seems sketchy
or just only draw on startup (with pre-defined graphs) and mousemoves

this is interesting
https://stackoverflow.com/questions/30817534/how-to-implement-mousemove-while-mousedown-pressed-js







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
  
function updateGameArea() {
    area.clear();
    /* updates */
}

function main(){

}