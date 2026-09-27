import Food from "./food.js";
import Snake from "./snake.js";

export default class Game {
    #canvas;
    #ctx;
    #snake;
    #food;
    #lastMove = 0;
    #moveDelay = 60;
    #animationId;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#snake = new Snake({ canvas: canvas });
        this.#food = new Food(canvas);

        document.addEventListener("keydown", (event) =>
            this.#snake.setDirection(event.key)
        );

        this.gameLoop = this.gameLoop.bind(this);
    }

    #gameOver() {
        alert("GameOver!!!");
        cancelAnimationFrame(this.#animationId);
    }

    gameLoop(time) {
        if (time - this.#lastMove >= this.#moveDelay) {
            if (this.#snake.checkBodyCollision()
                || this.#snake.touchingWalls())
                return this.#gameOver();
            if (this.#snake.touching({
                ...this.#food.getPosition()
            })) {
                this.#snake.grow();
                this.#food.setPosition({});
            }
            this.#snake.update();
            this.#lastMove = time;
        }
        this.#ctx.clearRect(
            0, 0, this.#canvas.width, this.#canvas.height
        );
        this.#snake.render();
        this.#food.render();
        this.#animationId = requestAnimationFrame(this.gameLoop)
    }
}
