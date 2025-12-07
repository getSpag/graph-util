class Node {
    constructor(r, x, y, n) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.n = n;
    };

    update(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.n, this.x, this.y + 10);
    };
};

export default Node;