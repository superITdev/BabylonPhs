import { Animation, BounceEase, EasingFunction, TransformNode } from "babylonjs";

// constants
const FPS = 30;

// function: applyBouncing
// parameters
// node: an object which should play this animation
// amplitude: the start height of the bounce.
// duration (seconds): Period of time in seconds from the start of the animation when the object is at the topmost point to the end of the animation when the object has completely stopped.
export function applyBouncing(node: TransformNode, amplitude: number, duration: number) {
    // animation for bouncing
    const animation = new Animation("bouncing", "position.y", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // easing function
    const easingFunction = new BounceEase(3, amplitude);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    node.animations.push(animation);
    Animation.CreateAndStartAnimation('bouncing', node, 'position.y', FPS, duration * FPS, amplitude, 0, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)
}