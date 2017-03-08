import browserHistory from 'react-router/lib/browserHistory';
export default function (props, redirect) {
    // check if user profile is set and intial check has been done
    if (!props.Auth0 || !props.Auth0.loggedIn()) {
        // redirect === true, send home
        if (redirect) {
            // send to home
            browserHistory.push('/login');
        }
        return false;
    }
    return true;
}