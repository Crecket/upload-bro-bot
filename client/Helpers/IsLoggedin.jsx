export default props => {
    if (!props.user_info) {
        return false;
    }
    return true;
};
