import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: {
    index: './public/client.js',
    iframe: './public/container.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};