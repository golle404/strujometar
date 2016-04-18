'use strict';

var React = require("react");

module.exports=React.createClass({
	displayName: 'CheckGroup',
	render: function(){
		return(
			<div className="input-group">
				<input 
					type="checkbox"
					onChange={this.props.onChange} 
					disabled = {this.props.disabled}
					id={this.props.id}
					name = {this.props.name}  
					value = {this.props.value}
					checked = {this.props.value}
					defaultChecked = {this.props.value} />
				<label htmlFor={this.props.id}>{this.props.label}</label>
			</div>
		);
	}
})
