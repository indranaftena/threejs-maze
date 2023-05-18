import './style.css'
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

import Stats from 'stats.js';

export function MazeScene(canvas, maze, useTimer = false, mapScale = 0) {

    /* stat */
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    /* scene setup */
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x020212);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.5, 1000);
    this.renderer = new THREE.WebGL1Renderer({
        canvas: document.querySelector(canvas),
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    /* camera settings */
    this.cameraDInit = 6;
    this.cameraD = this.cameraDInit;
    this.cameraPosXZ = function (d, object) {
        this.camera.position.z = d * Math.cos(object.rotation.y) + object.position.z;
        this.camera.position.x = d * Math.sin(object.rotation.y) + object.position.x;
        const cameraAngle = new THREE.Vector3(
            object.position.x,
            object.position.y + 2,
            object.position.z
        );
        this.camera.lookAt(cameraAngle);
    }

    /* lighting */
    this.pointLight = new THREE.PointLight(0xffffff, 1);
    this.pointLight.position.set(10000, 1, 0);
    this.ambientLight = new THREE.AmbientLight(0xd0d0d0);
    this.scene.add(this.pointLight, this.ambientLight);

    /* sky */
    this.sky = new Sky();
    this.sky.scale.setScalar(4500);
    this.sky.material.uniforms.turbidity.value = 10;
    this.sky.material.uniforms.rayleigh.value = 3;
    this.sky.material.uniforms.mieCoefficient.value = 0.005;
    this.sky.material.uniforms.sunPosition.value = new THREE.Vector3(50, -1, 0)
    
    this.scene.add(this.sky);

    /* floor */
    this.minY = 0
    if (maze.floors) {
        this.scene.add(...maze.floors);
        this.minY = maze.floors[0].geometry.parameters.height;
    }

    /* bounding boxes */
    this.finishLine = 0;
    this.boundingBoxes = function (objectArray) {
        const bBoxes = [];

        for (let i = 0; i < objectArray.length; i++) {
            const bBox = new THREE.Box3();
            bBox.setFromObject(objectArray[i]);
            bBoxes.push(bBox);
            if (bBox.max.x > this.finishLine) {
                this.finishLine = bBox.max.x;
            }
        }

        return bBoxes;
    }

    /* build maze */
    this.wallBBoxes = {};
    for (let i = 0; i < maze.walls.length; i++) {
        this.scene.add(...maze.walls[i]);
        this.wallBBoxes[i + 1] = this.boundingBoxes(maze.walls[i]);
    }

    /* floor height */
    this.floorDiff = this.minY + maze.walls[0][0].geometry.parameters.height;

    /* lifts */
    if (maze.lifts) this.scene.add(...maze.lifts);
    this.liftBBoxes = this.boundingBoxes(maze.lifts);

    /* torus player object */
    this.TORUS_RAD = 1;
    this.TORUS_TUBE = 0.5;
    this.TORUS_OUTER = this.TORUS_RAD + this.TORUS_TUBE;
    this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(this.TORUS_RAD, this.TORUS_TUBE, 8, 50),
        new THREE.MeshStandardMaterial({ color: 0x0040FF })
    );
    this.torus.position.set(-10, this.minY + this.TORUS_OUTER, 5);
    this.scene.add(this.torus);
    this.minTorusBox = new THREE.Vector3().addVectors(
        this.torus.position,
        new THREE.Vector3(
            -this.TORUS_OUTER,
            -this.TORUS_OUTER,
            -this.TORUS_OUTER
        )
    )
    this.maxTorusBox = new THREE.Vector3().addVectors(
        this.torus.position,
        new THREE.Vector3(
            this.TORUS_OUTER,
            this.TORUS_OUTER,
            this.TORUS_OUTER
        )
    )
    this.torusBox = new THREE.Box3(this.minTorusBox, this.maxTorusBox);
    /* torus current floor */
    this.torusCurrentFloor = 1;
    /* camera position from torus */
    this.camera.position.setY(10);
    this.cameraPosXZ(this.cameraD, this.torus);

    /* canvas control */
    this.canvasControl = document.getElementById('canvas-control');
    this.playButton = document.getElementById('play-button');
    this.playButton.addEventListener('click', async () => {
        if (!document.pointerLockElement) {
            try {
                await this.canvasControl.requestPointerLock({
                    unadjustedMovement: true,
                });
            } catch (error) {
                if (error.name === 'NotSupportedError') {
                    this.canvasControl.requestPointerLock();
                }
            }
        }
    });

    /* object and camera orientation */
    this.angleZero = Math.asin(this.torus.position.y / this.cameraDInit);
    this.objectOrientation = (event) => {
        const maxAngle = (Math.PI / 2) - 0.2;
        // const minAngle = -Math.asin((this.TORUS_RAD + this.TORUS_TUBE) / this.cameraDInit) * 2;
        const minAngle = -(Math.PI / 5);
        this.angleZero -= event.movementY * 0.01;
        if (this.angleZero < maxAngle && this.angleZero > minAngle) {
            this.camera.position.y = this.cameraDInit * Math.sin(this.angleZero) + this.torus.position.y;
            this.cameraD = this.cameraDInit * Math.cos(this.angleZero);
        }
        else if (this.angleZero >= maxAngle) {
            this.angleZero = maxAngle;
        }
        else if (this.angleZero <= minAngle) {
            this.angleZero = minAngle;
        }
        this.torus.rotation.y -= event.movementX * 0.01;
        if (this.torus.rotation.y > 2 * Math.PI) {
            this.torus.rotation.y -= 2 * Math.PI;
        }
        else if (this.torus.rotation.y < -2 * Math.PI) {
            this.torus.rotation.y += 2 * Math.PI;
        }

        this.cameraPosXZ(this.cameraD, this.torus);
    }

    /* mini map initialization */
    this.miniMap = document.getElementById('map-1');
    this.miniMap.style.display = "block";
    this.mapIndicator = document.getElementById('floor-number');
    this.mapIndicator.innerText = this.torusCurrentFloor;
    /* mini map change if go up or down */
    this.changeMap = (nextMap) => {
        this.miniMap.style.display = "none";
        this.miniMap = document.getElementById(nextMap);
        this.miniMap.style.display = "block";
    }

    /* up or down floor function */
    this.goUpFloor = () => {
        this.torus.position.y += this.floorDiff;
        this.torusBox.min.y += this.floorDiff;
        this.torusBox.max.y += this.floorDiff;
        this.camera.position.y += this.floorDiff;
    }
    this.goDownFloor = () => {
        this.torus.position.y -= this.floorDiff;
        this.torusBox.min.y -= this.floorDiff;
        this.torusBox.max.y -= this.floorDiff;
        this.camera.position.y -= this.floorDiff;
    }

    /* click lift arrow function */
    this.arrowsTemp = null;
    this.activeArrowZ = 0;
    this.moveZ = () => {
        if (this.arrowsTemp && this.activeArrowZ) {
            if (this.torus.position.y < this.activeArrowZ) {
                this.goUpFloor();
                this.torusCurrentFloor++;
            }
            else {
                this.goDownFloor();
                this.torusCurrentFloor--;
            }
            this.changeMap(`map-${this.torusCurrentFloor}`);
            this.mapIndicator.innerText = this.torusCurrentFloor;
        }

        /* test any lift activated */
        this.isInsideLift(this.torusBox, this.liftBBoxes);
    }
    this.canvasControl.addEventListener('click', this.moveZ, false);


    /* raycaster lift's arrows */
    this.liftRayCaster = (activeLifts) => {
        const activeArrows = [];
        for (let i = 0; i < activeLifts.length; i++) {
            activeArrows.push(...activeLifts[i].children);
        }

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(0, 0);

        raycaster.setFromCamera(pointer, this.camera);

        const pointed = raycaster.intersectObjects(activeArrows);

        if (pointed.length > 0) {
            if (this.arrowsTemp) this.arrowsTemp.object.material.color.set(0x222222);
            this.arrowsTemp = pointed[pointed.length - 1];
            this.arrowsTemp.object.material.color.set(0xffff00);
            // console.log(this.arrowsTemp.object.matrixWorld.elements[13]);
            this.activeArrowZ = this.arrowsTemp.object.matrixWorld.elements[13];
        }
        else {
            if (this.arrowsTemp) {
                this.arrowsTemp.object.material.color.set(0x222222);
                this.arrowsTemp = null;
                this.activeArrowZ = 0;
            }
        }
    }

    /* check if any lift contains player object */
    this.liftTemp = [];
    this.crosshair = document.getElementById("crosshair");
    this.isInsideLift = (object, bounders) => {
        const activatedLifts = []
        for (let i = 0; i < bounders.length; i++) {
            if (bounders[i].containsBox(object)) {
                activatedLifts.push(maze.lifts[i]);
            }
        }
        if (activatedLifts.length > 0) {
            if (this.liftTemp.length > 0) {
                for (let i = 0; i < this.liftTemp.length; i++) {
                    this.liftTemp[i].visible = false;
                }
            }
            this.liftTemp = activatedLifts;
            for (let i = 0; i < this.liftTemp.length; i++) {
                this.liftTemp[i].visible = true;
            }
            this.crosshair.style.display = "block";
        }
        else {
            if (this.liftTemp.length > 0) {
                for (let i = 0; i < this.liftTemp.length; i++) {
                    this.liftTemp[i].visible = false;
                }
                this.liftTemp.length = 0;
            }
            this.crosshair.style.display = "none";
        }
    }

    /* check collisions with any wall */
    this.checkCollisions = function (object, bounders) {
        for (let i = 0; i < bounders.length; i++) {
            if (object.intersectsBox(bounders[i])) {
                return true;
            }
        }
        return false;
    }

    /* keyboard inputs */
    /* timer start? */
    this.timerRun = false;
    this.playing = false;
    this.winning = false;
    this.movement = {
        onward: false,
        back: false,
        right: false,
        left: false
    }
    this.moveInput = (event) => {
        if (event.key === 'w') {
            this.movement.onward = true;
        }
        if (event.key === 's') {
            this.movement.back = true;
        }
        if (event.key === 'd') {
            this.movement.right = true;
        }
        if (event.key === 'a') {
            this.movement.left = true;
        }
    }
    this.stopInput = (event) => {
        if (event.key === 'w') {
            this.movement.onward = false;
        }
        if (event.key === 's') {
            this.movement.back = false;
        }
        if (event.key === 'd') {
            this.movement.right = false;
        }
        if (event.key === 'a') {
            this.movement.left = false;
        }
    }
    this.objectMove = () => {
        /* speed */
        const walkSpeed = 0.3;
        /* move sphere in x axis */
        if (this.movement.onward) {
            this.torusBox.min.x -= walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusBox.max.x -= walkSpeed * Math.sin(this.torus.rotation.y);
        }
        if (this.movement.back) {
            this.torusBox.min.x += walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusBox.max.x += walkSpeed * Math.sin(this.torus.rotation.y);
        }
        if (this.movement.right) {
            this.torusBox.min.x += walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusBox.max.x += walkSpeed * Math.cos(this.torus.rotation.y);
        }
        if (this.movement.left) {
            this.torusBox.min.x -= walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusBox.max.x -= walkSpeed * Math.cos(this.torus.rotation.y);
        }

        /* test the sphere and the walls */
        if (this.checkCollisions(this.torusBox, this.wallBBoxes[this.torusCurrentFloor])) {
            this.torusBox.min.x = this.torus.position.x - this.TORUS_OUTER;
            this.torusBox.max.x = this.torus.position.x + this.TORUS_OUTER;
        }
        else {
            this.torus.position.x = this.torusBox.min.x + this.TORUS_OUTER;
        }

        /* move sphere in z axis */
        if (this.movement.onward) {
            this.torusBox.min.z -= walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusBox.max.z -= walkSpeed * Math.cos(this.torus.rotation.y);
        }
        if (this.movement.back) {
            this.torusBox.min.z += walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusBox.max.z += walkSpeed * Math.cos(this.torus.rotation.y);
        }
        if (this.movement.right) {
            this.torusBox.min.z -= walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusBox.max.z -= walkSpeed * Math.sin(this.torus.rotation.y);
        }
        if (this.movement.left) {
            this.torusBox.min.z += walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusBox.max.z += walkSpeed * Math.sin(this.torus.rotation.y);
        }

        /* test the sphere and the walls */
        if (this.checkCollisions(this.torusBox, this.wallBBoxes[this.torusCurrentFloor])) {
            this.torusBox.min.z = this.torus.position.z - this.TORUS_OUTER;
            this.torusBox.max.z = this.torus.position.z + this.TORUS_OUTER;
        }
        else {
            this.torus.position.z = this.torusBox.min.z + this.TORUS_OUTER;
        }

        /* test any lift activated */
        this.isInsideLift(this.torusBox, this.liftBBoxes);

        this.cameraPosXZ(this.cameraD, this.torus);

        if (this.torus.position.x > this.finishLine) {
            this.winning = true;
        }
        if (this.torus.position.x > 0) {
            this.timerRun = true;
        }
    }

    /* add and remove move event listener */
    this.lockChangeAlert = () => {
        let tempControl = document.getElementById('canvas-control');
        const starter = document.getElementById('starter');
        if (document.pointerLockElement === tempControl) {
            console.log('Pointer is locked');
            starter.style.display = 'none';
            document.addEventListener('mousemove', this.objectOrientation, false);
            document.addEventListener('keydown', this.moveInput, false);
            document.addEventListener('keyup', this.stopInput, false);
            this.playing = true;
        }
        else {
            console.log('Pointer is unlocked');
            starter.style.display = 'flex';
            document.removeEventListener('mousemove', this.objectOrientation, false);
            document.removeEventListener('keydown', this.moveInput, false);
            document.removeEventListener('keyup', this.stopInput, false);
            this.playing = false;
        }
    }
    document.addEventListener('pointerlockchange', this.lockChangeAlert, false);

    /* mini map */
    const mapCollector = document.getElementById('map');
    const mapCircle = document.getElementById('map-circle');
    const mapHelperElement = document.getElementById('map-helper');
    const mapInitCenterX = 0.5 * mapCircle.offsetWidth;
    const mapInitCenterY = 0.5 * mapCircle.offsetHeight;
    mapCollector.style.top = `${mapInitCenterY}px`;
    mapCollector.style.left = `${mapInitCenterX}px`;

    this.mapMovement = (object) => {
        // const x = -Math.round(object.position.x * mapScale);
        // const y = -Math.round(object.position.z * mapScale);
        const x = -object.position.x * mapScale;
        const y = -object.position.z * mapScale;
        mapCollector.style.transform = `translate(${x}px, ${y}px)`;
        mapCollector.style.transformOrigin = "0 0"
        mapCollector.style.rotate = `${object.rotation.y}rad`;
    }

    this.mapHelper = (object) => {
        mapHelperElement.style.transformOrigin = '50% 50%';
        mapHelperElement.style.rotate = `${object.rotation.y}rad`;
    }

    /* timer */
    this.timerElement = document.getElementById('timer');
    this.second = 0;
    this.minute = 0;
    this.count = 0;
    this.timer = () => {
        if (this.timerRun && this.playing && !this.winning) {
            this.count++;
            if (this.count === 100) {
                this.second++;
                this.count = 0;
            }
            if (this.second === 60) {
                this.minute++;
                this.second = 0;
            }
            this.timerElement.innerHTML = `${this.minute}&nbsp;:&nbsp;${this.second}&nbsp;:&nbsp;${this.count}`;

        }
    }

    /* axis helper */
    // this.scene.add(new THREE.AxesHelper(5));

    /* window resize handler */
    this.onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', this.onWindowResize, false);

    /* animation function */
    this.animate = () => {
        requestAnimationFrame(this.animate);

        this.stats.begin();

        this.objectMove();

        if (mapScale) this.mapMovement(this.torus);
        this.mapHelper(this.torus);

        if (useTimer) this.timer();

        this.liftRayCaster(this.liftTemp);

        this.renderer.render(this.scene, this.camera);

        this.stats.end();
    }

    /* make maze camera view */
    this.observation = (y, xz) => {
        this.camera.position.set(xz, y, xz);
        this.camera.lookAt(new THREE.Vector3(xz, 0, xz));
        this.renderer.render(this.scene, this.camera);
    }
}