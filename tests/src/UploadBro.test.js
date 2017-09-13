const UploadBro = require("../../src/UploadBro").default;

describe("#UploadBro", () => {
    it("does startup sequence without errors", async () => {
        // attempt to create a new UploadBro app with offline mode
        const UploadBroApp = new UploadBro(false);

        // start Uploadbro
        return await UploadBroApp.start();
    });
});
