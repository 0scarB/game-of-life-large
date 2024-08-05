"use strict";

const CELL_SIZE_AT_DEFAULT_ZOOM = 2;

let genDurationSecs = 0.05;
let shouldRepaintCanvas = false;
let canvasEl;
let ctx;
const grid = {
           x:                        -1,
           y:                        -1,
           w:                      1024,
           h:                      1024,
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
        const gameGridRowLen = grid.w+2;

        ctx.fillStyle = "cyan";

        const cellIdxStartY = grid.y > 0
            ? 0
            : Math.floor(-grid.y/grid.cellSize);
        const cellIdxStartX = grid.x > 0
            ? 0
            : Math.floor(-grid.x/grid.cellSize);
        const cellStopY = (grid.y+grid.h*grid.cellSize) < canvasEl.height
            ? grid.h
            : grid.h - Math.floor(
                (grid.y+grid.h*grid.cellSize - canvasEl.height)/grid.cellSize)
        const cellStopX = (grid.x+grid.w*grid.cellSize) < canvasEl.width
            ? grid.w
            : grid.w - Math.floor(
                (grid.x+grid.w*grid.cellSize - canvasEl.width)/grid.cellSize)
        for (let cellIdxY = cellIdxStartY; cellIdxY < cellStopY; ++cellIdxY) {
            const gameGridRowStart = (cellIdxY+1)*gameGridRowLen + 1;
            const cellY = grid.y+cellIdxY*grid.cellSize;
            for (let cellIdxX = cellIdxStartX; cellIdxX < cellStopX; ++cellIdxX) {
                if (gameGrid[gameGridRowStart + cellIdxX]) {
                    ctx.fillRect(
                        grid.x+cellIdxX*grid.cellSize, cellY,
                        grid.cellSize, grid.cellSize);
                }
            }
        }
    }

    const AVG_FPS_N_FRAMES = 100;
    const avgFpsEl = document.getElementById("avg-fps");
    let frameT0 = performance.now();
    const nFramesDurations = [];
    const updateFPSCounter = () => {
        const frameT1 = performance.now();
        nFramesDurations.push(frameT1 - frameT0);
        frameT0 = frameT1;
        if (nFramesDurations.length > AVG_FPS_N_FRAMES) {
            nFramesDurations.shift();
        }
        let frameDurationsSum = 0;
        for (const frameDuration of nFramesDurations)
            frameDurationsSum += frameDuration;
        const avgFps = 1000*nFramesDurations.length/frameDurationsSum;
        avgFpsEl.innerHTML = `Avg. FPS; last ${AVG_FPS_N_FRAMES} frames: ` + avgFps.toFixed(2);
    }

    let genT0   = performance.now();
    const mainLoop = () => {
        const genT1 = performance.now();
        if (genT1 - genT0 > genDurationSecs*1000) {
            genT0 = genT1;

            game.update();

            shouldRepaintCanvas = true;
        }

        if (shouldRepaintCanvas) {
            paintCanvas();
            shouldRepaintCanvas = false;
        }

        updateFPSCounter();
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

