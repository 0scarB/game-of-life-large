const mod = (a, b) => (a+b)%b;

const mkGameBaseline = (width, height) => {
    let gridOld = [];
    let gridNew = [];

    for (let y = 0; y < height; ++y) {
        const rowOld = [];
        const rowNew = [];
        for (let x = 0; x < width; ++x) {
            rowOld.push(0);
            rowNew.push(0);
        }
        gridOld.push(rowOld);
        gridNew.push(rowNew);
    }

    const initCell = (x, y, value) => {
        gridOld[y][x] = value;
    }

    const update = () => {
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const cellWasAlive = gridOld[y][x];

                let liveNeighbors = 0;
                for (let ny = y-1; ny <= y+1; ++ny) {
                    for (let nx = x-1; nx <= x+1; ++nx) {
                        liveNeighbors +=
                            gridOld[mod(ny, height)][mod(nx, width)];
                    }
                }
                liveNeighbors -= cellWasAlive;

                gridNew[y][x] = (liveNeighbors === 3 ||
                                 liveNeighbors === 2 && cellWasAlive)+0;
            }
        }

        const tmp = gridNew;
        gridNew = gridOld;
        gridOld = tmp;
    }

    const queryCell = (x, y) => {
        return gridNew[y][x];
    }

    return {initCell, update, queryCell};
}

