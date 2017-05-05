"use strict";
import React from "react";
import {findDOMNode} from "react-dom";
import {Power2, TweenLite} from "gsap";

// returns fade up animation
function makeFadesIn(Component, options = {duration: 0.5}) {
    // the actual component
    return class FadesIn extends React.Component {
        // this component is about to enter
        componentWillEnter(callback) {
            // make sure we get the correct node
            const el = findDOMNode(this.refs.fadesInComponentRef);
            if (!el) return callback();

            // trigger the animation using gsap
            TweenLite.fromTo(
                this.refs.fadesInComponentRef,
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
            // make sure we get the correct dom node
            const el = findDOMNode(this.refs.fadesInComponentRef);
            if (!el) return callback();

            // just hide the component
            TweenLite.to(el, 0, {
                opacity: 0,
                onComplete: callback
            });
        }

        render() {
            return <Component ref="fadesInComponentRef" {...this.props} />;
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
