let gridCenterX = 0;
let gridCenterY = 0;

window.addEventListener("DOMContentLoaded", () => {
    const w = 512;
    const h = 512;

    const {initCell, update, queryCell} = mkGameFast(w, h);

    //
    // Fill random
    //
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const cellIsAlive = Math.random() < 0.5 ? 0 : 1;
            initCell(x, y, cellIsAlive);
        }
    }

    const canvasEl = document.getElementById("canvas");
    canvasEl.width  = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    canvasEl.style.backgroundColor = "black";

    const ctx = canvasEl.getContext("2d");

    gridCenterX = canvasEl.width/2;
    gridCenterY = canvasEl.height/2;
    const cellSize = 4;
    const cellGap  = 1;
    const gridWidth  = w*cellSize;
    const gridHeight = w*cellSize;
    const gridOriginOffsetX = -gridWidth/2;
    const gridOriginOffsetY = -gridHeight/2;
    ctx.fillStyle = "green";

    let t0 = performance.now();
    const mainLoop = () => {
        const t1 = performance.now();
        if (t1 - t0 > 100) {
            update();
            t0 = t1;
        }

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                if (queryCell(x, y) === 1) {
                    ctx.fillRect(
                        gridCenterX+gridOriginOffsetX+cellGap/2+cellSize*x,
                        gridCenterY+gridOriginOffsetY+cellGap/2+cellSize*y,
                        cellSize-cellGap,
                        cellSize-cellGap);
                }
            }
        }

        requestAnimationFrame(mainLoop);
    };
    requestAnimationFrame(mainLoop);
});

let mouseIsDown = false;
window.onmousedown = () => {
    mouseIsDown = true;
}
window.onmouseup = () => {
    mouseIsDown = false;
}
window.onmousemove = (e) => {
    if (!mouseIsDown) return;
    gridCenterX += e.movementX;
    gridCenterY += e.movementY;
}
