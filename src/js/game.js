// Use self-closing anonymous function (using arrow-notation) to avoid flooding the 'namespace'
(() => {
    // Only run when the document is fully loaded.
    document.addEventListener("DOMContentLoaded", (event) => {
        const WIDTH = 400;
        const HEIGHT = 400;
        const PIXEL_SIZE = 32;

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

        // Self-execute animate
        (function animate() {
            requestAnimationFrame(animate);
            ball.rotation += 0.1;
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
