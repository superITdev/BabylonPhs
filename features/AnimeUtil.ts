import { Animation, BezierCurve, EasingFunction, IEasingFunction, TransformNode } from "babylonjs";

// constants
const FPS = 30;

/**
 * Easing function for the bouncing interpolation
 * @see roughly match the following video (https://www.youtube.com/watch?v=a7oSbf8NiLw)
 */
class BouncingEase extends EasingFunction implements IEasingFunction {
    /** Defines the amplitude of the bounce */
    amplitude: number;
    /** Defines the number of bounces */
    bounces: number;
    /**
     * Instantiates a bounce easing
     * @param bounces Defines the number of bounces
     * @param amplitude Defines the amplitude of the bounce
     */
    constructor(amplitude: number, bounces: number = 3) {
        super();

        this.amplitude = amplitude;
        this.bounces = bounces;
    }
    /**
     * Given an input gradient between 0 and 1, this returns the corresponding value of the easing function for EaseIn mode.
     * @param gradient Defines the value between 0 and 1 we want the easing value for
     * @returns the corresponding value on the curve defined by the easing function
     */
    easeInCore(gradient: number): number {
        // time modulation
        const t = this.modulateTime(gradient);
        // main peoriodical function
        const cycle = this.tuneInCycle(t);
        // tuning by cubic bezier https://cubic-bezier.com
        const curve = BezierCurve.Interpolate(t, 0.7, 0, 0.84, 0);
        // compose
        const y = cycle * curve;
        return y;
    }

    /**
     * @hidden internal use
     */
    private modulateTime(gradient: number): number {
        const t = BezierCurve.Interpolate(gradient, 0.32, 0, 0.67, 0);
        return t;
    }
    /**
     * @hidden internal use
     */
    private tuneInCycle(gradient: number): number {
        const bounces = Math.max(1, this.bounces)
        const t = ((bounces - 1) * 2 + 1) * (Math.PI / 2) * gradient;
        return 1 - Math.cos(t);
    }
}

/**
 * Create and start bouncing animation on a node
 * @param node defines the node where the animation will take place
 * @param amplitude the start height of the bounce.
 * @param duration (seconds) period of time in seconds from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped.
 * @returns void
 */
export function applyBouncing(node: TransformNode, amplitude: number, duration: number) {
    // animation for bouncing
    const animation = new Animation("bouncing", "position.y", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // easing function
    const easingFunction = new BouncingEase(amplitude);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    animation.setEasingFunction(easingFunction);

    node.animations.push(animation);
    Animation.CreateAndStartAnimation('bouncing', node, 'position.y', FPS, duration * FPS, amplitude, 0, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)
}