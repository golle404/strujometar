'use strict';

var React = require("react");

import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

module.exports=React.createClass({
	displayName: 'FilterCtrl',
	getInitialState: function(){
		this.store = require("../stores/appStore.js");
		return {years: this.store.getYears()}
	},
	onChange: function(e, i){
		if(i===-1){
			this.props.filterLatest()
		}else if(i===0){
			this.props.filterAll()
		}else{
			this.props.filterYear(i)	
		}
	},
	render: function(){
		var filterYear = this.props.filterYear;
		var activeIndex = this.props.activeIndex;
		return(
			<Toolbar>
				<ToolbarGroup firstChild={true} >
					<IconButton>{<this.props.icon />}</IconButton>
					<ToolbarTitle text={this.props.title} />
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
					<IconMenu
						iconButtonElement={
						<IconButton 
							tooltip="filter"
							tooltipPosition="bottom-left"
							tooltipStyles={{fontSize: "16px"}} >
							<MoreVertIcon />
						</IconButton>
					        }
						value={activeIndex} 
						onChange={this.onChange}>
						<MenuItem value={-1} primaryText="Poslednji"/>
				        <MenuItem value={0} primaryText="Svi"/>
				        {this.state.years.map(function(v, i){
						return	(
							<MenuItem value={v} primaryText={v} key={i} />
							)
						})}
					</IconMenu>
				</ToolbarGroup>
			</Toolbar>
		);
	}
})