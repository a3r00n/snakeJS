export default class Snake {
    #canvas;
    #ctx;
    #dx = 0;
    #dy = 0;
    #prevKey;
    #body = [];
    #bodySize = 20;

    constructor({ canvas, x=undefined, y=undefined }) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement))
            throw new Error();
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#body.push(new SnakeBody({
            canvas: canvas,
            x:x,
            y:y,
            color:"#28f128",
            size: this.#bodySize,
        }));
    }

    update() { this.#updatePositions(); }

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

    render() {
        this.#ctx.beginPath();
        this.#body.forEach(body => {
            body.render();
        });
        this.#ctx.fill();
    }
}

class SnakeBody {
    #x;
    #y;
    #size;
    #ctx;
    #color;

    constructor({
        canvas=undefined,
        x=undefined,
        y=undefined,
        color="#158715",
        size=20,
    }) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement))
            throw new Error();
        this.#ctx = canvas.getContext("2d");
        this.#size = size;
        this.#x = x ?? (canvas.width - this.#size) / 2;
        this.#y = y ?? (canvas.height - this.#size) / 2;
        this.#color = color;
    }

    getPosition() {
        return { x : this.#x, y : this.#y };
    }

    updatePosition({ x=undefined, y=undefined}) {
        this.#x = x === undefined ? this.#x : x;
        this.#y = y === undefined ? this.#y : y;
    }

    render() {
        this.#ctx.fillStyle = this.#color;
        this.#ctx.fillRect(this.#x, this.#y, this.#size, this.#size);
    }
}
