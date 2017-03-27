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
    palette: {
        primary1Color: '#303F9F',
        primary2Color: '#3F51B5',
        primary3Color: '#C5CAE9',
        accent1Color: '#448AFF',
        accent2Color: '#3c7be2',
        accent3Color: '#325eb8',
        textColor: '#ffffff',
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: fullWhite,
        canvasColor: '#353535',
        borderColor: fade(fullWhite, 0.3),
        disabledColor: fade(fullWhite, 0.3),
        pickerHeaderColor: fade(fullWhite, 0.12),
        clockCircleColor: fade(fullWhite, 0.12),
        appBackgroundColor: '#142F4C',
    }
};