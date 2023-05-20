import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, ActionManager, ExecuteCodeAction, TransformNode } from 'babylonjs';
import 'babylonjs-loaders';
import PrimitiveUI from './features/PrimitiveUI';

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
	const cubeMesh = MeshBuilder.CreateBox("CubeMesh", {}, scene);
	const cubeNode = cubeMesh.parent = new TransformNode('CubeNode', scene);
	cubeNode.position.set(0, 0, 0);

	const icosphereMesh = MeshBuilder.CreateIcoSphere("IcoSphereMesh", {}, scene);
	const icosphereNode = icosphereMesh.parent = new TransformNode('IcoSphereNode', scene);
	icosphereNode.position.set(-2, 0, 0);

	const cylinderMesh = MeshBuilder.CreateCylinder("CylinderMesh", {}, scene);
	const cylinderNode = cylinderMesh.parent = new TransformNode('CylinderNode', scene);
	cylinderNode.position.set(2, 0, 0);

	// Actions
	cubeMesh.actionManager = new ActionManager(scene);
	cubeMesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.openCubeUI(cubeMesh);
	}));

	icosphereMesh.actionManager = new ActionManager(scene);
	icosphereMesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.openIcoSphereUI(icosphereMesh);
	}));

	cylinderMesh.actionManager = new ActionManager(scene);
	cylinderMesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
		primitiveUI.openCylinderUI(cylinderMesh);
	}));
}

prepareScene();

engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener("resize", () => {
	engine.resize();
});