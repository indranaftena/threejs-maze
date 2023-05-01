import * as THREE from 'three';
import { MazeScene } from '../../init';

// some constants
const HEIGHT = 8;
const POS_Y = HEIGHT / 2;
const THICKNESS = 3;
const SPACE = 10;

// differ
const X_DIFF = 10;
const Z_DIFF = 22;

// to make wall
function makeWall(width, depth, material, posX, posZ) {
    const wallGeo = new THREE.BoxGeometry(width, HEIGHT, depth);
    const wall = new THREE.Mesh(wallGeo, material);
    wall.position.set(posX, POS_Y, posZ);
    // wall.geometry.computeBoundingBox();
    return wall;
}

const mazeWalls = function () {
    const wallsArray = [];

    // material
    const material = new THREE.MeshStandardMaterial({ color: 0x00aa00 });

    // wall I
    const length1 = (3 * SPACE) + (4 * THICKNESS);
    const posX1 = (SPACE + THICKNESS) / 2 + X_DIFF;
    const posZ1 = -1 * ((2 * SPACE) + (2 * THICKNESS)) + Z_DIFF;
    wallsArray.push(makeWall(length1, THICKNESS, material, posX1, posZ1));

    // wall II
    const length2 = (SPACE + THICKNESS) * 3;
    const posX2 = (SPACE + THICKNESS) * 2 + X_DIFF;
    const posZ2 = -SPACE / 2 + Z_DIFF;
    wallsArray.push(makeWall(THICKNESS, length2, material, posX2, posZ2));

    // wall III
    const length3 = (2 * SPACE) + THICKNESS;
    const posX3 = -1 * (SPACE + THICKNESS) + X_DIFF;
    const posZ3 = 0 + Z_DIFF;
    wallsArray.push(makeWall(THICKNESS, length3, material, posX3, posZ3));

    // wall IV
    const length4 = (2 * SPACE) + (3 * THICKNESS);
    const posX4 = 0 + X_DIFF;
    const posZ4 = -1 * (SPACE + THICKNESS) + Z_DIFF;
    wallsArray.push(makeWall(length4, THICKNESS, material, posX4, posZ4));

    // wall V
    const length5 = length4;
    const posX5 = 0 + X_DIFF;
    const posZ5 = (SPACE + THICKNESS) + Z_DIFF;
    wallsArray.push(makeWall(length5, THICKNESS, material, posX5, posZ5));

    // wall VI
    const length6 = SPACE;
    const posX6 = SPACE + THICKNESS + X_DIFF;
    const posZ6 = (SPACE + THICKNESS) / 2 + Z_DIFF;
    wallsArray.push(makeWall(THICKNESS, length6, material, posX6, posZ6));

    // wall VII
    const length7 = SPACE + (2 * THICKNESS);
    const posX7 = (SPACE + THICKNESS) / 2 + X_DIFF;
    const posZ7 = 0 + Z_DIFF;
    wallsArray.push(makeWall(length7, THICKNESS, material, posX7, posZ7));


    return wallsArray;
}

const walls = mazeWalls();
const mazeScene = new MazeScene('#bg', walls, false);
mazeScene.animate();
// mazeScene.observation(100, 50);
