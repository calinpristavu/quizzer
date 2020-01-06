import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";
import React, {Component} from "react";
import {connect} from "react-redux";
import {getUsers, setUserCreate} from "../../redux/actions";
import Pager from "../Base/Paginations/Pager";

class UserList extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
  };

  componentDidMount() {
    this.props.getUsers();
  }

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.list
      .slice(firstPosition, firstPosition + this.state.perPage)
      .valueSeq();
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={() => this.props.setUserCreate(true)}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
          <i className="fa fa-align-justify"/> Users <small className="text-muted">list</small>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Registered</th>
                <th scope="col">Attitude</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {this.getVisibleItems().map(e =>
                <UserRow key={e.ID} user={e}/>
              )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noItems={this.props.list.size}
            noPages={Math.ceil(this.props.list.size / this.state.perPage)}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            toPage={(pageNo) => this.setState({currentPage: pageNo})}
            setPerPage={(v) => this.setState({perPage: v})}/>
        </CardFooter>
      </Card>
    );
  }
}

export default connect(
  state => ({
    list: state.user.all,
  }),
  {getUsers, setUserCreate}
)(UserList);
