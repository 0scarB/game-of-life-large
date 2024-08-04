const mkGameNoMod = (width, height) => {
    let gridOld = [];
    let gridNew = [];

    for (let y = 0; y < height+2; ++y) {
        const rowOld = [];
        const rowNew = [];
        for (let x = 0; x < width+2; ++x) {
            rowOld.push(0);
            rowNew.push(0);
        }
        gridOld.push(rowOld);
        gridNew.push(rowNew);
    }

    const initCell = (x, y, value) => {
        gridOld[y+1][x+1] = value;
    }

    const update = () => {
        // Copy to opposing "clone" rows to avoid modulo
        for (let x = 1; x < width+1; ++x) {
            gridOld[       0][x] = gridOld[height][x];
            gridOld[height+1][x] = gridOld[     1][x];
        }
        for (let y = 1; y < height+1; ++y) {
            gridOld[y][      0] = gridOld[y][width];
            gridOld[y][width+1] = gridOld[y][    1];
        }
        gridOld[       0][      0] = gridOld[height][width];
        gridOld[       0][width+1] = gridOld[height][    1];
        gridOld[height+1][      0] = gridOld[     1][width];
        gridOld[height+1][width+1] = gridOld[     1][    1];

        for (let y = 1; y < height+1; ++y) {
            for (let x = 1; x < width+1; ++x) {
                const cellWasAlive = gridOld[y][x];

                let liveNeighbors = 0;
                for (let ny = y-1; ny < y+2; ++ny)
                    for (let nx = x-1; nx < x+2; ++nx)
                        liveNeighbors += gridOld[ny][nx];
                liveNeighbors -= cellWasAlive;

                gridNew[y][x] = ((liveNeighbors | cellWasAlive) == 3)+0;
            }
        }

        const tmp = gridNew;
        gridNew = gridOld;
        gridOld = tmp;
    }

    const queryCell = (x, y) => {
        return gridOld[y+1][x+1];
    }

    return {initCell, update, queryCell};
}

