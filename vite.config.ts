import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.async function askQuestion(question: string) {
  const res = await fetch("/.netlify/functions/decoder", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  return data;
}
': JSON.stringify(env.async function askQuestion(question: string) {
  const res = await fetch("/.netlify/functions/decoder", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  return data;
}
),
        'process.env.async function askQuestion(question: string) {
  const res = await fetch("/.netlify/functions/decoder", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  return data;
}
': JSON.stringify(env.async function askQuestion(question: string) {
  const res = await fetch("/.netlify/functions/decoder", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  return data;
}
)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
