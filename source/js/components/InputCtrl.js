'use strict';

var React = require("react");

import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';

module.exports=React.createClass({
	displayName: 'InputCtrl',
	genToolbar: function(){
		switch (this.props.mode){
			case "new":
				return(
					<ToolbarGroup firstChild={true}>
						<RaisedButton label="Sačuvaj" primary={true} onTouchTap={this.props.onSave} />
					</ToolbarGroup>
				);		
			break
			case "preview":
				return(
					<ToolbarGroup firstChild={true}>
						<RaisedButton label="Izmeni" primary={true} onTouchTap={this.props.onEdit} />						
					</ToolbarGroup>
				);
			break
			case "edit":
				return(
					<ToolbarGroup firstChild={true}>
						<RaisedButton label="Sačuvaj" primary={true} onTouchTap={this.props.onSave} />
						<RaisedButton label="Obriši" secondary={true} onTouchTap={this.props.onDelete} />
					</ToolbarGroup>
				);
			break
			default:
				return true;
		}
	},
	render: function(){
		return(
			<Toolbar style={{width: "100%"}}>
				{this.genToolbar()}
				<ToolbarGroup lastChild={true} float="right">
					<IconButton 
						tooltip="zatvori"
						tooltipPosition="bottom-left"
						tooltipStyles={{fontSize: "16px"}}
						onTouchTap={this.props.onClose}>
						<NavigationClose />
					</IconButton>				
				</ToolbarGroup>
			</Toolbar>		
		)
	}
})