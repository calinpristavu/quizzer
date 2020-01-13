import React, {Component} from "react";
import PropTypes from "prop-types";
import {UnControlled as CodeMirror} from "react-codemirror2";

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';

import 'codemirror/addon/lint/lint.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/php/php.js';

class CodeAnswerTemplate extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '<?php '
  };

  save = (editor, data, value) => {
    this.props.save(value);
  };

  render() {
    return (
      <CodeMirror
        value={this.props.value}
        onChange={this.save}
        options={{
          mode: "application/x-httpd-php",
          lineWrapping: true,
          lineNumbers: true,
          indentUnit: 4,
          matchBrackets: true,
        }}
      />
    );
  }
}

export default CodeAnswerTemplate;
