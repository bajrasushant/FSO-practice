// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";

// async/await not used because code here is not a function
// noteService.getAll().then((notes) => store.dispatch(setNotes(notes)));

console.log(store.getState());
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
