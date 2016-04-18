'use strict';

var React = require("react");

module.exports=React.createClass({
  displayName: 'InputGroup',
  render: function(){
    return(
      <div className="input-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input 
          type="text"
          disabled = {this.props.disabled}
          onChange={this.props.onChange} 
          id={this.props.id}
          name = {this.props.name}  
          value = {this.props.value}  
          placeholder={this.props.placeholder} />
      </div>
    );
  }
})
