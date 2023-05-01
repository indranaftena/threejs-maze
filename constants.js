import * as THREE from 'three';

export function Constants() {
    this.mazeConstant = {
        HEIGHT: 6,
        THICKNESS: 1,
        SPACE: 10,
        WALL_MAT: new THREE.MeshLambertMaterial({ color: 0xdd3000 }),
        FLOOR_MAT: new THREE.MeshLambertMaterial({ color: 0xdddddd }),
        LIFT_MAT: new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, side: THREE.BackSide}),
        ARROW_MAT: new THREE.MeshLambertMaterial({ color: 0x222222 }),
    }
    this.mapConstant = {
        MAP_SCALE: 3
    }
}