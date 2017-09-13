jest.mock("store");

import * as sitesActions from "../../../client/actions/sites";
import * as userActions from "../../../client/actions/user";
import * as modalActions from "../../../client/actions/modal";
import * as snackbarActions from "../../../client/actions/snackbar";

describe("actions synchronous", () => {
    describe("user", () => {
        it("should create a user load from localstorage action", () => {
            const expected = {
                type: "USER_LOAD_LOCALSTORAGE"
            };
            expect(userActions.userLoadLocalstorage()).toEqual(expected);
        });

        it("should create a user is now loading action", () => {
            const expected = {
                type: "USER_IS_LOADING"
            };
            expect(userActions.userLoading()).toEqual(expected);
        });

        it("should create a user is no longer loading action", () => {
            const expected = {
                type: "USER_IS_NOT_LOADING"
            };
            expect(userActions.userNotLoading()).toEqual(expected);
        });

        it("should create a user initial check is finished action", () => {
            const expected = {
                type: "USER_INITIAL_CHECK"
            };
            expect(userActions.userInitialCheck()).toEqual(expected);
        });

        it("should create a set userinfo action", () => {
            const expected = {
                type: "USER_SET_INFO",
                payload: {
                    user_info: {
                        name: "testname"
                    }
                }
            };
            expect(userActions.userSetInfo({ name: "testname" })).toEqual(
                expected
            );
        });
    });

    describe("sites", () => {
        it("should create a sites load from localstorage action", () => {
            const expected = {
                type: "SITE_LOAD_LOCALSTORAGE"
            };
            expect(sitesActions.siteLoadLocalstorage()).toEqual(expected);
        });

        it("should create a sites are now loading action", () => {
            const expected = {
                type: "SITE_IS_LOADING"
            };
            expect(sitesActions.siteLoading()).toEqual(expected);
        });

        it("should create a sites are no longer loading action", () => {
            const expected = {
                type: "SITE_IS_NOT_LOADING"
            };
            expect(sitesActions.siteNotLoading()).toEqual(expected);
        });

        it("should create a set sites action with no sites", () => {
            const sites = [];
            const expected = {
                type: "SITE_SET_INFO",
                payload: {
                    sites: sites
                }
            };
            expect(sitesActions.setSites(sites)).toEqual(expected);
        });

        it("should create a set sites action with a example site", () => {
            const sites = [{ title: "test_site" }];
            const expected = {
                type: "SITE_SET_INFO",
                payload: {
                    sites: sites
                }
            };
            expect(sitesActions.setSites(sites)).toEqual(expected);
        });
    });

    describe("modal", () => {
        it("should create a close modal action", () => {
            const expected = {
                type: "MODAL_CLOSE"
            };
            expect(modalActions.closeModal()).toEqual(expected);
        });

        it("should create a open modal action", () => {
            const message = "some_message";
            const title = "title";
            const expected = {
                type: "MODAL_OPEN",
                payload: {
                    message: message,
                    title: title
                }
            };
            expect(modalActions.openModal(message, title)).toEqual(expected);
        });
    });

    describe("snackbar", () => {
        it("should create a close snackbar action", () => {
            const expected = {
                type: "SNACKBAR_CLOSE"
            };
            expect(snackbarActions.closeSnackbar()).toEqual(expected);
        });

        it("should create a open snackbar action", () => {
            const message = "some_message";
            const duration = 2000;
            const expected = {
                type: "SNACKBAR_OPEN",
                payload: {
                    message: message,
                    duration: duration
                }
            };
            expect(snackbarActions.openSnackbar(message, duration)).toEqual(
                expected
            );
        });

        it("should create a open snackbar action with default duration", () => {
            const message = "some_message";
            const expected = {
                type: "SNACKBAR_OPEN",
                payload: {
                    message: message,
                    duration: 4000
                }
            };
            expect(snackbarActions.openSnackbar(message)).toEqual(expected);
        });
    });
});
