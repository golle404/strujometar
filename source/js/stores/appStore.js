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

var calcMod = require('../modules/strujometar.js');

var CHANGE_EVENT = 'change';

var VIEWS = {
  form: EntryInput,
  list: EntryList,
  graph: GraphView,
  home: HomeView,
  settings: SettingsView
};
var _views = {};
_views.newEnt={name: "newEnt", viewClass: EntryInput, label: "Novi Unos", icon: NewIcon, sep: true};
_views.div = {divider: true};
_views.home={name: "home", viewClass: HomeView, label: "Početna", icon: HomeIcon};
_views.list={name: "list", viewClass: EntryList, label: "Lista Obračuna", icon: ListIcon};
_views.graph={name: "graph", viewClass: GraphView, label: "Grafikon Potrošnje", icon: GraphIcon};
_views.settings={name: "settings", viewClass: SettingsView, label: "Podešavanja", icon: SettingsIcon};

var breakWidth = 600;

var _store = {};

function getLocalData(){
  console.log("local");
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
  console.log("settings")
  if(window.localStorage.getItem("settings")){
    sett = JSON.parse(window.localStorage.getItem("settings"));
  }
  return sett;
}


var AppStore = Object.assign({}, EventEmitter.prototype, {
  init: function(cb){
    _store = {
      view: EntryList,
      defaultView: EntryList,
      viewKey: 0,
      data: getLocalData(),
      settings: getLocalSettings(),
      currentEntry: -1,
      sidebarOpen: window.innerWidth > breakWidth
    };
    cb();
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
  getViewsList: function(){
    var a = [];
    for(var v in _views){
      if (_views.hasOwnProperty(v)) {
        a.push(_views[v]);
      }
    }
    return a;
  },
  sidebarOpen: function() {
    return _store.sidebarOpen;
  },
  getDefaultView: function() {
    if(_store.settings.no){
      return _views['home'].viewClass;  
    }
    return _views['list'].viewClass;
  },
  getKey: function() {
    return _store.viewKey;
  },
  getCalcData: function(){
    return _store.data.map(function(v,i,a){
      return calcMod(v, a[i+1]);
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
      res.current = {vt: "", nt: "", obs:"", date: new Date(), ozp:""};  
    }
    res.prev = _store.data[_store.currentEntry + 1] || null;
    return res;
  },
  getPrev: function(){
    return _store.data[_store.currentEntry + 1];
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
    _store.view = _views.list.viewClass;
  },
  deleteEntry: function(val){
    _store.data.splice(_store.currentEntry, 1);
    this.sortEntries();
    window.localStorage.setItem("data", JSON.stringify(_store.data));
    _store.view = _views.list.viewClass;
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
    if(view === "newEnt"){
      _store.currentEntry = -1;
      _store.viewKey++;
    }
    _store.view = _views[view].viewClass;
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