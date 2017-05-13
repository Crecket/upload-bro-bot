require("dotenv").config();
// load correct version based on node env
if (process.env.NODE_ENV === "development") {
    require("./src/index");
} else {
    require("./dist/index");
}
