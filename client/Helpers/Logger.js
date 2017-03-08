export default {
    debug: (DEVELOPMENT_MODE) ? console.debug.bind(window.console) : ()=> {
    },
    log: (DEVELOPMENT_MODE) ? console.log.bind(window.console) : ()=> {
    },
    warning: (DEVELOPMENT_MODE) ? console.debug.bind(window.console) : ()=> {
    },
    error: (DEVELOPMENT_MODE) ? console.error.bind(window.console) : ()=> {
    },
    // always show info
    info: (DEVELOPMENT_MODE) ? console.info.bind(window.console) : ()=> {
    },
};