'use strict';

var React = require("react");
var CalcRow = require("./CalcRow.js");

var nf = require("number-format.js");
var mask = "#,###.00";
var maskPct = "##.00%";

module.exports=React.createClass({
	displayName: 'InputCalc',
	render: function(){
		var calc = this.props.calc;
		var brType = this.props.brType;
		var vtLabel = "Jedinstvena tarifa";
		if(brType===2){
			vtLabel = "Viša tarifa"
		}
		var ntRow = function(kw, cena, total){
			if(brType === 2){
				return <div className="row">
							<div className="col col-item-desc">Niža tarifa</div>
							<div className="col col-item lg-only">{nf(mask, kw)}</div>
							<div className="col col-item lg-only">{cena}</div>
							<div className="col col-item">{nf(mask, total)}</div>
						</div>	
			}
		}
		return(
			<div className="entry-table">
				<div className="lg-only">
					<div className="sub-head">
						<div>Ukupno dana: {calc.days} </div>
						{brType === 2 ? <div>Niža tarifa: {calc.totalNt}kWh ({maskPct,calc.ratioNt}%)</div> : ""}
						{brType === 2 ? <div>Viša tarifa: {calc.totalVt}kWh ({maskPct,calc.ratioVt}%)</div> : ""}
						<div>Prosečna cena: {nf(mask,calc.pcpkw)}din/kWh </div>
					</div>
				</div>
				<div className="row head">
					<div className="col col-desc">Tarifa</div>
					<div className="col col-item lg-only">Utrošeno</div>
					<div className="col col-item lg-only">Cena</div>
					<div className="col col-item">Iznos</div>
				</div>
				<CalcRow desc="Obračunska snaga"
						 amount={calc.obs}
						 price={calc.obrSnaga}
						 total={nf(mask, calc.totalObs)} />
				<CalcRow desc="Trošak javnog snabdevača"
						 total={calc.trosakJS} />
				{calc.zone.map(function(v, i){
					var classStr = "row zone "+ v.ime;
					return(
						<div className={classStr} key={i}>
							<div className="col col-zone-desc">
								<div className="zone-color">{v.ime} zona</div>
							</div>
							<div className="col col-zone-item">
								<div className="row">
									<div className="col col-item-desc">{vtLabel}</div>
									<div className="col col-item lg-only">{nf(mask, v.vt)}</div>
									<div className="col col-item lg-only">{v.cenaVt}</div>
									<div className="col col-item">{nf(mask, v.totalVt)}</div>
								</div>
								{ntRow(v.nt, v.cenaNt, v.totalNt)}
							</div>
						</div>
						)
				})}
				<CalcRow 
					desc="Ukupna potrošnja"
					amount={calc.totalKw}
					total={nf(mask, calc.totalPot)}
					klass="emp" />
				<CalcRow 
					desc="Zaduženje za el. energiju"
					total={nf(mask, calc.zzElEn)}
					klass="emp" />
				<CalcRow 
					desc="Popust" 
					total={nf(mask, calc.discount)}
					amount = {nf(maskPct, calc.popust*100)} />
				<CalcRow 
					desc="Naknada za povlašćene potrošače"
					total={nf(mask, calc.totalTPP)}
					amount={calc.totalKw}
					price={calc.naknadaZPP}  />
				<CalcRow 
					desc="Osnovica za obračun akcize"
					total={nf(mask, calc.ozAkc)}
					klass="emp" />
				<CalcRow 
					desc="Iznos akcize"
					total={nf(mask, calc.totalAkc)}
					amount = {nf(maskPct, calc.akciza*100)} />
				<CalcRow 
					desc="Osnovica za PDV"
					total={nf(mask, calc.ozPDV)}
					klass="emp" />
				<CalcRow 
					desc="Iznos PDV"
					total={nf(mask, calc.pdv)}
					amount = {nf(maskPct, calc.porez*100)} />
				<CalcRow 
					desc="Zaduženje za obračunski period"
					total={nf(mask, calc.zzop)}
					klass="emp sum" />


			</div>
		);
	}
})