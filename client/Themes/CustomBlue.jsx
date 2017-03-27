import {
    cyan500,
    grey300,
    fullWhite, darkBlack, fullBlack
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#448AFF',
        primary2Color: '#53a7ff',
        primary3Color: '#6ebfff',
        accent1Color: '#303F9F',
        accent2Color: '#3F51B5',
        accent3Color: '#C5CAE9',
        textColor: '#212121',
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: '#FFFFFF',
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
        appBackgroundColor: '#ffffff',
    }
};

// old css colors
// $primary-color-dark: #303F9F;
// $primary-color: #3F51B5;
// $primary-color-light: #C5CAE9;
// $primary-color-text: #FFFFFF;
// $accent-color: #448AFF;
// $primary-text-color: #212121;
// $secondary-text-color: #757575;
// $divider-color: #BDBDBD;
// $background-color: #142F4C;
