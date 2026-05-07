// import Vite configuration function
import { defineConfig } from "vite"

// import React plugin for Vite
import react from "@vitejs/plugin-react"

// export Vite configuration
export default defineConfig({

    // enable React support
    plugins: [react()],

    // test configuration for Vitest
    test: {

        // make test functions global
        globals: true,

        // use browser-like environment for React testing
        environment: "jsdom",

        // setup file for test configuration
        setupFiles: "./src/tests/setup.js"
    }
})
