import PropTypes from "prop-types";
import {Card, CardBody, CardHeader} from "reactstrap";
import React, {Component} from "react";

class Edit extends Component {

  static propTypes = {
    quiz: PropTypes.object
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>Editing quiz {this.props.quiz.ID}</strong>
          <small> Form</small>
        </CardHeader>
        <CardBody>
        </CardBody>
      </Card>
    );
  }
}

export default Edit;
