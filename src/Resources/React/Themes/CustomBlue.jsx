import {cyan500, grey300, darkBlack, fullBlack} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#303F9F',
        primary2Color: '#3F51B5',
        primary3Color: '#C5CAE9',
        accent1Color: '#448AFF',
        accent2Color: '#53a7ff',
        accent3Color: '#5bbaff',
        textColor: '#212121',
        alternateTextColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
};