import React from 'react';
import ReactDOM from 'react-dom';
import Popovers from "views/Base/Popovers/Popovers";

it('renders without crashing', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Popovers />, div);
  ReactDOM.unmountComponentAtNode(div);
});
