import React from 'react';
import ReactDOM from 'react-dom';
import Paginations from "views/Base/Paginations/Pagnations";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Paginations />, div);
  ReactDOM.unmountComponentAtNode(div);
});
