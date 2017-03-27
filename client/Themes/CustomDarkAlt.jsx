import {
    fullWhite,
    grey600,
    indigo500, indigo700, indigo900
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    palette: {
        primary1Color: indigo700,
        primary2Color: indigo700,
        primary3Color: '#9f1316',
        accent1Color: indigo500,
        accent2Color: indigo700,
        accent3Color: indigo900,
        textColor: fullWhite,
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: '#ffffff',
        canvasColor: '#353535',
        borderColor: fade(fullWhite, 0.3),
        disabledColor: fade(fullWhite, 0.3),
        pickerHeaderColor: fade(fullWhite, 0.12),
        clockCircleColor: fade(fullWhite, 0.12),
    },
};