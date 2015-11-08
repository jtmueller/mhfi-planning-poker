/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  Avatar
} from 'material-ui';

import { IRecord, AppState } from '../models/pokerModels';

interface MainSectionProps {
  state: AppState;
  actions: any;
};

class MainSection extends React.Component<MainSectionProps, any> {
  constructor(props, context) {
    super(props, context);
  }
  
  shouldComponentUpdate(nextProps: MainSectionProps, nextState) {
    return this.props.state !== nextProps.state; 
  }

  render() {
    const { state, actions } = this.props;

    return (
      <div>
        <div style={{ display: state.currentUser.name.length === 0 ? 'none' : '' }}>
          <Avatar src={state.currentUser.avatarUrl} /> 
          { state.currentUser.name }
        </div>
        <ul>
          {state.sessionNames.map(sn => <li>{sn.name}</li>)}
        </ul>
      </div>
    );
  }
}

export default MainSection;
