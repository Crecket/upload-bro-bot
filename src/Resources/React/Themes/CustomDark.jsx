import {
    cyan700,
    grey50, grey500, cyan600, grey900,
    pinkA100, pinkA200, pinkA400,
    blue500,
    white, fullWhite,
    darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const CustomTheme = {
    spacing: {
        iconSize: 24,
        desktopGutter: 24,
        desktopGutterMore: 32,
        desktopGutterLess: 16,
        desktopGutterMini: 8,
        desktopKeylineIncrement: 64,
        desktopDropDownMenuItemHeight: 32,
        desktopDropDownMenuFontSize: 15,
        desktopDrawerMenuItemHeight: 48,
        desktopSubheaderHeight: 48,
        desktopToolbarHeight: 56,
    },
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#272c30',
        primary2Color: cyan600,
        primary3Color: grey500,
        accent1Color: pinkA200,
        accent2Color: pinkA400,
        accent3Color: pinkA100,
        textColor: fullWhite,
        textColorHover: blue500,
        alternateTextColor: grey50,
        canvasColor: '#303030',
        borderColor: (0, fade)(fullWhite, 0.3),
        disabledColor: (0, fade)(fullWhite, 0.3),
        pickerHeaderColor: (0, fade)(fullWhite, 0.12),
        clockCircleColor: (0, fade)(fullWhite, 0.12),
        shadowColor: fullBlack,
    },
    bodyBackground: '#30363c',
};

export default CustomTheme;