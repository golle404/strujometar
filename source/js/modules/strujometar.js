'use strict';
var clone = require("clone");
var df = require("dateformat");

var meseci = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]


module.exports = function(curr, prev, sett, config) {
	if (!prev) {
		return {error: "Nema prethodnog unosa",
				period: formatPeriod(curr.date)};
	};
	var days = dateDiff(curr.date, prev.date);

	var totalNt = curr.nt - prev.nt;
	var totalVt = curr.vt - prev.vt;
	var totalKw = totalNt + totalVt;
	var ratioNt = totalNt / totalKw;
	if (totalNt < 0 || totalVt < 0) {
		return {error: "Nepotpuni ili neispravni podaci"};
	};
	//find right config
	var c = config.dt;
	if(sett.brType === 1){
		c = config.jt
	}
	var cfg = clone(getConfig(curr.date, c));
	cfg.days = days;
	cfg.date = curr.date;
	cfg.ratioNt = Math.round(ratioNt * 100) / 100;
	cfg.ratioVt = Math.round((1-ratioNt) * 100) / 100;
	cfg.totalPot = 0;
	cfg.totalKw = totalKw;
	cfg.totalNt = totalNt;
	cfg.totalVt = totalVt;
	cfg.period = formatPeriod(curr.date)
	cfg.periodShort = formatPeriod(curr.date, true)
	cfg.obs = sett.obrSnaga
	cfg.totalObs = cfg.obrSnaga * cfg.obs;
	cfg.totalTPP = cfg.naknadaZPP * totalKw;

	//adjust limits and calc kwh per zone
	cfg.zone.map(function(v){
		v.gornjiLimit = v.gornjiLimit < 0 ? Number.MAX_SAFE_INTEGER : v.gornjiLimit;
		v.donjiLimit = days * v.donjiLimit/30;
		v.gornjiLimit = days * v.gornjiLimit/30;

		v.kwh = Math.min(totalKw - v.donjiLimit, v.gornjiLimit);
		v.kwh = Math.max(v.kwh, 0);
		v.nt = ratioNt * v.kwh;
		v.vt = v.kwh - v.nt;
		v.totalNt = v.cenaNt * v.nt;
		v.totalVt = v.cenaVt * v.vt;
		v.total = v.totalNt + v.totalVt;
		cfg.totalPot += v.total;
		return v;
	})
	//prosečna cena po kw
	cfg.pcpkw = cfg.totalPot / totalKw;
	//zaduženje za el. energiju
	cfg.zzElEn = cfg.totalPot + cfg.totalObs + cfg.trosakJS;
	//popust
	cfg.discount = -(prev.ozp || 0) * cfg.popust;
	//osnovica za akcizu
	cfg.ozAkc = cfg.zzElEn + cfg.totalTPP + cfg.discount;
	//akciza
	cfg.totalAkc = cfg.ozAkc * cfg.akciza;
	//osnovica za pdv
	cfg.ozPDV = cfg.ozAkc * (cfg.akciza + 1);
	//pdv
	cfg.pdv = cfg.ozPDV * cfg.porez;
	//zaduženje za obr. period
	cfg.zzop = cfg.ozPDV * (cfg.porez + 1);
	return cfg;
}

function getConfig(date, c){
	var id = 0;
	var dd = Number.MIN_SAFE_INTEGER;

	for(var i=0; i<c.length; i++){
		var ddf = dateDiff(c[i].datum, date);
		if(ddf < 0 && ddf > dd){
			dd = ddf;
			id = i;
		}
	} 
	return c[id];
}

function dateDiff(start, end){
	return Math.ceil((new Date(start) - new Date(end)) / 3600000 / 24);
}

function formatPeriod(dt, short){
	var date = new Date(dt);
	var y = date.getFullYear();
	var m = date.getMonth() - 1;
	if(m<0){
		y--;
		m+=12;
	}
	var mth = meseci[m];
	if(short){
		mth = mth.substring(0,3);
	}
	return mth + " " + y;
}