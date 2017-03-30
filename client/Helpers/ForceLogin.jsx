import browserHistory from 'react-router/lib/browserHistory';
import IsLoggedin from './IsLoggedin';

/**
 * if authRequired === true, user has to be logged in or will be redirected
 * if authRequired === false, user has to be logged out and wil be redirected
 *
 * @param props
 * @param authRequired
 * @returns {boolean}
 */
export default (props, userLoggedinRequired = true) => {
    // check if user profile is set and intial check has been done
    const IsLoggedinResult = IsLoggedin(props);

    // navigate when neccesary
    if (IsLoggedinResult) {
        if (userLoggedinRequired === false) {
            // user is logged in when he shouldn't be, redirect to home
            props.router.push('/dashboard');
        }
    } else {
        if (userLoggedinRequired === true) {
            // user is not logged in when he should be, redirect to home
            props.router.push('/');
        }
    }
    return IsLoggedinResult;
}