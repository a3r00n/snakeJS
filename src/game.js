import Food from "./food.js";
import Snake from "./snake.js";

export default class Game {
    #canvas;
    #ctx;
    #currentScoreEl;
    #highScoreEl;
    #gameOverPopup;
    #snake;
    #food;
    #borderRadius = 5;
    #lastMove = 0;
    #moveDelay = 60;
    #animationId;
    #currentScore = 0;
    #highScore = 0;

    constructor(canvas, currrentScoreContainer, highScoreContainer, gameOverPopup) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)
            || !currrentScoreContainer || !highScoreContainer)
            throw new Error();
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#currentScoreEl = currrentScoreContainer;
        this.#highScoreEl = highScoreContainer;
        this.#gameOverPopup = gameOverPopup;
        this.#snake = new Snake({ canvas: canvas, borderRadius: this.#borderRadius });
        this.#food = new Food({ parentEl: canvas, borderRadius: this.#borderRadius });

        document.addEventListener("keydown", (event) =>
            this.#snake.setDirection(event.key)
        );

        document.addEventListener("click", () => {
            if (!this.#gameOverPopup.classList.contains("active"))
                return;
            this.#gameOverPopup.classList.remove("active");
            this.#currentScore = 0;
            this.#snake.reset();
            this.#animationId = requestAnimationFrame(this.gameLoop);
        });

        this.gameLoop = this.gameLoop.bind(this);
    }

    #gameOver() {
        cancelAnimationFrame(this.#animationId);
        this.#gameOverPopup.classList.add("active");
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
                this.#currentScore++;
                if (this.#currentScore > this.#highScore)
                    this.#highScore = this.#currentScore;
            }
            this.#snake.update();
            this.#lastMove = time;
        }
        this.#ctx.clearRect(
            0, 0, this.#canvas.width, this.#canvas.height
        );
        this.#snake.render();
        this.#food.render();
        this.#currentScoreEl.textContent = `Current Score: ${this.#currentScore}`;
        this.#highScoreEl.textContent = `High Score: ${this.#highScore}`;
        this.#animationId = requestAnimationFrame(this.gameLoop);
    }
}
