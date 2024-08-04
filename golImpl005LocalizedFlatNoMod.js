const mkGameLocalizeFlatNoMod = (width, height) => {
    const w = width+2;
    const h = height+2;

    const gridSize = w*h;
    const grid = [];
    let toggle = 0;

    for (let i = 0; i < gridSize; ++i) {
        grid.push([0, 0]);
    }

    const initCell = (x, y, value) => {
        grid[(y+1)*w + x+1][toggle] = value;
    }

    const update = () => {
        // Copy to opposing "clone" rows to avoid modulo
        for (let x = 1; x < width+1; ++x) {
            grid[               x][toggle] = grid[height*w + x][toggle];
            grid[(height+1)*w + x][toggle] = grid[       w + x][toggle];
        }
        for (let y = 1; y < height+1; ++y) {
            grid[y*w          ][toggle] = grid[y*w + width][toggle];
            grid[y*w + width+1][toggle] = grid[y*w +     1][toggle];
        }
        grid[                     0][toggle] = grid[height*w + width][toggle];
        grid[               width+1][toggle] = grid[height*w +     1][toggle];
        grid[(height+1)*w +       0][toggle] = grid[       w + width][toggle];
        grid[(height+1)*w + width+1][toggle] = grid[       w +     1][toggle];

        for (let i = w+1; i < gridSize-w-1; ++i) {
            const liveNeighbors =
                grid[i-w-1][toggle] + grid[i-w][toggle] + grid[i-w+1][toggle] +
                grid[i  -1][toggle] +                     grid[i  +1][toggle] +
                grid[i+w-1][toggle] + grid[i+w][toggle] + grid[i+w+1][toggle];

            const cellWasAlive = grid[i][toggle];
            grid[i][toggle^1] = ((liveNeighbors | cellWasAlive)== 3)+0;
        }

        toggle ^= 1;
    }

    const queryCell = (x, y) => {
        return grid[(y+1)*w + x+1][toggle];
    }

    return {initCell, update, queryCell};
}

