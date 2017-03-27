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
        primary1Color: '#7B1FA2',
        primary2Color: '#9C27B0',
        primary3Color: '#E1BEE7',
        accent1Color: '#7C4DFF',
        accent2Color: '#784aef',
        accent3Color: '#5d3ac3',
        textColor: '#fff',
        secondaryTextColor: '#757575',
        alternateTextColor: '#BDBDBD',
        canvasColor: '#7C4DFF',
        // borderColor: fade(fullWhite, 0.3),
        // disabledColor: fade(fullWhite, 0.3),
        // pickerHeaderColor: fade(fullWhite, 0.12),
        // clockCircleColor: fade(fullWhite, 0.12),
        appBackgroundColor: '#7B1FA2',
    }
};