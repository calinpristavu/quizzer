import PropTypes from "prop-types";
import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";

class List extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: []
  };

  static propTypes = {
    openEdit: PropTypes.func,
    openCreate: PropTypes.func,
    delete: PropTypes.func,
    quizzes: PropTypes.arrayOf(PropTypes.object),
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.quizzes.slice(
      firstPosition,
      firstPosition + this.state.perPage
    );
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify" /> Quiz Templates
          <span className="float-right">
            <i
              onClick={this.props.openCreate}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
            <tr>
              <th>Name</th>
              <th>#noQuestions</th>
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k} onClick={() => this.props.openEdit(q)}>
                <td>{q.Name}</td>
                <td>{q.Questions !== null ? q.Questions.length : 0}</td>
                <td>
                  <i onClick={() => this.props.delete(q.ID)} className="fa fa-minus-circle"/>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(this.props.quizzes.length / this.state.perPage)}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            toPage={(pageNo) => this.setState({currentPage: pageNo})}
            setPerPage={(v) => this.setState({perPage: v})}/>
        </CardFooter>
      </Card>
    );
  }
}

export default List;
