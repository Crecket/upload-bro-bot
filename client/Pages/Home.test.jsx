"use strict";

import React from 'react';
import renderer from 'react-test-renderer';

import Wrapper from '../TestHelpers/Wrapper.jsx';
import Home from'./Home.jsx';

const siteTestList = {
    "box": {
        "name": "Box",
        "title": "Box",
        "description": "Secure File Sharing, Storage, and Collaboration",
        "slogan": "Secure File Sharing, Storage, and Collaboration",
        "key": "box",
        "url": "https://www.box.com/home",
        "supportedExtensions": true,
        "logos": {"png": "/assets/img/box.png", "svg": "/assets/img/box.svg"},
        "documentation": "## Box\n### Supported features\n\n - Upload files directly from the chat"
    },
    "dropbox": {
        "name": "Dropbox",
        "title": "Dropbox",
        "description": "Securely Share, Sync & Collaborate.",
        "slogan": "Securely Share, Sync & Collaborate.",
        "key": "dropbox",
        "url": "https://www.dropbox.com",
        "supportedExtensions": true,
        "logos": {"png": "/assets/img/dropbox.png", "svg": "/assets/img/dropbox.svg"},
        "documentation": "## Dropbox\n### Supported features\n\n - Upload files directly from the chat"
    },
    "google": {
        "name": "Google",
        "title": "Google Drive",
        "description": "Cloud Storage & File Backup for Photos, Docs & More",
        "slogan": "Cloud Storage & File Backup for Photos, Docs & More",
        "key": "google",
        "url": "https://drive.google.com",
        "supportedExtensions": true,
        "logos": {"png": "/assets/img/google.png", "svg": "/assets/img/google.svg"},
        "documentation": "## Google Drive\n### Supported features\n\n - Search files with [inline search](https://core.telegram.org/bots/inline)\n - Upload files directly from the chat"
    },
    "imgur": {
        "name": "Imgur",
        "title": "Imgur",
        "description": "The most awesome images on the Internet",
        "slogan": "The most awesome images on the Internet",
        "key": "imgur",
        "url": "https://imgur.com",
        "supportedExtensions": ["jpg", "jpeg", "png", "gif", "apng", "tiff", "pdf", "xcf"],
        "logos": {"png": "/assets/img/imgur.png", "svg": "/assets/img/imgur.svg"},
        "documentation": "## Imgur\n### Supported features\n\n - Search files with [inline search](https://core.telegram.org/bots/inline)\n - Upload *images* directly from the chat"
    }
};

describe('<Home />', () => {
    it('matches snapshot', () => {
        const tree = renderer.create(
            <Wrapper><Home sites={siteTestList}/></Wrapper>
        );

        expect(tree).toMatchSnapshot();
    });
});
