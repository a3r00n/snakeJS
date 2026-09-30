export default class Food {
    #x;
    #y;
    #size = 20;
    #margin = 5;
    #parentEl;
    #ctx;
    #borderRadius;
    #animationSpeed = 0.004;
    #animationAmount = 2;

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
        ignorePos=[[-1, -1],],
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
        } while (ignorePos.some(
            ([x, y]) => x === this.#x && y === this.#y
        ));
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
        const time = performance.now();
        const breathing = Math.sin(time * this.#animationSpeed);
        const animateSize =
            this.#size - this.#margin + breathing * this.#animationAmount;
        const offSet = (this.#size - animateSize) / 2;
        const brightness = 45 + breathing * 15;
        this.#ctx.beginPath();
        this.#ctx.fillStyle = `hsl(0, 85%, ${brightness}%)`;
        this.#ctx.roundRect(
            this.#x + offSet,
            this.#y + offSet,
            animateSize,
            animateSize,
            this.#borderRadius,
        );
        this.#ctx.fill();
    }
}
