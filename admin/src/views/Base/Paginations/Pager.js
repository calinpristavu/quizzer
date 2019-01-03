import React, {Component} from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import PropTypes from 'prop-types';

class Pager extends Component {

  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    noPages: PropTypes.number.isRequired,
    toPage: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Pagination>
        {this.props.currentPage !== 0 ? (
          <PaginationItem
            onClick={() => this.props.toPage(this.props.currentPage - 1)}>
            <PaginationLink previous tag="button">Prev</PaginationLink>
          </PaginationItem>
        ): null}

        {[...Array(this.props.noPages).keys()].map((i) => (
          <PaginationItem
            onClick={() => this.props.toPage(i)}
            key={i}
            active={i === this.props.currentPage}>
            <PaginationLink tag="button">{i + 1}</PaginationLink>
          </PaginationItem>
        ))}

        {this.props.currentPage !== this.props.noPages - 1 ? (
          <PaginationItem
            onClick={() => this.props.toPage(this.props.currentPage + 1)}>
            <PaginationLink next tag="button">Next</PaginationLink>
          </PaginationItem>
        ): null}
      </Pagination>
    )
  }
}

export default Pager;
