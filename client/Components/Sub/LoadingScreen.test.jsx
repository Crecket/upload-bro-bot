import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import LoadingScreen from "./LoadingScreen.jsx";

describe("<LoadingScreen />", () => {
    it("matches default snapshot", () => {
        const tree = renderer.create(<LoadingScreen />);
        expect(tree).toMatchSnapshot();
    });

    it("throws an error for giving invalid loading tpye", () => {
        expect(() => {
            "use strict";
            const tree = renderer.create(
                <LoadingScreen loadingType="invalid-type-123" />
            );
        }).toThrow("Invalid loading type");
    });

    it("matches cube-grid snapshot", () => {
        const tree = renderer.create(<LoadingScreen loadingType="cube-grid" />);
        expect(tree).toMatchSnapshot();
    });

    it("matches rotating-plane snapshot", () => {
        const tree = renderer.create(
            <LoadingScreen loadingType="rotating-plane" />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches double-bounce snapshot", () => {
        const tree = renderer.create(
            <LoadingScreen loadingType="double-bounce" />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches rectangle-bounce snapshot", () => {
        const tree = renderer.create(
            <LoadingScreen loadingType="rectangle-bounce" />
        );
        expect(tree).toMatchSnapshot();
    });
});
