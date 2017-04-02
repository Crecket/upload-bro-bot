import {
    cyan500,
    grey300,
    fullWhite, fullBlack,

    red300,
    blue400, blue700,
    indigo300, indigo500, indigo700, indigo800,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    palette: {
        primary1Color: indigo500,
        primary2Color: indigo700,
        primary3Color: indigo800,
        accent1Color: blue300,
        accent2Color: blue700,
        accent3Color: blue700,
        textColor: fullBlack,
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: fullWhite,
        borderColor: grey300,
        disabledColor: fade(fullBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(fullBlack, 0.07),
        shadowColor: fullBlack,
        appBackgroundColor: '#ffffff',
    }
};

