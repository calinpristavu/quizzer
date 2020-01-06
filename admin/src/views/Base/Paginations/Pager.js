import React, {Component} from 'react';
import {
  Col,
  Input, InputGroup, InputGroupAddon, InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row
} from "reactstrap";
import PropTypes from 'prop-types';

class Pager extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    noPages: PropTypes.number.isRequired,
    noItems: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    toPage: PropTypes.func.isRequired,
    setPerPage: PropTypes.func.isRequired,
  };

  toPage = (pageNo) => {
    if (pageNo < 0 || pageNo >= this.props.noPages) {
      return;
    }

    this.props.toPage(pageNo);
  };

  renderItem = (item) => {
    if (item < 0) {
      return null;
    }

    if (item >= this.props.noPages) {
      return null;
    }

    return (
      <PaginationItem
        onClick={() => this.toPage(item)}
        key={item}
        active={item === this.props.currentPage}>
        <PaginationLink tag="button">{item + 1}</PaginationLink>
      </PaginationItem>
    );
  };

  renderPagination = () => {
    if (this.props.noPages < 2) {
      return null;
    }

    return (
      <Pagination>
        <PaginationItem
          disabled={this.props.currentPage === 0}
          onClick={() => this.toPage(this.props.currentPage - 1)}>
          <PaginationLink previous tag="button">Prev</PaginationLink>
        </PaginationItem>

        {this.renderItem(this.props.currentPage - 2)}
        {this.renderItem(this.props.currentPage - 1)}
        {this.renderItem(this.props.currentPage)}
        {this.renderItem(this.props.currentPage + 1)}
        {this.renderItem(this.props.currentPage + 2)}

        <PaginationItem
          disabled={this.props.currentPage >= this.props.noPages - 1}
          onClick={() => this.toPage(this.props.currentPage + 1)}>
          <PaginationLink next tag="button">Next</PaginationLink>
        </PaginationItem>
      </Pagination>
    )
  };

  render() {
    return (
      <Row>
        <Col md={12}>
          <div className="float-right">
            <InputGroup>
              <Input
                type="number"
                min={1}
                max={this.props.noItems}
                style={{width: 80}}
                value={this.props.perPage}
                onChange={(e) => this.props.setPerPage(parseInt(e.target.value) || 1)}
                required />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  / {this.props.noItems}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          {this.renderPagination()}
        </Col>
      </Row>
    )
  }
}

export default Pager;
