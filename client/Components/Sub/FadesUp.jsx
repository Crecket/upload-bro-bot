import React from 'react';
import {findDOMNode} from 'react-dom';
import {TweenMax, Power4, Sine} from 'gsap';

// returns fade up animation
function makeFadesUp(Component, options = {duration: 0.5}) {
    return class FadesUp extends React.Component {
        static get propTypes() {
            key: Component.name
        }

        // this component is about to enter
        componentWillEnter(callback) {
            const el = findDOMNode(this);
            TweenLite.fromTo(el, options.duration,
                {
                    scaleX: 0.5,
                    scaleY: 0.5,
                    opacity: 0,
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    ease: Sine.easeInOut,
                    onComplete: callback,
                },
            );
        }

        // this component is about to leave, just hide it for now
        componentWillLeave(callback) {
            const el = findDOMNode(this);
            TweenMax.fromTo(
                el,
                // duration
                options.duration,
                {
                    // start properties
                    // x: 0,
                    // scaleX: 1,
                    // scaleY: 1,
                    opacity: 0,
                    // position: "fixed",
                },
                {
                    // end properties
                    // x: -500,
                    // scaleX: 0.5,
                    // scaleY: 0.5,
                    opacity: 0,
                    // position: "fixed",
                    // ease: Power4.easeInOut,
                    onComplete: callback,
                }
            );
        }

        render() {
            return <Component {...this.props} />;
        }
    }
}

// helper function to parse options from fadeup call
function fadesUp(Component) {
    return typeof arguments[0] === 'function'
        ? makeFadesUp(arguments[0])
        : Component => makeFadesUp(Component, arguments[0]);
}

export default fadesUp;
