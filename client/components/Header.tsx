/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardActions,
  Avatar,
  FontIcon,
  Styles
} from 'material-ui';

class Header extends React.Component<any, any> {
  
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  
  render() {
    return (
      <Card style={{marginBottom:20}}>
        <CardHeader
          title="Todos"
          subtitle="Todonts strictly prohibited"
          avatar={
            <Avatar
              icon={<FontIcon className="material-icons">assignment_turned_in</FontIcon>}
              color={Styles.Colors.teal800}/>
          } />
      </Card>
    );
  }
}

export default Header;
