const CELL_SIZE_AT_DEFAULT_ZOOM = 2;

let genDurationSecs = 0.05;
let shouldRepaintCanvas = false;
let canvasEl;
let ctx;
const grid = {
    x: -1,
    y: -1,
    w: 1024,
    h: 1024,
    cellSize: CELL_SIZE_AT_DEFAULT_ZOOM,
};

window.addEventListener("DOMContentLoaded", () => {
    canvasEl = document.getElementById("canvas");
    canvasEl.width  = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    canvasEl.addEventListener("wheel", handleCanvasScroll);
    const centerX = canvasEl.width /2;
    const centerY = canvasEl.height/2;
    grid.x = Math.floor(centerX - grid.w*grid.cellSize/2);
    grid.y = Math.floor(centerY - grid.h*grid.cellSize/2);
    ctx = canvasEl.getContext("2d");

    const game = mkGameFast(grid.w, grid.h);
    // Fill random
    for (let y = 0; y < grid.w; ++y) {
        for (let x = 0; x < grid.h; ++x) {
            game.initCell(x, y, +(Math.random() < 0.5));
        }
    }

    const paintCanvas = () => {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        const gameGrid = game.getGrid();

        ctx.fillStyle = "cyan";
        for (
            let cellY = grid.y, gameY = 1;
            cellY < grid.y+grid.h*grid.cellSize;
            cellY += grid.cellSize, ++gameY
        ) {
            for (
                let cellX = grid.x, gameX = 1;
                cellX < grid.x+grid.w*grid.cellSize;
                cellX += grid.cellSize, ++gameX
            ) {
                if (cellX < -grid.cellSize || cellY < -grid.cellSize ||
                    cellX > canvasEl.width || cellY > canvasEl.height
                ) continue;
                if (gameGrid[gameY*(grid.w+2) + gameX]) {
                    ctx.fillRect(cellX, cellY, grid.cellSize, grid.cellSize);
                }
            }
        }
    }

    let t0 = performance.now();
    const mainLoop = () => {
        const t1 = performance.now();
        if (t1 - t0 > genDurationSecs*1000) {
            t0 = t1;

            game.update();

            shouldRepaintCanvas = true;
        }

        if (shouldRepaintCanvas) {
            paintCanvas();
            shouldRepaintCanvas = false;
        }

        requestAnimationFrame(mainLoop);
    };
    requestAnimationFrame(mainLoop);
});

const handleResize = () => {
    const gridCenterOffsetX = grid.x - canvasEl.width /2;
    const gridCenterOffsetY = grid.y - canvasEl.height/2;

    canvasEl.width  = Math.floor(canvasEl.clientWidth);
    canvasEl.height = Math.floor(canvasEl.clientHeight);

    const centerX = canvasEl.width /2;
    const centerY = canvasEl.height/2;

    grid.x = centerX + gridCenterOffsetX;
    grid.y = centerY + gridCenterOffsetY;

    shouldRepaintCanvas = true;
}
window.onresize = handleResize;

let mouseIsPressed = false;
window.onmousedown = () => {
    mouseIsPressed = true;
}
window.onmouseup = () => {
    mouseIsPressed = false;
}
window.onmousemove = (e) => {
    if (!mouseIsPressed) return;
    grid.x = Math.floor(grid.x + e.movementX);
    grid.y = Math.floor(grid.y + e.movementY);

    shouldRepaintCanvas = true;
}

const ZOOM_SPEED = 0.002;
let zoomLevel = 1;
const handleCanvasScroll = (e) => {
    const gridMouseCellOffsetX = (grid.x - e.offsetX)/grid.cellSize;
    const gridMouseCellOffsetY = (grid.y - e.offsetY)/grid.cellSize;

    const newZoomLevel = zoomLevel - e.deltaY*ZOOM_SPEED;

    grid.cellSize = Math.ceil(newZoomLevel*CELL_SIZE_AT_DEFAULT_ZOOM);
    if (grid.cellSize < 1) {
        grid.cellSize = 1;
    } else {
        zoomLevel = newZoomLevel;
    }

    grid.x = e.offsetX + gridMouseCellOffsetX*grid.cellSize;
    grid.y = e.offsetY + gridMouseCellOffsetY*grid.cellSize;

    shouldRepaintCanvas = true;
}

