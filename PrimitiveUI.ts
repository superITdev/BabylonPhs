import { Mesh } from "babylonjs";
import GUI from "lil-gui";

// constants
const VALUE_STEP = 0.01;

// UI window manager for primitive parmaters adjustment
export default class PrimitiveUI {
    gui: GUI | undefined;
    options: any;
    mesh: Mesh | undefined;

    private CreateCommonUI(mesh: Mesh) {
        if (this.gui) {
            this.gui.destroy();
        }
        this.gui = new GUI({ title: 'Options' });
        this.options = {};
        this.mesh = mesh;
    }

    private AppendAnimateUI() {
        this.options = {
            animate: false,
            amplitude: 3,
            duration: 2,
        }
        const folder = this.gui!.addFolder('Animation');
        folder.add(this.options, 'animate').onChange(() => { // animate
            const { animate, amplitude, duration } = this.options;
            if (animate) {
            }
        });
        folder.add(this.options, 'amplitude');
        folder.add(this.options, 'duration');
    }

    OpenCylinderUI(mesh: Mesh) {
        this.CreateCommonUI(mesh);

        Object.assign(this.options, {
            diameter: 0.1,
            height: 0.1,
        });
        this.gui!.add(this.options, 'diameter', 0.1, 2.0, VALUE_STEP);
        this.gui!.add(this.options, 'height', 0.1, 2.0, VALUE_STEP);

        this.AppendAnimateUI();
    }

    OpenCubeUI(mesh: Mesh) {
        this.CreateCommonUI(mesh);

        Object.assign(this.options, {
            width: 0.1,
            height: 0.1,
            depth: 0.1,
        });
        this.gui!.add(this.options, 'width', 0.1, 2.0, VALUE_STEP);
        this.gui!.add(this.options, 'height', 0.1, 2.0, VALUE_STEP);
        this.gui!.add(this.options, 'depth', 0.1, 2.0, VALUE_STEP);

        this.AppendAnimateUI();
    }

    OpenIcoSphereUI(mesh: Mesh) {
        this.CreateCommonUI(mesh);

        Object.assign(this.options, {
            diameter: 0.1,
            subdivisions: 1,
        });
        this.gui!.add(this.options, 'diameter', 0.1, 2.0, VALUE_STEP);
        this.gui!.add(this.options, 'subdivisions', 1, 10, 1);

        this.AppendAnimateUI();
    }
}