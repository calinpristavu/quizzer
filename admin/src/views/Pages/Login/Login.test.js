import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from "views/Pages/Login/Login";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Login/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
