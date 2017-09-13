jest.mock("store");

require("dotenv").config();
import React from "react";

// import all the reducers and their default states
import modalReducers, { defaultState as defaultModalState } from "../../../client/Reducers/modal";
import sitesReducers, { defaultState as defaultSitesState } from "../../../client/Reducers/sites";
import userReducers, { defaultState as defaultUserState } from "../../../client/Reducers/user";
import snackbarReducers, {
    defaultState as defaultSnackbarState
} from "../../../client/Reducers/snackbar";

import globalReducer from "../../../client/Reducers/index";

describe("reducers", () => {
    describe("global provider", () => {
        it("should return the expected combined state from all reducers", () => {
            // the reducer index should combine all reducers into a single state
            const globalState = {
                modal: { ...defaultModalState },
                sites: { ...defaultSitesState },
                user: { ...defaultUserState },
                snackbar: { ...defaultSnackbarState }
            };

            // a empty state and no action should return the expected global state ojbect
            expect(globalReducer(undefined, {})).toEqual(globalState);
        });
    });

    describe("modal", () => {
        it("should return a state with an open modal", () => {
            // the expected new state
            const modifiedState = {
                ...defaultModalState,
                modalOpen: true,
                title: "some title",
                message: "some message"
            };

            // run the reducer on our default state
            expect(
                modalReducers(defaultModalState, {
                    type: "MODAL_OPEN",
                    payload: {
                        message: "some message",
                        title: "some title"
                    }
                })
            ).toEqual(modifiedState);
        });

        it("should return a state with an closed modal", () => {
            // a new initial test state with a open modal
            const modifiedDefaultState = {
                ...defaultModalState,
                modalOpen: true,
                title: "some title",
                message: "some message"
            };

            // run the reducer on our modified state
            expect(
                modalReducers(modifiedDefaultState, {
                    type: "MODAL_CLOSE"
                })
            ).toEqual(defaultModalState);
        });

        it("should return a default state when no state is given", () => {
            // run the reducer without a state in the parameter
            expect(
                modalReducers(undefined, {
                    type: "MODAL_CLOSE"
                })
            ).toEqual(defaultModalState);
        });

        it("should return a default state when no valid action is given", () => {
            // run the reducer without a valid action in the parameter
            expect(modalReducers(undefined, {})).toEqual(defaultModalState);
        });
    });

    describe("snackbar", () => {
        it("should return a state with an open modal", () => {
            // the expected new state
            const modifiedState = {
                ...defaultSnackbarState,
                snackbarOpen: true,
                duration: 3000,
                message: "some message"
            };

            // run the reducer on our default state
            expect(
                snackbarReducers(defaultSnackbarState, {
                    type: "SNACKBAR_OPEN",
                    payload: {
                        message: "some message",
                        duration: 3000
                    }
                })
            ).toEqual(modifiedState);
        });

        it("should return a state with an closed snackbar", () => {
            // a new initial test state with a open snackbar
            const modifiedDefaultState = {
                ...defaultSnackbarState,
                snackbarOpen: true,
                duration: 3000,
                message: "some message"
            };

            // run the reducer on our modified state
            expect(
                snackbarReducers(modifiedDefaultState, {
                    type: "SNACKBAR_CLOSE"
                })
            ).toEqual(defaultSnackbarState);
        });

        it("should return a default state when no state and valid action is given", () => {
            // run the reducer without a state in the parameter
            expect(snackbarReducers(undefined, {})).toEqual(
                defaultSnackbarState
            );
        });
    });

    describe("sites", () => {
        it("should return a sites state with an loading sites status", () => {
            // the expected new state
            const modifiedState = {
                ...defaultSitesState,
                loading: true
            };

            // run the reducer on our default state
            expect(
                sitesReducers(defaultSitesState, {
                    type: "SITE_IS_LOADING"
                })
            ).toEqual(modifiedState);
        });

        it("should return a sites state with an not-loading sites status", () => {
            // the expected new state
            const modifiedState = {
                ...defaultSitesState,
                loading: true
            };

            // run the reducer on our default state
            expect(
                sitesReducers(modifiedState, {
                    type: "SITE_IS_NOT_LOADING"
                })
            ).toEqual(defaultSitesState);
        });

        it("should return a sites state with the sites list set in the state", () => {
            // the expected new state
            const modifiedState = {
                ...defaultSitesState,
                sites: { google: 1 }
            };

            // run the reducer on our default state
            expect(
                sitesReducers(defaultSitesState, {
                    type: "SITE_SET_INFO",
                    payload: {
                        sites: { google: 1 }
                    }
                })
            ).toEqual(modifiedState);
        });

        it("should return a default sites state when no state and valid action is given", () => {
            // run the reducer on our default state
            expect(sitesReducers(undefined, {})).toEqual(defaultSitesState);
        });
    });

    describe("user", () => {
        it("should return a user state with an loading status", () => {
            // the expected new state
            const modifiedState = {
                ...defaultUserState,
                loading: true
            };

            // run the reducer on our default state
            expect(
                userReducers(defaultUserState, {
                    type: "USER_IS_LOADING"
                })
            ).toEqual(modifiedState);
        });

        it("should return a user state with an not-loading status", () => {
            // the expected new state
            const modifiedState = {
                ...defaultUserState,
                loading: true
            };

            // run the reducer on our default state
            expect(
                userReducers(modifiedState, {
                    type: "USER_IS_NOT_LOADING"
                })
            ).toEqual(defaultUserState);
        });

        it("should return a user state with the user info removed", () => {
            // the expected new state
            const modifiedState = {
                ...defaultUserState,
                user_info: {
                    name: "ayy lmao"
                }
            };

            // run the reducer on our default state
            expect(
                userReducers(modifiedState, {
                    type: "USER_LOGOUT"
                })
            ).toEqual(defaultUserState);
        });

        it("should return a user state with an initialcheck completed status", () => {
            // the expected new state
            const modifiedState = {
                ...defaultUserState,
                initialCheck: true
            };

            // run the reducer on our default state
            expect(
                userReducers(defaultUserState, {
                    type: "USER_INITIAL_CHECK"
                })
            ).toEqual(modifiedState);
        });

        it("should return a user state with the sites list set in the state", () => {
            // the expected new state
            const modifiedState = {
                ...defaultUserState,
                user_info: { name: "ayy lmao" }
            };

            // run the reducer on our default state
            expect(
                userReducers(defaultUserState, {
                    type: "USER_SET_INFO",
                    payload: {
                        user_info: { name: "ayy lmao" }
                    }
                })
            ).toEqual(modifiedState);
        });

        it("should return a default user state when no state and valid action is given", () => {
            // run the reducer on our default state
            expect(userReducers(undefined, {})).toEqual(defaultUserState);
        });
    });
});
