import * as THREE from 'three';

// some constants
const HEIGHT = 8;
const POS_Y = HEIGHT / 2;
const THICKNESS = 3;
const SPACE = 10;

// to make wall
function makeWall(width, depth, material, posX, posZ) {
    const wallGeo = new THREE.BoxGeometry(width, HEIGHT, depth);
    const wall = new THREE.Mesh(wallGeo, material);
    wall.position.set(posX, POS_Y, posZ);
    wall.geometry.computeBoundingBox();
    return wall;
}

export const mazeWalls = function () {
    const wallsArray = [];

    // material
    const material = new THREE.MeshStandardMaterial({ color: 0x00aa00 });

    // wall I
    const length1 = (3 * SPACE) + (4 * THICKNESS);
    const posX1 = (SPACE + THICKNESS) / 2;
    const posZ1 = -1 * ((2 * SPACE) + (2 * THICKNESS));
    wallsArray.push(makeWall(length1, THICKNESS, material, posX1, posZ1));

    // wall II
    const length2 = (SPACE + THICKNESS) * 3;
    const posX2 = (SPACE + THICKNESS) * 2;
    const posZ2 = -SPACE / 2;
    wallsArray.push(makeWall(THICKNESS, length2, material, posX2, posZ2));

    // wall III
    const length3 = (2 * SPACE) + THICKNESS;
    const posX3 = -1 * (SPACE + THICKNESS);
    const posZ3 = 0;
    wallsArray.push(makeWall(THICKNESS, length3, material, posX3, posZ3));

    // wall IV
    const length4 = (2 * SPACE) + (3 * THICKNESS);
    const posX4 = 0;
    const posZ4 = -1 * (SPACE + THICKNESS);
    wallsArray.push(makeWall(length4, THICKNESS, material, posX4, posZ4));

    // wall V
    const length5 = length4;
    const posX5 = 0;
    const posZ5 = -posZ4;
    wallsArray.push(makeWall(length5, THICKNESS, material, posX5, posZ5));

    // wall VI
    const length6 = SPACE;
    const posX6 = SPACE + THICKNESS;
    const posZ6 = (SPACE + THICKNESS) / 2;
    wallsArray.push(makeWall(THICKNESS, length6, material, posX6, posZ6));

    // wall VII
    const length7 = SPACE + (2 * THICKNESS);
    const posX7 = (SPACE + THICKNESS) / 2;
    const posZ7 = 0;
    wallsArray.push(makeWall(length7, THICKNESS, material, posX7, posZ7));


    return wallsArray;
}

export const boundingBoxes = function (objectArray) {
    const bBoxes = [];

    for (let i = 0; i < objectArray.length; i++) {
        const bBox = new THREE.Box3();
        bBox.setFromObject(objectArray[i]);
        bBoxes.push(bBox);
    }

    return bBoxes;
}