import * as THREE from 'three';

export function createMazeAndMap(matrixData, params) {
    /* some constants */
    const HEIGHT = params.wall.HEIGHT;
    const THICKNESS = params.wall.THICKNESS;
    const SPACE = params.wall.SPACE;
    const POS_Y = (HEIGHT / 2) + THICKNESS;

    /* materials */
    const wallMat = params.wall.MAT;
    const floorMat = params.floor.MAT;
    // const floorMat = params.mazeConstant.WALL_MAT;
    const arrowMat = params.lift.ARROW_MAT;

    /* geometry */
    // wall
    const pilarWallGeo = new THREE.BoxGeometry(THICKNESS, HEIGHT, THICKNESS);
    const horizontalWallGeo = new THREE.BoxGeometry(SPACE, HEIGHT, THICKNESS);
    const verticalWallGeo = new THREE.BoxGeometry(THICKNESS, HEIGHT, SPACE);
    // floor
    const horizontalFloorGeo = new THREE.BoxGeometry(SPACE, THICKNESS, THICKNESS);
    const verticalFloorGeo = new THREE.BoxGeometry(THICKNESS, THICKNESS, SPACE);
    const smallSqrFloorGeo = new THREE.BoxGeometry(THICKNESS, THICKNESS, THICKNESS);
    const bigSqrFloorGeo = new THREE.BoxGeometry(SPACE, THICKNESS, SPACE);

    /* lift */
    const liftGeo = new THREE.BoxGeometry(SPACE, 2 * (HEIGHT + THICKNESS), SPACE);
    const liftMat = params.lift.LIFT_MAT;
    const liftDefault = new THREE.Mesh(liftGeo, liftMat);
    liftDefault.visible = false;
    const arrowGeo = new THREE.CylinderGeometry(2, 1, 0.4, 4);
    const arrowOne = new THREE.Mesh(arrowGeo, arrowMat);
    arrowOne.rotateX(-Math.PI / 2);
    arrowOne.position.set(0, 0, THICKNESS - (SPACE / 2));
    const arrowTwo = new THREE.Mesh(arrowGeo, arrowMat);
    arrowTwo.rotateX(Math.PI / 2);
    arrowTwo.position.set(0, 0, (SPACE / 2) - THICKNESS);
    liftDefault.add(arrowOne, arrowTwo);

    /* make mini map */
    const map = document.createElement("canvas");
    const MAP_SCALE = params.map.SCALE;
    const MAP_ORI_WIDTH = THICKNESS + ((SPACE + THICKNESS) * (matrixData[0][0].length - 1) / 2);
    const MAP_ORI_HEIGHT = THICKNESS + ((SPACE + THICKNESS) * (matrixData[0].length - 1) / 2);
    map.setAttribute('width', `${MAP_ORI_WIDTH * MAP_SCALE}`);
    map.setAttribute('height', `${MAP_ORI_HEIGHT * MAP_SCALE}`);
    const mapCollector = document.getElementById('map');

    /* construct maze walls and mini map */
    const mazeWalls = [];
    const mazeFloors = [];
    const mazeLifts = [];

    let mapPerFloor, ctx;
    for (let h = 0; h < matrixData.length; h++) {
        let mazeWallIdx;
        if (h & 1) {
            mazeWalls.push([]);
            mazeWallIdx = mazeWalls.length - 1;

            // make map
            mapPerFloor = map.cloneNode();
            mapPerFloor.setAttribute('id', `map-${(h / 2 >> 0) + 1}`);
            mapPerFloor.style.display = "none";
            ctx = mapPerFloor.getContext("2d");
        }
        for (let i = 0; i < matrixData[0].length; i++) {
            for (let j = 0; j < matrixData[0][0].length; j++) {
                const idxJ = (j / 2 >> 0);
                const idxI = (i / 2 >> 0);
                const idxH = (h / 2 >> 0);
                const x = idxJ * (SPACE + THICKNESS);
                const y = idxH * (HEIGHT + THICKNESS);
                const z = idxI * (SPACE + THICKNESS);
                if (h & 1) {
                    if (matrixData[h][i][j]) {

                        let wall, posX, posZ;
                        if (j & 1) {
                            posX = ((SPACE / 2) + THICKNESS) + x;
                            posZ = (THICKNESS / 2) + z;
                            wall = new THREE.Mesh(horizontalWallGeo, wallMat);
                            ctx.fillStyle = "rgba(255, 90, 0, 0.7)";
                            ctx.fillRect(MAP_SCALE * (x + THICKNESS), MAP_SCALE * z, MAP_SCALE * SPACE, MAP_SCALE * THICKNESS);
                        }
                        else if (i & 1) {
                            posX = (THICKNESS / 2) + x;
                            posZ = ((SPACE / 2) + THICKNESS) + z;
                            wall = new THREE.Mesh(verticalWallGeo, wallMat);
                            ctx.fillStyle = "rgba(255, 90, 0, 0.7)";
                            ctx.fillRect(MAP_SCALE * x, MAP_SCALE * (z + THICKNESS), MAP_SCALE * THICKNESS, MAP_SCALE * SPACE);
                        }
                        else {
                            posX = (THICKNESS / 2) + x;
                            posZ = (THICKNESS / 2) + z;
                            wall = new THREE.Mesh(pilarWallGeo, wallMat);
                            ctx.fillStyle = "rgba(255, 90, 0, 0.7)";
                            ctx.fillRect(MAP_SCALE * x, MAP_SCALE * z, MAP_SCALE * THICKNESS, MAP_SCALE * THICKNESS);
                        }
                        wall.position.set(posX, y + POS_Y, posZ);
                        mazeWalls[mazeWallIdx].push(wall);
                    }
                }
                else {
                    if (matrixData[h][i][j]) {
                        let floor, posX, posZ;
                        if ((i & 1) && (j & 1)) {
                            posX = ((SPACE / 2) + THICKNESS) + x;
                            posZ = ((SPACE / 2) + THICKNESS) + z;
                            floor = new THREE.Mesh(bigSqrFloorGeo, floorMat);
                        }
                        else if (j & 1) {
                            posX = ((SPACE / 2) + THICKNESS) + x;
                            posZ = (THICKNESS / 2) + z;
                            floor = new THREE.Mesh(horizontalFloorGeo, floorMat);
                        }
                        else if (i & 1) {
                            posX = (THICKNESS / 2) + x;
                            posZ = ((SPACE / 2) + THICKNESS) + z;
                            floor = new THREE.Mesh(verticalFloorGeo, floorMat);
                        }
                        else {
                            posX = (THICKNESS / 2) + x;
                            posZ = (THICKNESS / 2) + z;
                            floor = new THREE.Mesh(smallSqrFloorGeo, floorMat);
                        }
                        floor.position.set(posX, y + (THICKNESS / 2), posZ);
                        mazeFloors.push(floor);
                    }
                    else {
                        const lift = liftDefault.clone();
                        const posX = ((SPACE / 2) + THICKNESS) + x;
                        const posZ = ((SPACE / 2) + THICKNESS) + z;
                        lift.position.set(posX, y + (THICKNESS / 2), posZ);
                        mazeLifts.push(lift);

                        // ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
                        // ctx.fillRect(
                        //     MAP_SCALE * (x + THICKNESS),
                        //     MAP_SCALE * (z + THICKNESS),
                        //     MAP_SCALE * SPACE,
                        //     MAP_SCALE * SPACE
                        // );
                    }
                }
            }
        }
        if (h & 1) {
            // add map to DOM
            mapCollector.appendChild(mapPerFloor);
        }
    }

    return [mazeWalls, mazeFloors, mazeLifts];
}