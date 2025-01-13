import { createContext, useContext, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Alert from "editorjs-alert";
import CheckList from "@editorjs/checklist";
import Link from "@editorjs/link";
import Code from "@editorjs/code";
import Button from "editorjs-button";
import InlineCode from "@editorjs/inline-code";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";

import { uploadAssets } from "../api";
import { GenerateWithAiButton } from "../components/GenerateWithAiButton";
import Title from "title-editorjs";
import toast from "react-hot-toast";

const EditorContext = createContext<any>(null);

function EditorContextProvider(props: any) {
  const [editor, setEditor] = useState<EditorJS | null>(null);

  const initializeEditor = async (
    readOnly: boolean = false,
    data: OutputData | undefined = undefined
  ) => {
    const editorjs = new EditorJS({
      minHeight: 50,
      holder: "editorjs",
      placeholder: "Start writing your blog here...",
      onReady: () => {
        setEditor(editorjs);
      },
      data: data,
      readOnly: readOnly,
      tools: {
        textAlignment: {
          class: AlignmentBlockTune,
          config: {
            default: "left",
            blocks: {
              header: "center",
            },
          },
        },
        title: {
          class: Title,
        },
        alert: {
          class: Alert,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+A",
          config: {
            types: [
              { label: "Info", value: "info" },
              { label: "Warning", value: "warning" },
              { label: "Danger", value: "danger" },
              { label: "Success", value: "success" },
            ],
            messagePlaceholder: "Enter your message",
          },
        },
        list: {
          class: List,
          tunes: ["textAlignment"],
          config: {
            defaultStyle: "unordered",
          },
        },
        checklist: {
          class: CheckList,
          tunes: ["textAlignment"],
        },
        image: {
          class: ImageTool,
          config: {
            field: "assetFiles",
            types: "image/png, image/jpg, image/jpeg, image/webp",
            onError: (error: any) => {
              toast.error(error);
            },
            uploader: {
              uploadByFile: async (file: File) => {
                return uploadAssets([file])
                  .then((res) => {
                    return {
                      success: 1,
                      file: {
                        url: res.data[0],
                      },
                    };
                  })
                  .catch((error) => {
                    console.log(error);
                    return {
                      success: 0,
                    };
                  });
              },
              uploadByUrl: (_url: string) => {
                return new Promise((resolve) => {
                  resolve({
                    success: 1,
                    file: {
                      url: _url,
                    },
                  });
                });
              },
            },
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              codepen: true,
            },
          },
        },
        link: Link,
        code: {
          class: Code,
          config: {
            placeholder: "Enter code here...",
          },
        },
        button: {
          class: Button,
          config: {
            placeholder: "Enter button text...",
            text: "Click me",
            link: "https://google.com",
            target: "_blank",
          },
        },
        Marker: {
          class: ColorPlugin,
          config: {
            defaultColor: "#9674d4",
            type: "color",
          },
        },
        inlineCode: {
          class: InlineCode,
        },
        generateWithAi: {
          class: GenerateWithAiButton,
          config: {
            buttonHTML: `<p style="font-size:12px; padding: 0px 10px; margin: 0px;">Generate AI</p>`,
          },
        },
      },
    });
  };

  return (
    <EditorContext.Provider value={{ editor, initializeEditor }}>
      {props.children}
    </EditorContext.Provider>
  );
}

const useEditorContext = () => {
  return useContext(EditorContext);
};

export { EditorContext, EditorContextProvider, useEditorContext };
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.tsx";

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
