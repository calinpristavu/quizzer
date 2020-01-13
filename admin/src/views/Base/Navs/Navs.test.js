import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme/build';
import Navs from "views/Base/Navs/Navs";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Navs />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('toggle click without crashing', () => {
  const wrapper = mount(<Navs />);
  for (let i=0; i<2; i++) {
    let Nav = wrapper.find('a.dropdown-toggle').at(i);
    Nav.simulate('click');
    expect(wrapper.state().dropdownOpen[i]).toEqual(true);
  }
  wrapper.unmount()
});
