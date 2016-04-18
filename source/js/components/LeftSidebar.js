'use strict';

var React = require("react");
var AppStore = require("../stores/appStore.js");

import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import Divider from 'material-ui/lib/divider';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';

var actions = require('../actions/actions.js');

module.exports=React.createClass({
	displayName: 'LeftSidebar',
	getInitialState: function(){
		return {viewList: AppStore.getViewsList()}
	}, 
	toggleSidebar: function(){
		actions.toggleSidebar();
	},
	openView: function(view){
		actions.openView(view);
	},
	render: function(){
		var openView = this.openView;
		return (
				<LeftNav
					onRequestChange={this.toggleSidebar} 
					docked={true} 
					open={this.props.open}
					width={this.props.width}>
					<AppBar
						title="Meni"
						showMenuIconButton={false}
						iconElementRight={
							<IconButton onTouchTap={this.toggleSidebar}>
								<NavigationClose />
							</IconButton>
						} />
					{this.state.viewList.map(function(v, i){
						if(!v.divider){
							return (
								<MenuItem 
									key={i}
									onTouchTap={openView.bind(null, v.name)}
									primaryText={v.label}
									leftIcon={<v.icon />} />				
							)
						}else{
							return <Divider key={i} />
						}
					})}	 
		        </LeftNav> 
		);
	}
})
/*

		          <MenuItem 
		            onTouchTap={this.newEntry}
		            primaryText="Novi Unos"
		            leftIcon={<NewIcon />} />
	              <Divider />
		          <MenuItem 
		            onTouchTap={this.openList}
		            primaryText="Lista Obračuna"
		            leftIcon={<ListIcon />} />
		          <MenuItem 
		            onTouchTap={this.openGraph}
		            primaryText="Grafikon Potrošnje"
		            leftIcon={<GraphIcon />} />

*/