export class MapEditor {
    generate(width, height) {
        //[j][i]
        let cells = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => 0))
        //[j,i]
        let centerWidthCount = Math.floor(Math.sqrt(width) / 2);
        let centerHeightCount = Math.floor(Math.sqrt(height) / 2);
        let centerWidth = Math.floor(width / centerWidthCount);
        let centerHeight = Math.floor(height / centerHeightCount)
        let centerDw = Math.floor((width - (centerWidthCount - 1) * centerWidth) / 2);
        let centerDh = Math.floor((height - (centerHeightCount - 1) * centerHeight) / 2);
        let centers = [];
        let branchs = new Map();
        Array.from({ length: centerHeightCount })
            .forEach((_, j) => Array.from({ length: centerWidthCount })
                .forEach((_, i) => centers.push([j * centerHeight + centerDh, i * centerWidth + centerDw])))
        centers.forEach(center => {
            cells[center[0]][center[1]] = 1
            let idx = center[0] * width + center[1];
            branchs.set(idx, [idx]);
        }
        );
        let edges = centers;
        let growsFac = [0, 0, 0, 0, 0, 0.4, 0.6, 0.8, 0.9, 1];
        let branchFac = 0.001;
        let wallFac = 0.6;
        let maxWall = width * height * wallFac;
        let maxEmptyGenerate = 100;
        let maxGenerateTime = 1000;
        let wallCount = centers.length;
        let lastCount = wallCount;
        let emptyGenerate = 0;
        let remainStep = Number.POSITIVE_INFINITY;
        let start = Date.now();
        while (remainStep > 0 && maxWall > wallCount) {
            let remainTime = start + maxGenerateTime - Date.now();
            if (remainTime < 0) {
                break;
            }
            let nextEdges = [];
            for (let edge of edges) {
                let r = Math.random();
                let edgeIdx = edge[0] * width + edge[1];
                let branch = branchs.get(edgeIdx);
                let grow = growsFac.findIndex(fac => fac > r);
                if (grow) {
                    let dirIdx = Math.floor(Math.random() * 4);
                    let dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                    let [dj, di] = dirs[dirIdx];
                    let nonBackDirs = dirs.filter(([j, i]) => i != -di || j != -dj);
                    let newEdge;
                    let connected = undefined;
                    for (let d = 1; d <= grow; d++) {
                        let nextCellJ = edge[0] + d * dj;
                        let nextCellI = edge[1] + d * di;
                        if (nextCellI <= 0 || nextCellI >= width - 1
                            || nextCellJ <= 0 || nextCellJ >= height - 1) {
                            break;
                        }
                        if (cells[nextCellJ][nextCellI]) {
                            connected = [nextCellJ, nextCellI];
                            newEdge = undefined;
                            break;
                        }
                        cells[nextCellJ][nextCellI] = 1;
                        let nextCellIdx = nextCellJ * width + nextCellI;
                        branch.push(nextCellIdx);
                        branchs.set(nextCellIdx, branch);
                        wallCount++;
                        for (let odir of nonBackDirs) {
                            let neighborJ = nextCellJ + odir[0];
                            let neighborI = nextCellI + odir[1];
                            if (neighborJ < 0 || neighborJ >= height
                                || neighborI < 0 || neighborI >= width) {
                                continue;
                            }
                            if (cells[neighborJ][neighborI]) {
                                // debugger;
                                connected = [neighborJ, neighborI];
                                break;
                            }
                        }
                        if (connected) {
                            newEdge = undefined;
                            break;
                        }
                        newEdge = [nextCellJ, nextCellI];
                    }
                    if (connected) {
                        let connectedIdx = connected[0] * width + connected[1];
                        let connectedBranch = branchs.get(connectedIdx);
                        if (connectedBranch != branch) {
                            let newBranch = [...connectedBranch, ...branch]
                            newBranch.forEach(i => branchs.set(i, newBranch))
                        }
                    }
                    if (connected || Math.random() < branchFac) {
                        nextEdges.push(edge);
                    }
                    if (newEdge && !cells[newEdge[0][newEdge[1]]]) {
                        nextEdges.push(newEdge);
                    }
                }
            }
            if (lastCount == wallCount) {
                emptyGenerate++;
                if (emptyGenerate > maxEmptyGenerate) {
                    break;
                }
            } else {
                emptyGenerate = 0;
            }
            edges = nextEdges;
        }
        let maxLengthBranch = null;
        let maxBranchLength = 0;
        for (let b of new Set(branchs.values())) {
            if (b.length > maxBranchLength) {
                maxLengthBranch = b;
                maxBranchLength = b.length;
            }
        }
        let startIdx = maxLengthBranch[Math.floor(Math.random() * maxBranchLength)]
        let maxDist = 0;
        start = [Math.floor(startIdx / width), startIdx % width];
        let end = start;
        for (let pidx of maxLengthBranch) {
            let p = [Math.floor(pidx / width), pidx % width]
            let dist = Math.hypot(p[0] - start[0], p[1] - start[1]);
            if (dist > maxDist) {
                end = p;
                maxDist = dist;
            }
        }
        return {
            cells,
            start,
            end
        }
    }
}