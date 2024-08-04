const mkGameSingleArrFlatNoMod = (width, height) => {
    const w = width+2;
    const h = height+2;

    const gridSize = w*h;
    const grid = [];

    for (let i = 0; i < gridSize; ++i) {
        grid.push(0);
    }

    const initCell = (x, y, value) => {
        grid[(y+1)*w + x+1] = value;
    }

    const update = () => {
        // Copy to opposing "clone" rows to avoid modulo
        for (let x = 1; x < width+1; ++x) {
            grid[               x] = grid[height*w + x];
            grid[(height+1)*w + x] = grid[       w + x];
        }
        for (let y = 1; y < height+1; ++y) {
            grid[y*w          ] = grid[y*w + width];
            grid[y*w + width+1] = grid[y*w +     1];
        }
        grid[                     0] = grid[height*w + width];
        grid[               width+1] = grid[height*w +     1];
        grid[(height+1)*w +       0] = grid[       w + width];
        grid[(height+1)*w + width+1] = grid[       w +     1];

        for (let i = w+1; i < gridSize-w-1; ++i) {
            const liveNeighbors = (
                grid[i-w-1] + grid[i-w] + grid[i-w+1] +
                grid[i  -1] +             grid[i  +1] +
                grid[i+w-1] + grid[i+w] + grid[i+w+1])&0xF;

            const cellWasAlive = grid[i]&0xF;
            if ((liveNeighbors | cellWasAlive)== 3) {
                grid[i] |= 0x10;
            }
        }

        for (let i = w+1; i < gridSize-w-1; ++i) {
            grid[i] >>= 4;
        }

    }

    const queryCell = (x, y) => {
        return grid[(y+1)*w + x+1];
    }

    return {initCell, update, queryCell};
}

