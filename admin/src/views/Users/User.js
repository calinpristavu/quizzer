import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from 'reactstrap';

class User extends Component {
  state = {
    user: {}
  };

  componentDidMount() {
    fetch("http://localhost:8001/new-api/users/" + this.props.match.params.id)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          user: response
        })
      })
  }

  render() {

    const user = this.state.user;

    const userDetails = user
      ? Object.entries(user)
      : [[
        'id', (<span><i className="text-muted icon-ban" /> Not found</span>)
      ]];

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1" />User id: {user.ID}
                </strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        userDetails.map(([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{value}</strong></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
