interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string;
    readonly VITE_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_PUBLIC_KEY: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_REACT_APP_PUBLIC_POSTHOG_HOST: string;
    readonly VITE_REACT_APP_PUBLIC_POSTHOG_KEY: string;
    readonly DEV: boolean;
    // Add other variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
    
  }
  