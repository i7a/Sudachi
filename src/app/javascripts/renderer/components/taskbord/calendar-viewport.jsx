import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaiseButton from 'material-ui/RaisedButton'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const CalendarViewport = class CalendarViewport extends React.Component {

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  renderMenuItem() {
    let items = []
    _.map(_.range(1, 30), (d, i) => {
      items.push(<MenuItem>{moment().add('d', d - 15).format("YYYY.M.D ddd")}</MenuItem>)
      if (d%7 == 0) {items.push(<Divider />)}
    })
    return items
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      {/* <MuiThemeProvider> */}
        <div id="calendar-viewport" className="col-md-2 hidden-sm hidden-xs">
          <RaiseButton
            label="menu"
            onTouchTap={this.handleToggle.bind(this)}
          />
          <Drawer open={this.state.open}>
            <RaiseButton
              label="close"
              onTouchTap={this.handleToggle.bind(this)}
            />
            {this.renderMenuItem()}
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

module.exports = CalendarViewport;
