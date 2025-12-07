/*
it's fuck around friday

looks like actual mouse tip position is at the right tip of the arrow

finally looks cleaner
not perfect obciously
want better names
*/
import Point from './Point.js';

function pointAlongLine(pu, pv, d){
    // directed from u -> v, linear
    // could say translate pu along pu->pv by d 
    // point in direction maybe better name
    var dx = pv.x - pu.x;
    var dy = pv.y - pu.y;
    var angle = Math.atan2(Math.abs(dy), Math.abs(dx));
    var x = d * Math.cos(angle);
    var y = d * Math.sin(angle);
    return new Point(pu.x + (x == 0? 0: x * Math.sign(dx)), pu.y + (y == 0? 0: y * Math.sign(dy)));
}

function quadBezier(pu, pv, cp, t) {
    /*
    Quadradic Bezier:
    B(t) = (1-t)^2P0 + 2(1 - t)tP1 + t^2P2
    B(0.5) = P0/4 + P1/2 + P2/4

    */
    var x = Math.round(pu.x * Math.pow(1 - t, 2) + 2 * (1 - t) * t * cp.x + Math.pow(t, 2) * pv.x);
    var y = Math.round(pu.y * Math.pow(1 - t, 2) + 2 * (1 - t) * t * cp.y + Math.pow(t, 2) * pv.y);
    return new Point(x, y);
};

function rotatePoint(pPivot, p, angle) {
    // sneaky rotato CW
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var xnew = (p.x - pPivot.x) * c - (p.y - pPivot.y) * s;
    var ynew = (p.x - pPivot.x) * s + (p.y - pPivot.y) * c;

    return new Point(xnew + pPivot.x, ynew + pPivot.y);
};

const drawArrow = function (p1, p2, length, angle, ctx) {
    var toRotate = pointAlongLine(p2, p1, length);
    var pLeft = rotatePoint(p2, toRotate, angle);
    var pRight = rotatePoint(p2, toRotate, -angle);

    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.stroke();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.stroke();
};



function pointsNormalToLine(l1, l2, distanceAlongNormal){
    // good enough 4 now
    // need to rename it since always CW rotation from l1->l2
    var dLine = Math.sqrt(Math.pow(l2.x - l1.x, 2) + Math.pow(l2.y - l1.y, 2));
    distanceAlongNormal = dLine / 2;
    var h = Math.sqrt(Math.pow(dLine, 2) + Math.pow(distanceAlongNormal, 2));;
    var theta = Math.atan2(distanceAlongNormal , dLine);
    // this being this way is annoying

    var to_rotate = pointAlongLine(l1, l2, h);
    var p = rotatePoint(l1, to_rotate, theta);
    return p;

}

export {pointAlongLine, rotatePoint, drawArrow, quadBezier, pointsNormalToLine};