import {pointAlongLine, drawArrow, quadBezier, pointsNormalToLine} from "./util.js";
import Point from "./Point.js";

class Edge {
    constructor(u, v, w, directed) {
        this.u = u;
        this.v = v;
        this.w = w;

        this.x = -1;
        this.y = -1;

        this.directed = directed;

    }

    update(ctx, translate){

        var pu = pointAlongLine(this.u, this.v, this.u.r);
        var pv = pointAlongLine(this.v, this.u, this.v.r);
        var pm = new Point(Math.round((this.u.x + this.v.x) / 2), Math.round((this.u.y + this.v.y) / 2));

        if (!translate){
            if (!this.directed) {

                this.x = pm.x;
                this.y = pm.y;
    
                ctx.beginPath();
                ctx.moveTo(pu.x, pu.y);
                ctx.lineTo(pv.x, pv.y);
                ctx.stroke();
    
            }
            else {
    
                var cp = pointsNormalToLine(pu, pm, 30);
                var pMiddle = quadBezier(pu, pv, cp, 0.5);
    
                this.x = pMiddle.x;
                this.y = pMiddle.y;
    
                ctx.beginPath();
                ctx.moveTo(pu.x, pu.y);
                ctx.quadraticCurveTo(cp.x, cp.y, pv.x, pv.y);
                ctx.stroke();
    
                // wha'ts a unit vector
                drawArrow(quadBezier(pu, pv, cp, 0.7), quadBezier(pu, pv, cp, 0.8), 10, Math.PI / 4, ctx);
            }
        }
        else {
            
            var xnew = translate[0] - pm.x;
            var ynew = translate[1] - pm.y;
            

            // still come back in a bit to shorten
            // then add a property for edge weight click coordinates
            // 
            

            if (!this.directed){
                pu.x += xnew;
                pu.y += ynew;
                pv.x += xnew;
                pv.y += ynew;
                pm.x += xnew;
                pm.y += ynew;

                this.x = pm.x;
                this.y = pm.y;

                ctx.beginPath();
                ctx.moveTo(pu.x, pu.y);
                ctx.lineTo(pv.x, pv.y);
                ctx.stroke();
            }
            else {
                var cp = pointsNormalToLine(pu, pm, 30);

                pu.x += xnew;
                pu.y += ynew;
                pv.x += xnew;
                pv.y += ynew;
                cp.x += xnew;
                cp.y += ynew;
                pm.x += xnew;
                pm.y += ynew;

                var pMiddle = quadBezier(pu, pv, cp, 0.5);
                this.x = pMiddle.x;
                this.y = pMiddle.y;
                // this.x = translate[0];
                // this.y = translate[1];
    
                ctx.beginPath();
                ctx.moveTo(pu.x, pu.y);
                ctx.quadraticCurveTo(cp.x, cp.y, pv.x, pv.y);
                ctx.stroke();
    
                // wha'ts a unit vector
                drawArrow(quadBezier(pu, pv, cp, 0.7), quadBezier(pu, pv, cp, 0.8), 10, Math.PI / 4, ctx);
            }


        }



        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.w, this.x, this.y + 20);

        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
};


// fix backedge issues sometime
// maybe generalize points normal to line function to a additive angle thing like robotico idk
// then start to make things more efficient i guess
// maybe make things more linear algebra-ey

export default Edge;
