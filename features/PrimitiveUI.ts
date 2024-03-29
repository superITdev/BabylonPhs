import { Mesh, TransformNode, VertexData } from "babylonjs";
import GUI from "lil-gui";
import { applyBouncing } from "./AnimeUtil";

// constants
const VALUE_STEP = 0.01;

/**
 * UI window manager for primitive parmaters adjustment
 */
export default class PrimitiveUI {
    /** UI panel */
    private gui: GUI | undefined;
    /** privmitive parameters */
    private meshOptions = new Map<Mesh, any>();
    /** target mesh adjusting on this UI */
    private mesh: Mesh | undefined;

    get options() {
        return this.meshOptions.get(this.mesh!);
    }
    set options(options: any) {
        this.meshOptions.set(this.mesh!, options);
    }

    private getTransformNode() {
        return this.mesh?.parent as TransformNode;
    }

    private createCommonUI(mesh: Mesh) {
        if (this.gui) {
            this.gui.destroy();
        }
        this.gui = new GUI({ title: 'Options' });
        this.mesh = mesh;
        if (!this.options) {
            this.options = {};
        }
    }

    private appendAnimateUI() {
        const { amplitude = 5, duration = 1000, bounces = 5 } = this.options || {};

        const options = Object.assign(this.options, {
            amplitude,
            duration,
            bounces,

            apply: () => {
                applyBouncing(this.getTransformNode(), options.amplitude, options.duration, options.bounces)
            }
        });
        const folder = this.gui!.addFolder('Bouncing');
        folder.add(options, 'amplitude').name('Amplitude');
        folder.add(options, 'duration').name('Duration (ms)');
        folder.add(options, 'bounces', 1, 10, 1).name('Bounces');
        folder.add(options, 'apply').name('Apply');
    }

    openCylinderUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        const { diameter = 1, height = 2 } = this.options || {};
        const options = Object.assign(this.options, { diameter, height });

        const onChange = () => {
            const { diameter, height } = options;
            const vertexData = VertexData.CreateCylinder({ diameter, height });
            vertexData.applyToMesh(mesh);
        }

        this.gui!.add(options, 'diameter', 0.1, 2.0, VALUE_STEP).name('Diameter').onChange(onChange);
        this.gui!.add(options, 'height', 0.1, 2.0, VALUE_STEP).name('Height').onChange(onChange);

        this.appendAnimateUI();
    }

    openCubeUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        const { width = 1, height = 1, depth = 1 } = this.options || {};
        const options = Object.assign(this.options, { width, height, depth });

        const onChange = () => {
            const { width, height, depth } = options;
            const vertexData = VertexData.CreateBox({ width, height, depth });
            vertexData.applyToMesh(mesh);
        }

        this.gui!.add(options, 'width', 0.1, 2.0, VALUE_STEP).name('Width').onChange(onChange);
        this.gui!.add(options, 'height', 0.1, 2.0, VALUE_STEP).name('Height').onChange(onChange);
        this.gui!.add(options, 'depth', 0.1, 2.0, VALUE_STEP).name('Depth').onChange(onChange);

        this.appendAnimateUI();
    }

    openIcoSphereUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        const { diameter = 2, subdivisions = 4 } = this.options || {};
        const options = Object.assign(this.options, { diameter, subdivisions });

        const onChange = () => {
            const { diameter, subdivisions } = options;
            const vertexData = VertexData.CreateIcoSphere({ radius: diameter / 2, subdivisions });
            vertexData.applyToMesh(mesh);
        }

        this.gui!.add(options, 'diameter', 0.1, 2.0, VALUE_STEP).name('Diameter').onChange(onChange);
        this.gui!.add(options, 'subdivisions', 1, 10, 1).name('Subdivisions').onChange(onChange);

        this.appendAnimateUI();
    }
}