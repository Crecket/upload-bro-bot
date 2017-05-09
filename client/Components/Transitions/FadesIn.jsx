import React from "react";
import { findDOMNode } from "react-dom";
import { TweenLite, Power2 } from "gsap";

/**
 * Returns a FadesIn wrapped component
 *
 * @param Component - the component that should be wrapped
 * @param options   - optional options
 * @returns {FadesIn}
 */
function makeFadesIn(Component, options = { duration: 0.5 }) {
    /**
     * The actual wrapper component
     */
    return class FadesIn extends React.Component {
        /**
         * Lifecycle function which is called by TransitionGroup once this component is about to enter
         *
         * @param callback
         * @returns {*}
         */
        componentWillEnter(callback) {
            // get the current dom node
            const el = findDOMNode(this);
            // fallback to instant transition
            if (!el) return callback();

            // trigger the animation using gsap
            TweenLite.fromTo(
                el,
                options.duration,
                {
                    scaleX: 0.75,
                    scaleY: 0.75,
                    opacity: 0
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    ease: Power2.easeOut,
                    onComplete: callback
                }
            );
        }

        /**
         * Lifecycle function which is called by TransitionGroup once this component is about to leave
         *
         * @param callback
         * @returns {*}
         */
        componentWillLeave(callback) {
            // get the current dom node
            const el = findDOMNode(this);
            // fallback to instant transition
            if (!el) return callback();

            // just hide the component
            TweenLite.to(el, 0, {
                opacity: 0,
                onComplete: callback
            });
        }

        render() {
            return <Component {...this.props} />;
        }
    };
}

/**
 * Helper function to parse options from fadeup call
 *
 * @param Component
 * @returns {*}
 */
function fadesIn(Component) {
    return typeof arguments[0] === "function"
        ? makeFadesIn(arguments[0])
        : Component => makeFadesIn(Component, arguments[0]);
}

export default fadesIn;
