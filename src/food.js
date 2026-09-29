export default class Food {
    #x;
    #y;
    #size = 20;
    #parentEl;
    #ctx;
    #borderRadius;

    constructor({ parentEl=undefined, x=undefined, y=undefined, borderRadius=0 }) {
        if (!parentEl || !(parentEl instanceof HTMLCanvasElement))
            throw new Error();
        this.#parentEl = parentEl;
        this.#ctx = parentEl.getContext("2d");
        this.setPosition({ x:x, y:y });
        this.#borderRadius = borderRadius;
    }

    getPosition() { return { x: this.#x, y: this.#y }; }

    setPosition({
        x=undefined,
        y=undefined,
        ignorePos={ix:-1, iy:-1}
    }) {
        do {
            this.#x = x ?? this.#randomNum({
                min: 0,
                max: this.#parentEl.width - this.#size,
            }, this.#size);
            this.#y = y ?? this.#randomNum({
                min: 0,
                max: this.#parentEl.height - this.#size,
            }, this.#size);
        } while (this.#x === ignorePos.ix && this.#y === ignorePos.iy);
    }

    #randomNum({
        min=undefined,
        max=undefined
    }, divisibleOf = 1
    ) {
        if (min === undefined|| max === undefined)
            throw new Error();
        let num;
        do {
            num = Math.floor(
                Math.random() * (max - min + 1)
            ) + min;
        } while (num % divisibleOf != 0);
        return num;
    }

    render() {
        this.#ctx.beginPath();
        this.#ctx.fillStyle = "#f01d1d";
        this.#ctx.roundRect(this.#x, this.#y, this.#size, this.#size, this.#borderRadius);
        this.#ctx.fill();
    }
}
