import './style.css'
import * as THREE from 'three';

import Stats from 'stats.js';

export function MazeScene(walls, canvas, useTimer = false, mapScale = 0) {

    /* stat */
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    /* scene setup */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020212);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
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
    this.pointLight = new THREE.PointLight(0xffffff, 0.7);
    this.pointLight.position.set(10, 30, 10);
    this.ambientLight = new THREE.AmbientLight(0xd0d0d0);
    this.scene.add(this.pointLight, this.ambientLight);

    /* floor */
    this.land = new THREE.Mesh(
        new THREE.CircleGeometry(150, 20),
        new THREE.MeshBasicMaterial({ color: 0x222200 })
    );
    this.land.rotation.x = -Math.PI / 2;
    this.posy = 6 * (10 + 3);
    this.land.position.set(this.posy, 0, this.posy);
    this.scene.add(this.land);

    /* torus player object */
    this.TORUS_RAD = 1;
    this.TORUS_TUBE = 0.5;
    this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(this.TORUS_RAD, this.TORUS_TUBE, 8, 50),
        new THREE.MeshStandardMaterial({ color: 0x0040FF })
    );
    this.torus.position.set(-10, this.TORUS_RAD + this.TORUS_TUBE, 5);
    this.scene.add(this.torus);
    this.torusSphere = new THREE.Sphere(
        new THREE.Vector3(-10, this.TORUS_RAD + this.TORUS_TUBE, 5),
        1.5
    );
    /* camera position from torus */
    this.camera.position.setY(10);
    this.cameraPosXZ(this.cameraD, this.torus);

    /* build maze */
    this.scene.add(...walls);
    /* bounding boxes */
    this.boundingBoxes = function (objectArray) {
        const bBoxes = [];

        for (let i = 0; i < objectArray.length; i++) {
            const bBox = new THREE.Box3();
            bBox.setFromObject(objectArray[i]);
            bBoxes.push(bBox);
            // for debugging
            // console.log(objectArray[i].position.x, objectArray[i].position.z);
        }

        return bBoxes;
    }
    this.wallBBoxes = this.boundingBoxes(walls);

    /* canvas control */
    this.canvasControl = document.getElementById('canvas-control');
    this.canvasControl.addEventListener('click', async () => {
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
        const minAngle = -Math.asin((this.TORUS_RAD + this.TORUS_TUBE) / this.cameraDInit);
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
    this.objectMove = (event) => {
        /* speed */
        const walkSpeed = 1;
        const runSpeed = 2 * walkSpeed;
        /* move sphere */
        if (event.key === 'w') {
            this.torusSphere.center.z -= walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusSphere.center.x -= walkSpeed * Math.sin(this.torus.rotation.y);
        }
        else if (event.key === 'W') {
            this.torusSphere.center.z -= runSpeed * Math.cos(this.torus.rotation.y);
            this.torusSphere.center.x -= runSpeed * Math.sin(this.torus.rotation.y);
        }
        else if (event.key === 's') {
            this.torusSphere.center.z += walkSpeed * Math.cos(this.torus.rotation.y);
            this.torusSphere.center.x += walkSpeed * Math.sin(this.torus.rotation.y);
        }
        else if (event.key === 'd') {
            this.torusSphere.center.z -= walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusSphere.center.x += walkSpeed * Math.cos(this.torus.rotation.y);
        }
        else if (event.key === 'a') {
            this.torusSphere.center.z += walkSpeed * Math.sin(this.torus.rotation.y);
            this.torusSphere.center.x -= walkSpeed * Math.cos(this.torus.rotation.y);
        }

        /* test the sphere and the walls */
        if (this.checkCollisions(this.torusSphere, this.wallBBoxes)) {
            this.torusSphere.center.x = this.torus.position.x;
            this.torusSphere.center.z = this.torus.position.z;
        }
        else {
            this.torus.position.x = this.torusSphere.center.x;
            this.torus.position.z = this.torusSphere.center.z;
        }

        this.cameraPosXZ(this.cameraD, this.torus);

        if (this.torus.position.x > ((12 * 10) + (13 * 3))) {
            this.timerRun = false;
        }
        else if (this.torus.position.x > 0) {
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
            document.addEventListener('keydown', this.objectMove, false);
            this.playing = true;
        }
        else {
            console.log('Pointer is unlocked');
            starter.style.display = 'block';
            document.removeEventListener('mousemove', this.objectOrientation, false);
            document.removeEventListener('keydown', this.objectMove, false);
            this.playing = false;
        }
    }
    document.addEventListener('pointerlockchange', this.lockChangeAlert, false);

    /* mini map */
    const map = document.getElementById('map');
    const mapCircle = document.getElementById('map-circle');
    const mapHelper = document.getElementById('map-helper');
    const mapInitCenterX = 0.5 * mapCircle.offsetWidth;
    const mapInitCenterY = 0.5 * mapCircle.offsetHeight;
    map.style.top = `${mapInitCenterY}px`;
    map.style.left = `${mapInitCenterX}px`;

    this.mapMovement = (object) => {
        const x = -Math.round(object.position.x * mapScale);
        const y = -Math.round(object.position.z * mapScale);
        map.style.transform = `translate(${x}px, ${y}px)`;
        map.style.transformOrigin = "0 0"
        map.style.rotate = `${object.rotation.y}rad`;

        mapHelper.style.transformOrigin = '50% 50%';
        mapHelper.style.rotate = `${object.rotation.y}rad`;
    }

    /* timer */
    this.timerElement = document.getElementById('timer');
    this.second = 0;
    this.minute = 0;
    this.count = 0;
    this.timer = () => {
        if (this.timerRun && this.playing) {
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
    this.scene.add(new THREE.AxesHelper(5));

    /* animation function */
    this.animate = () => {
        requestAnimationFrame(this.animate);

        this.stats.begin();

        if (mapScale) this.mapMovement(this.torus);

        if (useTimer) this.timer();

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