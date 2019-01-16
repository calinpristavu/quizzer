import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DefaultFooter extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {};

  render() {
    return (
      <React.Fragment>
        <span><a href="https://quiz.evozon.com">Quiz App</a> &copy; <a href="https://evozon.com">evozon.</a></span>
        <span className="ml-auto">Powered by <a href="https://coreui.io/react">CoreUI for React</a></span>
      </React.Fragment>
    );
  }
}

export default DefaultFooter;
