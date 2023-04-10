import * as THREE from 'three';

// some constants
const HEIGHT = 8;
const POS_Y = HEIGHT / 2;
const THICKNESS = 3;
const SPACE = 10;

// wall's material
const material = new THREE.MeshLambertMaterial({ color: 0x00aa30 });

// to make wall
function makeWall(wallStat) {
    const { width, depth, posX, posZ } = wallStat;
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(width, HEIGHT, depth),
        material
    );
    wall.position.set(posX, POS_Y, posZ);
    // wall.geometry.computeBoundingBox();
    return wall;
}

// the map
export function mazeWalls() {
    const walls = [];

    // horizontal

    // h_first
    walls.push(makeWall({
        width: (12 * SPACE) + (13 * THICKNESS),
        depth: THICKNESS,
        posX: (6 * SPACE) + (6 * THICKNESS),
        posZ: 0,
    }));

    // h_second
    walls.push(makeWall({
        width: (3 * SPACE) + (4 * THICKNESS),
        depth: THICKNESS,
        posX: 1.5 * (SPACE + THICKNESS),
        posZ: SPACE + THICKNESS,
    }));

    // h_third
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        depth: THICKNESS,
        posX: 4.5 * (SPACE + THICKNESS),
        posZ: SPACE + THICKNESS,
    }));

    // h_fourth
    walls.push(makeWall({
        width: (4 * SPACE) + (5 * THICKNESS),
        posX: 9 * (SPACE + THICKNESS),
        posZ: SPACE + THICKNESS,
        depth: THICKNESS,
    }));

    // h_fifth
    walls.push(makeWall({
        width: (2 * SPACE) + (3 * THICKNESS),
        posX: 3 * (SPACE + THICKNESS),
        posZ: 2 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_sixth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 8.5 * (SPACE + THICKNESS),
        posZ: 2 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_seventh
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 2.5 * (SPACE + THICKNESS),
        posZ: 3 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_eighth
    walls.push(makeWall({
        width: (2 * SPACE) + (3 * THICKNESS),
        posX: 9 * (SPACE + THICKNESS),
        posZ: 3 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_ninth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 11.5 * (SPACE + THICKNESS),
        posZ: 3 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_tenth
    walls.push(makeWall({
        width: (5 * SPACE) + (6 * THICKNESS),
        posX: 3.5 * (SPACE + THICKNESS),
        posZ: 4 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_eleventh
    walls.push(makeWall({
        width: (3 * SPACE) + (4 * THICKNESS),
        posX: 8.5 * (SPACE + THICKNESS),
        posZ: 4 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twelfth
    walls.push(makeWall({
        width: (2 * SPACE) + (3 * THICKNESS),
        posX: 2 * (SPACE + THICKNESS),
        posZ: 5 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_thirteenth
    walls.push(makeWall({
        width: (3 * SPACE) + (4 * THICKNESS),
        posX: 7.5 * (SPACE + THICKNESS),
        posZ: 5 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_fourteenth
    walls.push(makeWall({
        width: (2 * SPACE) + (3 * THICKNESS),
        posX: SPACE + THICKNESS,
        posZ: 6 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_fifteenth
    walls.push(makeWall({
        width: (2 * SPACE) + (3 * THICKNESS),
        posX: 9 * (SPACE + THICKNESS),
        posZ: 6 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_sixteenth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 11.5 * (SPACE + THICKNESS),
        posZ: 6 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_seventeenth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 1.5 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_eighteenth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 4.5 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_nineteenth
    walls.push(makeWall({
        width: (4 * SPACE) + (5 * THICKNESS),
        posX: 10 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twentieth 
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 9.5 * (SPACE + THICKNESS),
        posZ: 8 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_first = {
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 2.5 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_second
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 6.5 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_third
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 8.5 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_fourth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 10.5 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_fifth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 3.5 * (SPACE + THICKNESS),
        posZ: 10 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_sixth 
    walls.push(makeWall({
        width: (3 * SPACE) + (4 + THICKNESS),
        posX: 6.5 * (SPACE + THICKNESS),
        posZ: 10 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_seventh 
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 9.5 * (SPACE + THICKNESS),
        posZ: 10 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_eighth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 11.5 * (SPACE + THICKNESS),
        posZ: 8 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_twenty_ninth
    walls.push(makeWall({
        width: (6 * SPACE) + (7 * THICKNESS),
        posX: 4 * (SPACE + THICKNESS),
        posZ: 11 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_thirtieth
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 8.5 * (SPACE + THICKNESS),
        posZ: 11 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_thirty_first
    walls.push(makeWall({
        width: SPACE + (2 * THICKNESS),
        posX: 10.5 * (SPACE + THICKNESS),
        posZ: 11 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // h_thirty_second = {
    walls.push(makeWall({
        width: (12 * SPACE) + (13 * THICKNESS),
        posX: 6 * (SPACE + THICKNESS),
        posZ: 12 * (SPACE + THICKNESS),
        depth: THICKNESS,
    }));

    // vertical

    // v_first 
    walls.push(makeWall({
        depth: (11 * SPACE) + (12 * THICKNESS),
        posX: 0,
        posZ: 6.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_second
    walls.push(makeWall({
        depth: (3 * SPACE) + (4 * THICKNESS),
        posX: SPACE + THICKNESS,
        posZ: 3.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_third
    walls.push(makeWall({
        depth: (4 * SPACE) + (5 * THICKNESS),
        posX: SPACE + THICKNESS,
        posZ: 9 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_fourth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 2 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_fifth 
    walls.push(makeWall({
        depth: (5 * SPACE) + (6 * THICKNESS),
        posX: 3 * (SPACE + THICKNESS),
        posZ: 7.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_sixth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 4 * (SPACE + THICKNESS),
        posZ: 2 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_seventh
    walls.push(makeWall({
        depth: (4 * SPACE) + (5 * THICKNESS),
        posX: 4 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_eighth
    walls.push(makeWall({
        depth: (5 * SPACE) + (6 * THICKNESS),
        posX: 5 * (SPACE + THICKNESS),
        posZ: 3.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_ninth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 5 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_tenth
    walls.push(makeWall({
        depth: (3 * SPACE) + (4 * THICKNESS),
        posX: 6 * (SPACE + THICKNESS),
        posZ: 1.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_eleventh
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 6 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twelfth
    walls.push(makeWall({
        depth: (3 * SPACE) + (4 * THICKNESS),
        posX: 7 * (SPACE + THICKNESS),
        posZ: 2.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_thirteenth
    walls.push(makeWall({
        depth: (4 * SPACE) + (5 * THICKNESS),
        posX: 7 * (SPACE + THICKNESS),
        posZ: 7 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_fourteenth
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 8 * (SPACE + THICKNESS),
        posZ: 2.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_fifteenth
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 8 * (SPACE + THICKNESS),
        posZ: 6.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_sixteenth
    walls.push(makeWall({
        depth: (3 * SPACE) + (4 * THICKNESS),
        posX: 8 * (SPACE + THICKNESS),
        posZ: 9.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_seventeenth
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 9 * (SPACE + THICKNESS),
        posZ: 9.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_eighteenth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 10 * (SPACE + THICKNESS),
        posZ: 2 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_nineteenth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 10 * (SPACE + THICKNESS),
        posZ: 5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twentieth
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 10 * (SPACE + THICKNESS),
        posZ: 8.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_first
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 10 * (SPACE + THICKNESS),
        posZ: 10.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_second
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 11 * (SPACE + THICKNESS),
        posZ: 1.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_third
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 11 * (SPACE + THICKNESS),
        posZ: 5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_fourth
    walls.push(makeWall({
        depth: (2 * SPACE) + (3 * THICKNESS),
        posX: 11 * (SPACE + THICKNESS),
        posZ: 9 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_fifth
    walls.push(makeWall({
        depth: SPACE + (2 * THICKNESS),
        posX: 11 * (SPACE + THICKNESS),
        posZ: 11.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_sixth
    walls.push(makeWall({
        depth: (8 * SPACE) + (9 * THICKNESS),
        posX: 12 * (SPACE + THICKNESS),
        posZ: 4 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    // v_twenty_seventh
    walls.push(makeWall({
        depth: (3 * SPACE) + (4 * THICKNESS),
        posX: 12 * (SPACE + THICKNESS),
        posZ: 10.5 * (SPACE + THICKNESS),
        width: THICKNESS,
    }));

    return walls;
}