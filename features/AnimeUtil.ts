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
     * @param amplitude Defines the amplitude of the bounce
     * @param bounces Defines the number of bounces
     */
    constructor(amplitude: number, bounces: number) {
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
        // // time modulation
        // const t = this.modulateTime(gradient);
        // // main peoriodical function
        // const cycle = this.tuneInCycle(t);
        // // tuning by cubic bezier https://cubic-bezier.com
        // const curve = BezierCurve.Interpolate(t, 0.7, 0, 0.84, 0);
        // // compose
        // const y = cycle * curve;
        // return y;
        const y = Math.max(0.0, this.bounces);
        let bounciness = this.amplitude;
        if (bounciness <= 1.0) {
            bounciness = 1.001;
        }
        const num9 = Math.pow(bounciness, y);
        const num5 = 1.0 - bounciness;
        const num4 = (1.0 - num9) / num5 + num9 * 0.5;
        const num15 = gradient * num4;
        const num65 = Math.log(-num15 * (1.0 - bounciness) + 1.0) / Math.log(bounciness);
        const num3 = Math.floor(num65);
        const num13 = num3 + 1.0;
        const num8 = (1.0 - Math.pow(bounciness, num3)) / (num5 * num4);
        const num12 = (1.0 - Math.pow(bounciness, num13)) / (num5 * num4);
        const num7 = (num8 + num12) * 0.5;
        const num6 = gradient - num7;
        const num2 = num7 - num8;
        return (-Math.pow(1.0 / bounciness, y - num3) / (num2 * num2)) * (num6 - num2) * (num6 + num2);
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
 * @param duration period of time in ms from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped.
 * @param bounces the number of bounces
 * @returns void
 */
export function applyBouncing(node: TransformNode, amplitude: number, duration: number, bounces: number) {
    // animation for bouncing
    const animation = new Animation("bouncing", "position.y", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // easing function
    const easingFunction = new BouncingEase(amplitude, bounces);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    animation.setEasingFunction(easingFunction);

    node.animations.push(animation);
    Animation.CreateAndStartAnimation('bouncing', node, 'position.y', FPS, duration / 1000 * FPS, amplitude, 0, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)
}