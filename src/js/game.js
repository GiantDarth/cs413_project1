// Use self-closing anonymous function (using arrow-notation) to avoid flooding the 'namespace'
(() => {
    // Only run when the document is fully loaded.
    document.addEventListener("DOMContentLoaded", (event) => {
        const WIDTH = 400;
        const HEIGHT = 400;
        const PIXEL_SIZE = 32;
        const VELOCITY_FACTOR = 0.05;

        var gameport = document.getElementById("gameport");
        // Shortened from #000000
        var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { backgroundColor: 0x000 });
        gameport.appendChild(renderer.view);

        var stage = new PIXI.Container();
        var ball = new PIXI.Sprite(PIXI.Texture.fromImage('assets/bowl_ball.png'));
        var pins = new Array();
        // Used to not reuse/reload the same image.
        const PIN_IMG = PIXI.Texture.fromImage('assets/pin.png');
        for(let i = 0; i < 10; i++) {
            pins.push(new PIXI.Sprite(PIN_IMG));
        }

        ball.anchor.x = 0.5;
        ball.anchor.y = 0.5;
        // Center sprite on screen.
        ball.position.x = WIDTH / 2;
        ball.position.y = HEIGHT - PIXEL_SIZE;
        stage.addChild(ball);

        // Use to position the pins collectively.
        var pinsContainer = new PIXI.Container();
        // Get the count of rows.
        const ROWS = getNumOfRows(pins.length);
        for(let p = 0, pos = 0, row = 0; p < pins.length; p++) {
            pins[p].anchor.x = 0.5;
            pins[p].anchor.y = 0.5;

            // Add pins starting from left-to-right
            pins[p].position.x = (pos - row / 2) * PIXEL_SIZE;
            // Reverse the y position based on row facing the ball,
            // so that the first pin is bottom.
            pins[p].position.y = (ROWS - row) * PIXEL_SIZE;

            pins[p].collided = false;
            pins[p].on('collided', (ball, pin, index) => {
                if(!pin.collided) {
                    console.log("Pin", index);
                }
                pin.collided = true;
            });

            pinsContainer.addChild(pins[p]);

            if(isLastOfRow(pos, row)) {
                row++;
                pos = 0;
            }
            else {
                pos++;
            }
        }

        pinsContainer.position.x = WIDTH / 2;
        pinsContainer.position.y = 0;

        stage.addChild(pinsContainer);

        ball.interactive = true;
        // Used to
        ball.released = true;
        ball.velocity = { x: 0, y: 0 };

        ball.on('mousedown', (e) => {
            ball.released = false;
        });

        ball.on('mousemove', (e) => {
            if(!ball.released) {
                // Rotate the ball based on the mouse position relative to the ball position, and compensate with an extra 90 degrees to the left.
                ball.rotation = Math.atan2(e.data.global.y - ball.position.y, e.data.global.x - ball.position.x) - Math.PI / 2;
            }
        });

        ball.on('mouseupoutside', (e) => {
            if(!ball.released) {
                ball.velocity = { x: (ball.position.x - e.data.global.x) * VELOCITY_FACTOR,
                    y: (ball.position.y - e.data.global.y) * VELOCITY_FACTOR}
            }
            ball.released = true;
        });

        function resetBall(ball) {
            ball.velocity = {x: 0, y: 0};
            ball.position.x = WIDTH / 2;
            ball.position.y = HEIGHT - PIXEL_SIZE;
            ball.rotation = 0;
        }

        function checkCollision(ball, pin) {
            return ball.position.x - pin.position.x - PIXEL_SIZE / 2 < 0 || ball.position.y - pin.position.y - PIXEL_SIZE / 2< 0;
        }

        // Self-execute animate
        (function animate() {
            requestAnimationFrame(animate);
            if(ball.velocity.x || ball.velocity.y) {
                ball.rotation += 0.2;
                ball.position.x += ball.velocity.x;
                ball.position.y += ball.velocity.y;

                pins.forEach((pin, index) => {
                    if(checkCollision(ball, pin)) {
                        pin.emit('collided', ball, pin, index);
                    }
                });

                for(let p = 0; p < pins.length; p++) {

                }

                if(ball.position.x < 0 || ball.position.x > WIDTH || ball.position.y < 0 || ball.position.y > HEIGHT) {
                    resetBall(ball);
                }
            }
            renderer.render(stage);
        })();
    });

    function isLastOfRow(pos, row) {
        return pos === row;
    }

    function getNumOfRows(numOfPins) {
        var row = 0;
        for(let n = 0, pos = 0; n < numOfPins; n++) {
            // Reset position and increment row num.
            if(isLastOfRow(pos, row)) {
                row++;
                pos = 0;
            }
            else {
                pos++;
            }
        }

        return row;
    }
})();
