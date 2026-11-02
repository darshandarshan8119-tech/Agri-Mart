# Agri-MART

## Voice-first farm assistant setup

The assistant keeps the OpenRouter secret in Django; it is never sent to the browser.

1. In the backend deployment environment, set `OPENROUTER_API_KEY` to the key you provide and optionally set `OPENROUTER_MODEL` to a vision- and tool-calling-capable OpenRouter model. See [backend/.env.example](backend/.env.example) for the variable names.
2. Start the Django API on port 8000 and the Vite frontend on port 5173 as usual.
3. Open **Agri-AI Copilot** and choose English, Hindi, or Kannada. Use the microphone for speech input, the camera button for crop/soil/field images, and **Listen** to have answers read aloud.

Image uploads run through the project's disease model when requested; other image questions are sent to the selected vision-capable OpenRouter model. Crop recommendations, yield forecasts, growth status, and market data are available to the model as project tools.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
