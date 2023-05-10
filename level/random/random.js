import * as THREE from 'three';
import { MazeScene } from '../../init';
import { createMazeAndMap } from '../../mazeBuilder';
import { Constants } from '../../constants';
import { MazeGenerator } from '../../randomMazeGenerator';

const mazeGen = new MazeGenerator(1, 30, 30, [1,1,1]);
mazeGen.generateMaze()
const mazeMatrix = mazeGen.mazeMatrix;

const params = new Constants();
const MAP_SCALE = params.map.SCALE;
const [mazeWalls, mazeFloors, mazeLifts] = createMazeAndMap(mazeMatrix, params);

/* build game world */
const mazeScene = new MazeScene('#bg', mazeWalls, false, MAP_SCALE, mazeFloors, mazeLifts);
mazeScene.animate();
// mazeScene.observation(170, 100);