import React from "react";
import { findDOMNode } from "react-dom";
import { TweenLite, Sine, Power2 } from "gsap";

// returns fade up animation
function makeFadesIn(Component, options = { duration: 0.5 }) {
    return class FadesIn extends React.Component {
        static get propTypes() {
            key: Component.name;
        }

        // this component is about to enter
        componentWillEnter(callback) {
            const el = findDOMNode(this);
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

        // this component is about to leave, just hide it for now
        componentWillLeave(callback) {
            const el = findDOMNode(this);
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

// helper function to parse options from fadeup call
function fadesIn(Component) {
    return typeof arguments[0] === "function"
        ? makeFadesIn(arguments[0])
        : Component => makeFadesIn(Component, arguments[0]);
}

export default fadesIn;
