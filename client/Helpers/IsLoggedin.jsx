export default (props) => {
    if (!props.user_info && props.initialCheck) {
        return false;
    }
    return true;
}