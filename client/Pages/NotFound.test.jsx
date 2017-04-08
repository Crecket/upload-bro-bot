import NotFound from'./NotFound.jsx';

import React from 'react';
import renderer from 'react-test-renderer';


describe('<NotFound />', () => {
    it('matches snapshot', () => {
       const tree = renderer.create(
           <NotFound/>
       );

       expect(tree).toMatchSnapshot();
    });
});

