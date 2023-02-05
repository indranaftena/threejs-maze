import './style.css'

import * as THREE from 'three';

import Stats from 'stats.js';
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

import { mazeWalls, boundingBoxes } from './map';
import { bigMazeWalls } from './bigMap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// camera settings
const cameraDInit = 6;
let cameraD = cameraDInit;
// camera X and Z position + face the object
function cameraPosXZ(d, object) {
  camera.position.z = d * Math.cos(object.rotation.y) + object.position.z;
  camera.position.x = d * Math.sin(object.rotation.y) + object.position.x;
  const cameraAngle = new THREE.Vector3(
    object.position.x,
    object.position.y + 2,
    object.position.z
  );
  camera.lookAt(cameraAngle);
}

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 30, 10);
const ambientLight = new THREE.AmbientLight(0xf0f0f0);
scene.add(pointLight, ambientLight);

// helper
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// floor
const land = new THREE.Mesh(
  new THREE.CircleGeometry(150, 20),
  new THREE.MeshBasicMaterial({ color: 0x222200 })
);
land.rotation.x = -Math.PI / 2;
const posy = 6 * (10 + 3);
land.position.set(posy, 0, posy);
scene.add(land);

// make player object
const TORUS_RAD = 1;
const TORUS_TUBE = 0.5;
const SPHERE_D = 1;
const TORUS_INIT_X = -10;
const TORUS_INIT_Y = TORUS_RAD + TORUS_TUBE;
const TORUS_INIT_Z = 5;
const geometry = new THREE.TorusGeometry(TORUS_RAD, TORUS_TUBE, 8, 50);
const material = new THREE.MeshStandardMaterial({ color: 0x0040FF });
const torus = new THREE.Mesh(geometry, material);
torus.position.set(TORUS_INIT_X, TORUS_INIT_Y, TORUS_INIT_Z)
scene.add(torus);
// bounding sphere for player object
const sphere = new THREE.Sphere(new THREE.Vector3(TORUS_INIT_X, TORUS_INIT_Y, TORUS_INIT_Z),
  TORUS_RAD + TORUS_TUBE + SPHERE_D);
// initial camera position
camera.position.setY(10);
cameraPosXZ(cameraD, torus);

// build maze
const walls = bigMazeWalls();
for (const wall of walls) {
  scene.add(wall);
  // console.log(wall.position, wall.geometry.parameters);
}
// bounding boxes
const wallBBoxes = boundingBoxes(walls);

// box helper
// wallBBoxes.forEach(bBox => {
//   scene.add(new THREE.Box3Helper(bBox));
// });

// map setup
const map = document.getElementById('map');
const mapCircle = document.getElementById('map-circle');
const MAP_SCALE = 3;
const MAP_ORI_WIDTH = 159;
const MAP_ORI_HEIGHT = 159;
const THICKNESS = walls[0].geometry.parameters.depth;

const mapOriginX = 0.5 * THICKNESS * MAP_SCALE;
const mapOriginY = 0.5 * THICKNESS * MAP_SCALE;
const mapInitCenterX = 0.5 * mapCircle.offsetWidth;
const mapInitCenterY = 0.5 * mapCircle.offsetHeight;

map.style.width = `${MAP_ORI_WIDTH * MAP_SCALE}px`;
map.style.height = `${MAP_ORI_HEIGHT * MAP_SCALE}px`;
map.style.top = `${mapInitCenterY - mapOriginY}px`;
map.style.left = `${mapInitCenterX - mapOriginX}px`;

// map movement
function mapMovement(object) {
  const x = -Math.round(object.position.x) * MAP_SCALE;
  const y = -Math.round(object.position.z) * MAP_SCALE;
  map.style.transform = `translate(${x}px, ${y}px)`;
  map.style.transformOrigin = `${mapOriginX}px ${mapOriginY}px`
  map.style.rotate = `${object.rotation.y}rad`;

  const mapHelper = document.getElementById('map-helper');
  mapHelper.style.transformOrigin = '50% 50%';
  mapHelper.style.rotate = `${object.rotation.y}rad`;
}
mapMovement(torus);

// select control elements
const leftTurn = document.getElementById('left');
const rightTurn = document.getElementById('right');
const centerControl = document.getElementById('center');

// mouse on center control
let currentYRotation = torus.rotation.y;
const angleZero = Math.atan(torus.position.y / cameraDInit);
function objectRotate(event) {
  const y = event.offsetY;
  const x = event.offsetX;

  const beta = ((this.offsetHeight - y) / this.offsetHeight) * Math.PI * 90 / 180;
  camera.position.y = cameraDInit * Math.sin(beta - angleZero) + torus.position.y;
  cameraD = cameraDInit * Math.cos(beta - angleZero);

  const middleX = this.offsetWidth / 2;
  torus.rotation.y = currentYRotation + (middleX - x) * (Math.PI * 180 / 180) / middleX

  cameraPosXZ(cameraD, torus);
}
centerControl.onmousemove = objectRotate;

// mouse on side controls
const TURN_RATE = 0.05
let yTurn = 0;
leftTurn.onmouseenter = () => {
  yTurn = TURN_RATE;
};
leftTurn.onmouseleave = () => {
  yTurn = 0;
  currentYRotation = torus.rotation.y - (Math.PI * 180 / 180);
};
rightTurn.onmouseenter = () => {
  yTurn = -TURN_RATE;
};
rightTurn.onmouseleave = () => {
  yTurn = 0;
  currentYRotation = torus.rotation.y + (Math.PI * 180 / 180);
}

// check collisions with any wall
const initPosY = walls[0].position.y;
function checkCollisions(bounders) {
  for (let i = 0; i < bounders.length; i++) {
    if (sphere.intersectsBox(bounders[i])) {
      return true;
    }
  }
  return false;
}

// keyboard inputs
// timer start?
let timerRun = false;
function objectMove(event) {
  // speed
  const walkSpeed = 1;
  const runSpeed = 2 * walkSpeed;
  // move sphere
  if (event.key === 'w') {
    sphere.center.z -= walkSpeed * Math.cos(torus.rotation.y);
    sphere.center.x -= walkSpeed * Math.sin(torus.rotation.y);
  }
  else if (event.key === 'W') {
    sphere.center.z -= runSpeed * Math.cos(torus.rotation.y);
    sphere.center.x -= runSpeed * Math.sin(torus.rotation.y);
  }
  else if (event.key === 's') {
    sphere.center.z += walkSpeed * Math.cos(torus.rotation.y);
    sphere.center.x += walkSpeed * Math.sin(torus.rotation.y);
  }
  else if (event.key === 'd') {
    sphere.center.z -= walkSpeed * Math.sin(torus.rotation.y);
    sphere.center.x += walkSpeed * Math.cos(torus.rotation.y);
  }
  else if (event.key === 'a') {
    sphere.center.z += walkSpeed * Math.sin(torus.rotation.y);
    sphere.center.x -= walkSpeed * Math.cos(torus.rotation.y);
  }

  // test the sphere and walls
  if (checkCollisions(wallBBoxes)) {
    sphere.center.x = torus.position.x;
    sphere.center.z = torus.position.z;
  }
  else {
    torus.position.x = sphere.center.x;
    torus.position.z = sphere.center.z;
  }

  cameraPosXZ(cameraD, torus);
  // mapMovement(torus);

  if (torus.position.x > ((12 * 10) + (13 * 3))) {
    timerRun = false;
  }
  else if (torus.position.x > 0) {
    timerRun = true;
  }
}
document.addEventListener('keydown', objectMove);

// timer
const timerElement = document.getElementById('timer');
let second = 0;
let minute = 0;
let count = 0;
function timer() {

  if (timerRun) {
    count++;

    if (count === 100) {
      second++;
      count = 0;
    }
    if (second === 60) {
      minute++;
      second = 0;
    }

    timerElement.innerHTML = `${minute}&nbsp;:&nbsp;${second}&nbsp;:&nbsp;${count}`;
  }
}

// animate function to continuously render scene
function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  if (yTurn !== 0) {
    torus.rotation.y += yTurn;
    cameraPosXZ(cameraD, torus);
  }

  if (torus.rotation.y > 2 * Math.PI) {
    torus.rotation.y -= 2 * Math.PI;
  }
  else if (torus.rotation.y < -2 * Math.PI) {
    torus.rotation.y += 2 * Math.PI;
  }

  mapMovement(torus);
  timer();

  renderer.render(scene, camera);

  stats.end();
}
animate();