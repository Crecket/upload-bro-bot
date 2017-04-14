import React from "react";
import Logger from "../../Helpers/Logger";

export default ({ isLoading, pastDelay, error }) => {
    if (isLoading && pastDelay) {
        return null;
    } else if (error && !isLoading) {
        Logger.error("Failed to load", error);
        return null;
    } else {
        return null;
    }
};
