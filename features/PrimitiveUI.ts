import { Mesh, TransformNode } from "babylonjs";
import GUI from "lil-gui";
import { applyBouncing } from "./AnimeUtil";

// constants
const VALUE_STEP = 0.01;

// UI window manager for primitive parmaters adjustment
export default class PrimitiveUI {
    gui: GUI | undefined;
    options: any;
    mesh: Mesh | undefined;

    private getTransformNode() {
        return this.mesh?.parent as TransformNode;
    }

    private createCommonUI(mesh: Mesh) {
        if (this.gui) {
            this.gui.destroy();
        }
        this.gui = new GUI({ title: 'Options' });
        this.options = {};
        this.mesh = mesh;
    }

    private appendAnimateUI() {
        this.options = {
            amplitude: 5,
            duration: 3,
            animate: () => {
                applyBouncing(this.getTransformNode(), this.options.amplitude, this.options.duration)
            }
        }
        const folder = this.gui!.addFolder('Bouncing');
        folder.add(this.options, 'amplitude').name('Amplitude');
        folder.add(this.options, 'duration').name('Duration (seconds)');
        folder.add(this.options, 'animate').name('Apply');
    }

    openCylinderUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        Object.assign(this.options, {
            diameter: 0.1,
            height: 0.1,
        });
        this.gui!.add(this.options, 'diameter', 0.1, 2.0, VALUE_STEP).name('Diameter');
        this.gui!.add(this.options, 'height', 0.1, 2.0, VALUE_STEP).name('Height');

        this.appendAnimateUI();
    }

    openCubeUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        Object.assign(this.options, {
            width: 0.1,
            height: 0.1,
            depth: 0.1,
        });
        this.gui!.add(this.options, 'width', 0.1, 2.0, VALUE_STEP).name('Width');
        this.gui!.add(this.options, 'height', 0.1, 2.0, VALUE_STEP).name('Height');
        this.gui!.add(this.options, 'depth', 0.1, 2.0, VALUE_STEP).name('Depth');

        this.appendAnimateUI();
    }

    openIcoSphereUI(mesh: Mesh) {
        this.createCommonUI(mesh);

        Object.assign(this.options, {
            diameter: 0.1,
            subdivisions: 1,
        });
        this.gui!.add(this.options, 'diameter', 0.1, 2.0, VALUE_STEP).name('Diameter');
        this.gui!.add(this.options, 'subdivisions', 1, 10, 1).name('Subdivisions');

        this.appendAnimateUI();
    }
}