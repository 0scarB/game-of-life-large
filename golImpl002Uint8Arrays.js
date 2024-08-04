const mkGameUint8Arrays = (width, height) => {
    let gridOld = new Uint8Array(width*height);
    let gridNew = new Uint8Array(width*height);

    const initCell = (x, y, value) => {
        gridOld[y*width + x] = value;
    }

    const mod = (a, b) => (a+b)%b;

    const update = () => {
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const cellWasAlive = gridOld[y*width + x];

                let liveNeighbors = 0;
                for (let ny = y-1; ny <= y+1; ++ny) {
                    for (let nx = x-1; nx <= x+1; ++nx) {
                        liveNeighbors +=
                            gridOld[mod(ny, height)*width + mod(nx, width)];
                    }
                }
                liveNeighbors -= cellWasAlive;

                gridNew[y*width + x] = ((liveNeighbors | cellWasAlive) == 3)+0;
            }
        }

        const tmp = gridNew;
        gridNew = gridOld;
        gridOld = tmp;
    }

    const queryCell = (x, y) => {
        return gridOld[y*width + x];
    }

    return {initCell, update, queryCell};
}

