const mkGameFlatNoMod = (width, height) => {
    const w = width+2;
    const h = height+2;

    const gridSize = w*h;
    let gridOld = [];
    let gridNew = [];

    for (let i = 0; i < gridSize; ++i) {
        gridOld.push(0);
        gridNew.push(0);
    }

    const initCell = (x, y, value) => {
        gridOld[(y+1)*w + x+1] = value;
    }

    const update = () => {
        // Copy to opposing "clone" rows to avoid modulo
        for (let x = 1; x < width+1; ++x) {
            gridOld[               x] = gridOld[height*w + x];
            gridOld[(height+1)*w + x] = gridOld[       w + x];
        }
        for (let y = 1; y < height+1; ++y) {
            gridOld[y*w          ] = gridOld[y*w + width];
            gridOld[y*w + width+1] = gridOld[y*w +     1];
        }
        gridOld[                     0] = gridOld[height*w + width];
        gridOld[               width+1] = gridOld[height*w +     1];
        gridOld[(height+1)*w +       0] = gridOld[       w + width];
        gridOld[(height+1)*w + width+1] = gridOld[       w +     1];

        for (let i = w+1; i < gridSize-w-1; ++i) {
            const liveNeighbors =
                gridOld[i-w-1] + gridOld[i-w] + gridOld[i-w+1] +
                gridOld[i  -1] +                gridOld[i  +1] +
                gridOld[i+w-1] + gridOld[i+w] + gridOld[i+w+1];

            const cellWasAlive = gridOld[i];
            gridNew[i] = ((liveNeighbors | cellWasAlive)== 3)+0;
        }

        const tmp = gridNew;
        gridNew = gridOld;
        gridOld = tmp;
    }

    const queryCell = (x, y) => {
        return gridOld[(y+1)*w + x+1];
    }

    return {initCell, update, queryCell};
}

