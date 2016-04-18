'use strict';

var React = require("react");
var DatePicker = require("react-datepicker");
var moment = require("moment");


module.exports=React.createClass({
	displayName: 'DateInput',
	render: function(){
		return(
			<div className="input-group">
				<label htmlFor={this.props.id}>{this.props.label}</label>
		        <DatePicker
		          onChange = {this.props.onChange} 
		          id = {this.props.id}
		          disabled = {this.props.disabled}
		          selected = {moment(this.props.value)} 
		          dateFormat="DD/MM/YYYY"
		          name = {this.props.name}  />
			</div>
		);
	}
})
