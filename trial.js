import './style.css';

import * as THREE from 'three';
import { Vector3 } from 'three';

import { bigMazeWalls } from './bigMap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// camera position
const pos = 6 * (10 + 3)
camera.position.set(pos, 150, pos);
camera.lookAt(new Vector3(pos, 0, pos));

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-10, 30, -10);
const ambientLight = new THREE.AmbientLight(0x505050);
scene.add(pointLight, ambientLight);

// helper
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// floor
const land = new THREE.Mesh(
  new THREE.CircleGeometry(150, 20),
  new THREE.MeshBasicMaterial({ color: 0x222200 })
);
land.rotation.x = -Math.PI / 2;
land.position.set(pos, 0, pos);
scene.add(land);

// object
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(2, 2, 2),
//     new THREE.MeshLambertMaterial({ color: 0x0077FF })
// );
// scene.add(cube);
const walls = bigMazeWalls();
walls.forEach(wall => {
    scene.add(wall);
});

// animate function to continuously render scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();