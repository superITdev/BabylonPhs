import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction } from 'babylonjs';
import 'babylonjs-loaders';
import PrimitiveUI from './PrimitiveUI';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new Engine(canvas, true, {});
const scene = new Scene(engine);

const primitiveUI = new PrimitiveUI()

function prepareScene() {
	// Camera
	const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

	// Light
	new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

	// Objects
	const cube = MeshBuilder.CreateBox("Cube", {}, scene);
	cube.position.set(0, 0, 0);

	const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);
	icosphere.position.set(-2, 0, 0);

	const cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, scene);
	cylinder.position.set(2, 0, 0);

	// Actions
	cube.actionManager = new ActionManager(scene);
	cube.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.OpenCubeUI(cube);
	}));

	icosphere.actionManager = new ActionManager(scene);
	icosphere.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.OpenIcoSphereUI(icosphere);
	}));

	cylinder.actionManager = new ActionManager(scene);
	cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.OpenCylinderUI(cylinder);
	}));
}

prepareScene();

engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
});