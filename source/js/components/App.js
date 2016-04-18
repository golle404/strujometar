'use strict';

var React = require("react");
var ReactDOM = require('react-dom');
var AppStore = require('../stores/appStore.js');

var Header = require('../components/Header');
var Main = require('../components/Main');
var Content = require('../components/Content');
var Footer = require('../components/Footer');
var LeftSidebar = require('../components/LeftSidebar');

var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();


module.exports = React.createClass({
  displayName: 'App',
  getInitialState: function() {
    return {
      view: AppStore.getDefaultView(),
      mainKey: AppStore.getKey(),
      sidebarOpen: AppStore.sidebarOpen(),
      sidebarWidth: 220};
  },
  componentDidUpdate: function() {
    document.body.scrollTop = 0;
  },
  componentDidMount: function() {
    AppStore.addChangeListener(this.onChange);
    window.addEventListener('resize', AppStore.handleResize);

  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this.onChange);
    window.removeEventListener('resize', AppStore.handleResize);
  },
  onChange: function() {
    console.log("change")
    this.setState({
      view: AppStore.getView(), 
      mainKey: AppStore.getKey(),
      sidebarOpen: AppStore.sidebarOpen()
    });
  },
  getContainerStyle: function(){
    return {
      marginLeft: this.state.sidebarOpen ? this.state.sidebarWidth+"px" : "0px",
      width: this.state.sidebarOpen ? "calc(100% - " + this.state.sidebarWidth + "px)" : "100%"
    }

  },
  render: function(){
    return(
      <div 
        className="container" 
        id='App' 
        style={this.getContainerStyle()}>
        <LeftSidebar 
          open={this.state.sidebarOpen}
          width={this.state.sidebarWidth}/>
        <Header open={!this.state.sidebarOpen}/>
        <Content view={this.state.view} key={this.state.mainKey} ref="content" />
        <Footer />
      </div>
    );
  }
})