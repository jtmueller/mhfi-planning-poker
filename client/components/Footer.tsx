/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

import {
  TableFooter,
  TableRow,
  TableRowColumn,
  FlatButton
} from 'material-ui';

import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE
} from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
};

interface FooterProps {
  completedCount: number;
  activeCount: number;
  filter: string;
  onClearCompleted: Function;
  onShow: Function;
}

class Footer extends React.Component<FooterProps, any> {
  renderTodoCount() {
    const { activeCount } = this.props;
    const itemWord = activeCount === 1 ? 'item' : 'items';

    return (
      <TableRowColumn>
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </TableRowColumn>
    );
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <FlatButton
        primary={filter === selectedFilter}
        onClick={() => onShow(filter)}>
        {title}
      </FlatButton>
    );
  }

  renderClearButton() {
    const { completedCount, onClearCompleted } = this.props;
    if (completedCount > 0) {
      return (
        <TableRowColumn>
          <FlatButton secondary={true}
                  onClick={() => onClearCompleted()}>
            Clear completed
          </FlatButton>
        </TableRowColumn>
      );
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.activeCount !== nextProps.activeCount
      || this.props.completedCount !== nextProps.completedCount
      || this.props.filter !== nextProps.filter;
  }

  render() {
    return (
      <TableFooter adjustForCheckbox={true}>
        <TableRow>
          {this.renderTodoCount()}
          {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter =>
            <TableRowColumn key={filter}>
              {this.renderFilterLink(filter)}
            </TableRowColumn>
          )}
          {this.renderClearButton()}
        </TableRow>
      </TableFooter>
    );
  }
}

export default Footer;
