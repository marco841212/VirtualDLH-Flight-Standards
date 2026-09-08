import { createPluginConfig } from "@skyvexsoftware/stratos-sdk/vite";
import react from "@vitejs/plugin-react";


export default createPluginConfig({

  ui: {
    entry: "src/ui/index.js"
  },

  background: {
    entry: "src/background/index.ts"
  },

  vite: {
    plugins: [
      react()
    ]
  }

});
