var AppDispatcher = require('../dispatcher/appDispatcher.js');
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';
// Define the store as an empty array
let _store = {
  data: []
};

// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class ListStoreClass extends EventEmitter {
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }
  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
  getState() {
    return _store;
  }
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const ListStore = new ListStoreClass;

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
/*AppDispatcher.register((action) => {
  switch (action.actionType) {
	  case "DISPLAY":
      _store.display = routeList[action.text];
      AppStore.emit(CHANGE_EVENT);
    break;
    case "SAVE_INPUT":
      console.log("SAVE_INPUT");
      _store.data.push(action.val);
      _store.display = routeList.list
      AppStore.emit(CHANGE_EVENT);
    break;
	  default:
	    return true;
  }
});*/

export default ListStore;