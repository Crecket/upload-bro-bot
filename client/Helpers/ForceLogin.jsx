import IsLoggedin from './IsLoggedin.jsx';

/**
 * if requiresLogin === true, user has to be logged in or will be redirected
 * if requiresLogin === false, user has to be logged out and wil be redirected
 *
 * @param props
 * @param authRequired
 * @returns {boolean}
 */
export default (props, requiresLogin = true) => {
    // check if user profile is set and intial check has been done
    const IsLoggedinResult = IsLoggedin(props);

    // get current path
    const currentLocation = props.router.location.pathname;

    // navigate when neccesary
    if (IsLoggedinResult) {
        if (requiresLogin === false && props.initialCheck) {
            // user is logged in when he shouldn't be, redirect to home
            if (currentLocation !== "/dashboard") {
                props.router.push('/dashboard');
            }
        }
    } else {
        if (requiresLogin === true) {
            // user is not logged in when he should be, redirect to home
            if (currentLocation !== "/") {
                props.router.push('/');
            }
        }
    }

    return IsLoggedinResult;
}
