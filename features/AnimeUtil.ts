import { Animation, BezierCurve, EasingFunction, IEasingFunction, TransformNode } from "babylonjs";

/**
 * Easing function for the bouncing interpolation
 * @see roughly match the following video (https://www.youtube.com/watch?v=a7oSbf8NiLw)
 */
class BouncingEase extends EasingFunction implements IEasingFunction {
    /** Defines the number of bounces */
    bounces: number;
    /**
     * Instantiates a bounce easing
     * @param bounces Defines the number of bounces
     */
    constructor(bounces: number) {
        super();

        this.bounces = bounces;
    }
    /**
     * Given an input gradient between 0 and 1, this returns the corresponding value of the easing function for EaseIn mode.
     * @param gradient Defines the value between 0 and 1 we want the easing value for
     * @returns the corresponding value on the curve defined by the easing function
     */
    easeInCore(gradient: number): number {
        const halfPI = Math.PI / 2;
        const halfQ = 0.75;

        const bounces = Math.max(1, this.bounces);

        // time, cycle
        let cycle, st;
        let term = 2 * halfQ;

        for (cycle = 1, st = 1; cycle < bounces; cycle++) {
            st += term;
            term *= halfQ;
        }
        const sf = 1 / st; // normalized seed halfPI length (scaled to [0, 1])

        let x = 0; // absolute x in function graphe
        if (gradient <= sf) {
            x = (gradient / sf) * halfPI;
            cycle = 0;
        } else {
            term = sf * 2 * halfQ;

            let stA = sf;
            let stB = stA + term;

            for (cycle = 0, st = sf; st < gradient; cycle++) {
                stA = st;

                st += term;
                stB = st;

                term *= halfQ;
            }

            x = halfPI + Math.max(0, (cycle - 1)) * Math.PI;
            x += (gradient - stA) / (stB - stA) * Math.PI;
        }

        // modulate amplitude for the cycle
        const amp = 1 - BezierCurve.Interpolate(cycle / bounces, 0.12, 0, 0.39, 0);

        // compose
        let y = amp * Math.abs(Math.cos(x));

        y = 1 - y;
        return y;
    }
}

/**
 * Create and start bouncing animation on a node
 * @param node defines the node where the animation will take place
 * @param amplitude the start height of the bounce.
 * @param duration period of time in ms from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped.
 * @param bounces the number of bounces
 * @returns void
 */
export function applyBouncing(node: TransformNode, amplitude: number, duration: number, bounces: number) {
    const FPS = 30;

    // animation for bouncing
    const animation = new Animation("bouncing", "position.y", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // easing function
    const easingFunction = new BouncingEase(bounces);
    animation.setEasingFunction(easingFunction);

    Animation.CreateAndStartAnimation('bouncing', node, 'position.y', FPS, duration / 1000 * FPS, amplitude, 0, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)
}