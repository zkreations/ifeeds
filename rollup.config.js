import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/js/feeds.js',
    format: 'umd',
    name: 'Feeds'
  },
  plugins: [
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    })
  ]
}
