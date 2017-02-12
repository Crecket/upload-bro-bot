import {
    indigoA400, indigo500, indigo700,
    lightGreenA200, lightGreenA500,
    pinkA200,
    purple500,
    grey100, grey300, red700, grey400, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: indigoA400,
        primary2Color: indigo700,
        primary3Color: grey400,
        accent1Color: red700,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: indigoA400,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
};
