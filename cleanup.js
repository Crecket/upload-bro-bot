const del = require("del");

del([
    "downloads/**",
    "!downloads",
    "!downloads/.gitkeep",
    "dist/**/*",
    "coverage/**/*",
    "public/assets/dist/**/*"
])
    .then(_ => {})
    .catch(console.log);
