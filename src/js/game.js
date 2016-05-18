// Use self-closing anonymous function (using arrow-notation) to avoid flooding 'namespace'
(() => {
    // Only run when the document is fully loaded.
    document.addEventListener("DOMContentLoaded", (event) => {
        const WIDTH = 400;
        const HEIGHT = 400;

        var gameport = document.getElementById("gameport");
        // Shortened from #3344ee
        var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, { backgroundColor: 0x34e });
        gameport.appendChild(renderer.view);

        var stage = new PIXI.Container();
        var texture = PIXI.Texture.fromImage('assets/check.png');
        var sprite = new PIXI.Sprite(texture);

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        // Center sprite on screen.
        sprite.position.x = WIDTH / 2;
        sprite.position.y = HEIGHT / 2;

        stage.addChild(sprite);

        (function animate() {
            requestAnimationFrame(animate);
            sprite.rotation += 0.1;
            renderer.render(stage);
        })();
    });
})();
