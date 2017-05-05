import {
    blue300,
    blue700,
    darkBlack,
    fullBlack,
    grey100,
    grey300,
    grey500,
    indigo500,
    indigo700,
    white
} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

export default {
    spacing: spacing,
    fontFamily: "Roboto, sans-serif",
    borderRadius: 2,
    palette: {
        primary1Color: indigo500,
        primary2Color: indigo700,
        primary3Color: grey500,
        accent1Color: blue300,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        secondaryTextColor: fade(white, 0.7),
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: blue700,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
        appBackgroundColor: white
    }
};
