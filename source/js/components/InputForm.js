'use strict';

var React = require("react");

import Paper from 'material-ui/lib/paper';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';

var DateTimeFormat = global.Intl.DateTimeFormat;


module.exports=React.createClass({
	displayName: 'InputForm',
	formatDisc: function(disc){
		return Math.round(disc*100)/100
	},
	render: function(){
		var disabled = this.props.mode === "preview";
		var ntField;
		var vtLabel = "Jedinstvena tarifa";
		if(this.props.brType===2){
			vtLabel = "Viša Tarifa";
	    	ntField = <TextField
						id="input-nt" 
						name="nt"
						disabled={disabled}
						value = {this.props.entry.nt} 
						onChange={this.props.onChange}
						hintText="Novo stanje"
					    floatingLabelText="Niža Tarifa" />
	    }
		return (
				<div className='input-form'>
					<DatePicker 
						cancelLabel="Odustani"
						okLabel='Prihvati'
						floatingLabelText="Datum očitavanja"
						locale = "sr-Latn-RS"
						DateTimeFormat={DateTimeFormat}
						hintText="Datum očitavanja"
						disabled={disabled}
						defaultDate={new Date(this.props.entry.date)}
						value = {new Date(this.props.entry.date)}
						onChange={this.props.onDateChange} />					
					<TextField
						id="input-vt" 
						name="vt"
						disabled={disabled}
						value = {this.props.entry.vt} 
						onChange={this.props.onChange}
						hintText="Novo stanje"
					    floatingLabelText={vtLabel} />
				    {ntField}
					<Checkbox
						style={{width: "auto"}}
						labelStyle={{width: "auto"}}
						id="discount-check" 
						label="Ostvaren popust" 
						name="discount-switch" 
						disabled={disabled}
						defaultChecked={this.props.isDiscount}
						checked = {this.props.isDiscount} 
						onCheck={this.props.onToggleDiscount} />
					<TextField
						style={{display: this.props.isDiscount ? "block" : "none"}}
						id="input-discount" 
						hintText="Na iznos" 
						floatingLabelText="Na iznos" 
						name="ozp"
						disabled={disabled} 
						value = {this.props.entry.ozp}
						onChange={this.props.onDiscChange} /> 
				</div>
		);
	}
})