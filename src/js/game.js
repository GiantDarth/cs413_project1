// Use self-closing anonymous function (using arrow-notation) to avoid flooding the 'namespace'
(() => {
    // Only run when the document is fully loaded.
    document.addEventListener("DOMContentLoaded", (event) => {
        const WIDTH = 400;
        const HEIGHT = 400;
        const PIXEL_SIZE = 32;

        var gameport = document.getElementById("gameport");
        // Shortened from #3344ee
        var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { backgroundColor: 0x000 });
        gameport.appendChild(renderer.view);

        var stage = new PIXI.Container();
        var ball = new PIXI.Sprite(PIXI.Texture.fromImage('assets/bowl_ball.png'));
        var pins = new Array();
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

        for(let p = 0, row = 0; p < pins.length; p++) {
            pins[p].anchor.x = 0.5;
            pins[p].anchor.y = 0.5;

            pins[p].position.x = WIDTH / 2;
            pins[p].position.y = (p + 1) * PIXEL_SIZE;

            stage.addChild(pins[p]);
        }

        // Self-execute animate
        (function animate() {
            requestAnimationFrame(animate);
            ball.rotation += 0.1;
            renderer.render(stage);
        })();
    });

    function isLastOfRow(pin, row) {
        return pin === row;
    }
})();
