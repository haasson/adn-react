const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const PATHS = {
   src: path.join(__dirname, '../src'),
   build: path.join(__dirname, '../build'),
   assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'))

let conf = {
   externals: {
      paths: PATHS
   },
   entry: {
      main: PATHS.src
   },
   output: {
      path: PATHS.build,
      filename: `${PATHS.assets}js/[name].js`,
      publicPath: ''
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: `${PATHS.assets}css/[name].css`,
      }),
      ...PAGES.map(page => new HtmlWebpackPlugin({
         template: `${PAGES_DIR}/${page}`,
         filename: `./${page.replace(/\.pug/, '.html')}`
      })),
      new CopyWebpackPlugin([
         {
            from: `${PATHS.src}/img`,
            to: `${PATHS.assets}img`
         },
         {
            from: `${PATHS.src}/fonts`,
            to: `${PATHS.assets}fonts`
         },
         {
            from: `${PATHS.src}/svg/single`,
            to: `${PATHS.assets}svg`
         },
      ]),
      new SpriteLoaderPlugin(),

   ],
   module: {

      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
                  plugins: [
                     "transform-object-assign",
                     "@babel/plugin-transform-react-jsx",
                     "@babel/plugin-proposal-class-properties"
                  ]
               }
            }
         },
         {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader'
         },
         {
            test: /\single.svg$/,
            loader: 'file-loader',
            options: {
               name: `${PATHS.assets}[name].[ext]`
            }
         },
         {
            test: /\.css$/,
            use: [
               'style-loader',
               MiniCssExtractPlugin.loader,
               {
                  loader: 'css-loader',
                  options: { sourceMap: true }
               },
               {
                  loader: 'postcss-loader',
                  options: {
                     sourceMap: true,
                     config: {
                        path: 'postcss.config.js'
                     }
                  }
               },
            ]
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               'style-loader',
               MiniCssExtractPlugin.loader,
               {
                  loader: 'css-loader',
                  options: { sourceMap: true }
               },
               {
                  loader: 'postcss-loader',
                  options: {
                     sourceMap: true,
                     config: {
                        path: 'postcss.config.js'
                     }
                  }
               },
               {
                  loader: 'sass-loader',
                  options: { sourceMap: true }
               },
            ]
         },
         {
            test: /^((?!\single).)*svg$/,
            loader: 'svg-sprite-loader',
            options: {
               extract: true,
               spriteFilename: 'assets/svg-sprite/icons.svg',
            }
         },
         {
            test: /\.pug$/,
            loader: 'pug-loader',
         },
         {
            test: /\.(ttf|eot|woff|woff2)$/,
            use: {
               loader: "file-loader",
               options: {
                  name: `../fonts/[name].[ext]`,
               }
            }
         },
      ]
   }
}

module.exports = conf;