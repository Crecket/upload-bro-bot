import React from "react";
import { Shallow, Renderer } from "../../Helpers/Test/WithContext";


import LoadingScreen from "./Loader.jsx";

describe("<LoadingScreen />", () => {
    it("matches default snapshot", () => {
        const tree = Renderer(<LoadingScreen />);
        expect(tree).toMatchSnapshot();
    });

    it("throws an error for giving invalid loading tpye", () => {
        expect(() => {
            const tree = Renderer(
                <LoadingScreen loadingType="invalid-type-123" />
            );
        }).toThrow("Invalid loading type");
    });

    it("matches cube-grid snapshot", () => {
        const tree = Renderer(<LoadingScreen loadingType="cube-grid" />);
        expect(tree).toMatchSnapshot();
    });

    it("matches rotating-plane snapshot", () => {
        const tree = Renderer(
            <LoadingScreen loadingType="rotating-plane" />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches double-bounce snapshot", () => {
        const tree = Renderer(
            <LoadingScreen loadingType="double-bounce" />
        );
        expect(tree).toMatchSnapshot();
    });

    it("matches rectangle-bounce snapshot", () => {
        const tree = Renderer(
            <LoadingScreen loadingType="rectangle-bounce" />
        );
        expect(tree).toMatchSnapshot();
    });
});
