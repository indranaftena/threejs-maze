import * as THREE from 'three';
import { MazeScene } from '../../init';
import { createMazeAndMap } from '../../mazeBuilder';
import { Constants } from '../../constants';
import { MazeGenerator } from '../../randomMazeGenerator';

// document.querySelector("body").style.display = "none";

const mazeGen = new MazeGenerator(1, 30, 30, [1,1,1]);
mazeGen.generateMaze()
const mazeMatrix = mazeGen.mazeMatrix;

const params = new Constants();
const MAP_SCALE = params.map.SCALE;
const maze = createMazeAndMap(mazeMatrix, params);

/* build game world */
const mazeScene = new MazeScene('#bg', maze, true, MAP_SCALE);

// document.querySelector("body").style.display = "block";

mazeScene.animate();
// mazeScene.observation(190, 130);