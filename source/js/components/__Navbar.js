'use strict';

var React = require("react");
var actions = require('../actions/navbarActions.js');

module.exports=React.createClass({
  displayName: 'Navbar',
  newEntry: function(){
    actions.newEntry();
  },
  openList: function(){
    actions.openList();
  },
  openGraph: function(){
    actions.openGraph();
  },
  render: function(){
    return(
      <div className='navbar'>
        <div className="btn" onClick={this.openList}>Lista Obračuna</div>
        <div className="btn" onClick={this.openGraph}>Grafikon Potrošnje</div>
        <div className="btn" onClick={this.newEntry}>Novi Unos</div>
      </div>
    );
  }
})


