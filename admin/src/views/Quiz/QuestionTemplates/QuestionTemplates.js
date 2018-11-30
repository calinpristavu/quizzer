import React, {Component} from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  FormGroup,
  Label,
  Input
} from 'reactstrap'

class QuestionTemplates extends Component{
  questions = [
    {
      Text: "Quesiton 1",
      Type: 1,
      AnswerTemplates: ["Checkbox 1"]
    }
  ];

  renderCreateNew() {

  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          {/*List card*/}
          <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Question Templates
                <span className="float-right">
                  <i
                    onClick={this.renderCreateNew}
                    className="fa fa-plus-circle text-success"
                    style={{cursor: "pointer"}}/>
                </span>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Text</th>
                      <th>Type</th>
                      <th>Answer Template</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.questions.map((q, k) =>
                      <tr key={k}>
                        <td>{q.Text}</td>
                        <td>{q.Type}</td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          {/*Create card*/}
          <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-plus-circle text-success" />
                <strong>Create Question</strong>
                <small> Form</small>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Label htmlFor="question-text">Text</Label>
                      <Input type="text" id="question-text" placeholder="Type in the question text" required />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup row>
                  <Col md="12">
                    <Label>Type</Label>
                  </Col>
                  <Col md="12">
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="question-type-1" name="type" value="1" />
                      <Label className="form-check-label" check htmlFor="question-type-1">One</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="question-type-2" name="type" value="2" />
                      <Label className="form-check-label" check htmlFor="question-type-2">Two</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="question-type-3" name="type" value="3" />
                      <Label className="form-check-label" check htmlFor="question-type-3">Three</Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionTemplates
