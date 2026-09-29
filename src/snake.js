export default class Snake {
    #canvas;
    #ctx;
    #dx = 0;
    #dy = 0;
    #prevKey;
    #body = [];
    #bodySize = 20;
    #borderRadius;

    constructor({ canvas, x=undefined, y=undefined, borderRadius=0 }) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement))
            throw new Error();
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#borderRadius = borderRadius;
        this.#body.push(new SnakeBody({
            canvas: canvas,
            x:x,
            y:y,
            color:"#28f128",
            size: this.#bodySize,
            borderRadius: this.#borderRadius,
        }));
    }

    update() { this.#updatePositions(); }

    reset() {
        this.#body = this.#body.slice(0, 1);
        const head = this.#body[0];
        head.updatePosition({
            x: (this.#canvas.width - this.#bodySize) / 2,
            y: (this.#canvas.height - this.#bodySize) / 2,
        });
        this.#dx = 0;
        this.#dy = 0;
        this.#prevKey = undefined;
    }

    #updatePositions() {
        for (let i = this.#body.length - 1;
            i > 0;
            i--
        ) {
            const currBody = this.#body[i];
            const prevBody = this.#body[i - 1];
            currBody.updatePosition({...prevBody.getPosition()});
        }
        const [x, y] = Object.values(this.#getHeadPosition());
        this.#body[0].updatePosition({
            x: x + (this.#bodySize * this.#dx),
            y: y + (this.#bodySize * this.#dy),
        });
    }

    #getHeadPosition() { return {...this.#body[0].getPosition()}; }

    grow() {
        this.#body.push(new SnakeBody({
            canvas: this.#canvas,
            ...this.#getHeadPosition(),
            size: this.#bodySize,
            borderRadius: this.#borderRadius,
        }));
    }

    setDirection(ArrowKey='') {
        if (!ArrowKey || !ArrowKey.includes("Arrow"))
            throw new Error();
        const key = ArrowKey.split("Arrow")[1];
        if (["Up", "Down"].includes(this.#prevKey)
            && ["Up", "Down"].includes(key)
            || ["Left", "Right"].includes(this.#prevKey)
            && ["Left", "Right"].includes(key))
            return;
        this.#dx = ["Left", "Right"].includes(key)
            ? key === "Left" ? -1 : 1 : 0;
        this.#dy = ["Up", "Down"].includes(key)
            ? key === "Up" ? -1 : 1 : 0;
        this.#prevKey = key;
    }

    checkBodyCollision() {
        for (const body of this.#body.slice(1)) {
            const [hx, hy] = Object.values(this.#getHeadPosition());
            const [bx, by] = Object.values(body.getPosition());
            if (hx === bx && hy === by) return true;
        }
        return false;
    }

    touchingWalls() {
        const [x, y] = Object.values(this.#getHeadPosition());
        return (
            x  < 0
            || x + this.#bodySize > this.#canvas.width
            || y < 0
            || y + this.#bodySize > this.#canvas.height
        );
    }

    touching({ x=undefined, y=undefined }) {
        if (x === undefined || y === undefined)
            throw new Error();
        const [hx, hy] = Object.values(this.#getHeadPosition());
        return hx === x && hy === y;
    }

    render() { this.#body.forEach(body => body.render()); }
}

class SnakeBody {
    #x;
    #y;
    #size;
    #ctx;
    #color;
    #borderRadius;

    constructor({
        canvas=undefined,
        x=undefined,
        y=undefined,
        color="#158715",
        size=20,
        borderRadius=0,
    }) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement))
            throw new Error();
        this.#ctx = canvas.getContext("2d");
        this.#size = size;
        this.#x = x ?? (canvas.width - this.#size) / 2;
        this.#y = y ?? (canvas.height - this.#size) / 2;
        this.#color = color;
        this.#borderRadius = borderRadius;
    }

    getPosition() {
        return { x : this.#x, y : this.#y };
    }

    updatePosition({ x=undefined, y=undefined}) {
        this.#x = x === undefined ? this.#x : x;
        this.#y = y === undefined ? this.#y : y;
    }

    render() {
        this.#ctx.beginPath();
        this.#ctx.fillStyle = this.#color;
        this.#ctx.roundRect(
            this.#x,
            this.#y,
            this.#size,
            this.#size,
            this.#borderRadius
        );
        this.#ctx.fill();
    }
}
