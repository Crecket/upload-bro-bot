import fs from "fs";
import path from "path";
import a from "awaiting";
import Logger from "./Logger";

// contains cached css
let cachedCss = {};

export default async location => {
    const cache = cachedCss[location];
    if (cache && cache.expires > new Date().getTime()) {
        return cache.contents;
    }
    try {
        // get the file contents
        const contents = await a.callback(
            fs.readFile,
            `${path.resolve(__dirname + "/../../public")}${location}`
        );

        // get the filename and path for this location
        const fileName = path.basename(location);
        const filePath = path.dirname(location);

        // fix the sourcemapUrl
        const utf8Contents = contents
            .toString()
            .replace(
                `sourceMappingURL=${fileName}.map`,
                `sourceMappingURL=${filePath}/${fileName}.map`
            );

        // store the cache item
        cachedCss[location] = {
            contents: utf8Contents,
            // expire atleast every hour
            expires: new Date().getTime() + 3600
        };

        // return the new cached content
        return cachedCss[location].contents;
    } catch (ex) {
        Logger.trace(ex);
        return false;
    }
};
