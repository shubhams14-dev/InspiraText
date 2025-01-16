import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import { Provider } from "react-redux";
import store from "./store";

import { EditorContextProvider } from "./context/EditorContext";

import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
  autocapture: import.meta.env.DEV ? false : true,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <ThemeProvider theme={theme}>
        <EditorContextProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </EditorContextProvider>
        <Toaster />
      </ThemeProvider>
    </PostHogProvider>
  </React.StrictMode>
);
