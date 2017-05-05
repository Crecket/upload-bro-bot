import {white} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

export default {
    spacing: spacing,
    fontFamily: "Roboto, sans-serif",
    borderRadius: 2,
    palette: {
        primary1Color: "#303F9F",
        primary2Color: "#3F51B5",
        primary3Color: "#C5CAE9",
        accent1Color: "#448AFF",
        accent2Color: "#3c7be2",
        accent3Color: "#325eb8",
        textColor: white,
        secondaryTextColor: fade(white, 0.7),
        alternateTextColor: white,
        canvasColor: "#353535",
        borderColor: fade(white, 0.3),
        disabledColor: fade(white, 0.3),
        pickerHeaderColor: fade(white, 0.12),
        clockCircleColor: fade(white, 0.12),
        appBackgroundColor: "#142F4C"
    }
};
