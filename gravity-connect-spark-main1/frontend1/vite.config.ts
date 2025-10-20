import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@project1': path.resolve(__dirname, 'src/project1'),
      '@project2': path.resolve(__dirname, 'src/project2'),
    },
  },
});
