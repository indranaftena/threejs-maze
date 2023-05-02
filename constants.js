import * as THREE from 'three';

export function Constants() {
    this.wall = {
        HEIGHT: 6,
        THICKNESS: 1,
        SPACE: 8,
        MAT: new THREE.MeshLambertMaterial({ color: 0xdd3000 }),
    }
    this.floor = {
        MAT: new THREE.MeshLambertMaterial({ color: 0xdddddd }),
    }
    this.lift = {
        LIFT_MAT: new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.BackSide}),
        ARROW_MAT: new THREE.MeshLambertMaterial({ color: 0x222222 }),
    }
    this.map = {
        SCALE: 5
    }
}