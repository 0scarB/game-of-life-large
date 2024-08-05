const mkGameFast = (w, h) => {
    const w1 = w+1
    const h1 = h+1
    const w2 = w+2;
    const h2 = h+2;

    const gridSize = w2*h2;
    let gridOld = [];
    let gridNew = [];

    for (let i = 0; i < gridSize; ++i) {
        gridOld.push(0);
        gridNew.push(0);
    }

    const initCell = (x, y, value) => {
        gridOld[(y+1)*w2 + x+1] = value;
    }

    const update = () => {
        // Copy to opposing "clone" rows to avoid modulo
        for (let x = 1; x < w1; ++x) {
            gridOld[        x] = gridOld[h*w2 + x];
            gridOld[h1*w2 + x] = gridOld[  w2 + x];
        }
        for (let y = 1; y < h1; ++y) {
            gridOld[y*w2     ] = gridOld[y*w2 + w];
            gridOld[y*w2 + w1] = gridOld[y*w2 + 1];
        }
        gridOld[         0] = gridOld[h*w2 + w];
        gridOld[        w1] = gridOld[h*w2 + 1];
        gridOld[h1*w2     ] = gridOld[  w2 + w];
        gridOld[h1*w2 + w1] = gridOld[  w2 + 1];

        for (let i = w2+1; i < gridSize-w2-1; ++i) {
            const prevRow = i - w2;
            const nextRow = i + w2;
            const liveNeighbors =
                gridOld[prevRow-1] + gridOld[prevRow] + gridOld[prevRow+1] +
                gridOld[i      -1] +                    gridOld[i      +1] +
                gridOld[nextRow-1] + gridOld[nextRow] + gridOld[nextRow+1];

            const cellWasAlive = gridOld[i];
            gridNew[i] = ((liveNeighbors | cellWasAlive)== 3)+0;
        }

        const tmp = gridNew;
        gridNew = gridOld;
        gridOld = tmp;
    }

    const queryCell = (x, y) => {
        return gridOld[(y+1)*w2 + x+1];
    }

    const getGrid = () => {
        return gridOld;
    }

    return {initCell, update, queryCell, getGrid};
}

