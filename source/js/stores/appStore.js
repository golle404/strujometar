var AppDispatcher = require('../dispatcher/appDispatcher.js');
var EventEmitter = require('events');

var EntryInput = require('../components/EntryInput.js');
var EntryList = require('../components/EntryList.js');
var GraphView = require('../components/GraphView.js');
var HomeView = require('../components/HomeView.js');
var SettingsView = require('../components/SettingsView.js');

import ListIcon from 'material-ui/lib/svg-icons/action/view-list';
import GraphIcon from 'material-ui/lib/svg-icons/av/equalizer';
import NewIcon from 'material-ui/lib/svg-icons/content/add-circle';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';

var nanoajax = require('nanoajax');
var objectAssign = require('object-assign');
var calcMod = require('../modules/strujometar.js');

var CHANGE_EVENT = 'change';

var VIEWS = {
  form: EntryInput,
  list: EntryList,
  graph: GraphView,
  home: HomeView,
  settings: SettingsView
};
var breakWidth = 600;

var _store, _sidebarData;

function getLocalData(){
  var res = [];
  if(window.localStorage.getItem("data")){
    res = JSON.parse(window.localStorage.getItem("data"));
  }
  return res.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}

function getLocalSettings(){
  var sett = {};
  if(window.localStorage.getItem("settings")){
    sett = JSON.parse(window.localStorage.getItem("settings"));
  }
  return sett;
}


var AppStore = objectAssign({}, EventEmitter.prototype, {
  init: function(cb){
    nanoajax.ajax({url:'data/config.json'}, function (code, rsp) {
      if(code === 200){
        AppStore.cfgLoaded(JSON.parse(rsp));
        cb();
      }else{
        console.log("error")
      }
    })
  },
  cfgLoaded: function(cfg){
    _store = {
      view: HomeView,
      defaultView: HomeView,
      viewKey: 0,
      data: getLocalData(),
      settings: getLocalSettings(),
      config: cfg,
      currentEntry: -1,
      sidebarOpen: window.innerWidth > breakWidth
    };
    _sidebarData = [];
    var setuped = !Boolean(_store.settings.brType)
    _sidebarData.push({action: "newEntry", label: "Novi Unos", icon: NewIcon, disabled: setuped});
    _sidebarData.push({action: "home", label: "Početna", icon: HomeIcon});
    _sidebarData.push({action: "list", label: "Lista Obračuna", icon: ListIcon, disabled: setuped});
    _sidebarData.push({action: "graph", label: "Grafikon Potrošnje", icon: GraphIcon, disabled: setuped});
    _sidebarData.push({action: "settings", label: "Podešavanja", icon: SettingsIcon});
  },
  getSidebarData: function(){
    return _sidebarData;
  },
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },
  getView: function() {
    return _store.view;
  },
  getSettings: function(){
    return _store.settings;
  },
  sidebarOpen: function() {
    return _store.sidebarOpen;
  },
  getDefaultView: function() {
    return _store.defaultView;
  },
  getKey: function() {
    return _store.viewKey;
  },
  getCalcData: function(){
    return _store.data.map(function(v,i,a){
      return calcMod(v, a[i+1], _store.settings, _store.config);
    })
  },
  getLatestData: function(){
    return this.getCalcData().slice(0, 12);
  },
  getCurrent: function(){
    var res = {};
    if(_store.data[_store.currentEntry]){
      res.current = _store.data[_store.currentEntry];
    }else{
      res.current = {vt: 0, nt: 0, date: new Date(), ozp:0};  
    }
    res.prev = _store.data[_store.currentEntry + 1] || null;
    res.calc = calcMod(res.current, res.prev, _store.settings, _store.config);
    res.brType = _store.settings.brType;
    return res;
  },
  getPrev: function(){
    return _store.data[_store.currentEntry + 1];
  },
  getCalc: function(curr, prev){
    return calcMod(curr, prev, _store.settings, _store.config);
  },
  getDataByYear: function(y){
    var gpy = this.getPeriodYear;
    return this.getCalcData().filter(function(c){
      return gpy(c.date) === y;
    })
  },
  getYears: function(){
    var gpy = this.getPeriodYear;
    return _store.data.reduce(function(p, c){
      var y = gpy(c.date);
      if(p.indexOf(y) === -1){
        p.push(y)
      }
      return p;
    },[])
  },
  getPeriodYear: function(dt){
    var date = new Date(dt);
    var y = date.getFullYear();
    if((date.getMonth() - 1) < 0){
      y--;
    }
    return y;
  },
  isNewEntry: function(){
    return _store.currentEntry === -1;
  },
  saveEntry: function(val){
    val.date = new Date(val.date).valueOf();
    if(_store.currentEntry === -1){
      _store.data.push(val);
    }else{
      _store.data[_store.currentEntry] = (val);
    }
    this.sortEntries();
    window.localStorage.setItem("data", JSON.stringify(_store.data));
    _store.view = _store.defaultView;
  },
  deleteEntry: function(val){
    _store.data.splice(_store.currentEntry, 1);
    this.sortEntries();
    window.localStorage.setItem("data", JSON.stringify(_store.data));
    _store.view = _store.defaultView;
  },  
  saveSettings: function(val){
    _store.settings = val;
    window.localStorage.setItem("settings", JSON.stringify(_store.settings));
    _sidebarData.forEach(function(d){d.disabled = false});
    _store.view = _store.defaultView;
  },
  openEntry: function(val){
    _store.currentEntry = val;
    _store.view = EntryInput;
  },
  sortEntries: function(){
    _store.data = _store.data.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
      }); 
  },
  handleResize: function(){
    _store.sidebarOpen= window.innerWidth > breakWidth;
    AppStore.emit(CHANGE_EVENT);
  },
  openView:function(view){
    if(view === "newEntry"){
      _store.currentEntry = -1;
      _store.viewKey++;
    }
    _store.view = VIEWS[view];
    if(window.innerWidth < breakWidth){
      _store.sidebarOpen = false;  
    }
  }
})

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case "TOGGLE_SIDEBAR":
      _store.sidebarOpen = !_store.sidebarOpen;
      AppStore.emit(CHANGE_EVENT);
    break;
    case "SAVE_ENTRY":
      AppStore.saveEntry(action.payload)
      AppStore.emit(CHANGE_EVENT);
    break;
    case "DELETE_ENTRY":
      AppStore.deleteEntry(action.payload)
      AppStore.emit(CHANGE_EVENT);
    break;
    case "SAVE_SETTINGS":
      AppStore.saveSettings(action.payload)
      AppStore.emit(CHANGE_EVENT);
    break;
    case "OPEN_ENTRY":
      AppStore.openEntry(action.payload)
      AppStore.emit(CHANGE_EVENT);
    break;
    case "CLOSE_ENTRY":
      _store.view = _store.defaultView;
      AppStore.emit(CHANGE_EVENT);
    break;
    case "OPEN_VIEW":
      AppStore.openView(action.payload)
      AppStore.emit(CHANGE_EVENT);
    break;
	  default:
	    return true;
  }
});

module.exports = AppStore;