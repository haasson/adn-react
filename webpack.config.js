const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PAGES_DIR = `./src/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'))

let conf = {
   entry: './src/index.js',
   output: {
      path: path.resolve(__dirname, 'build'), // may be not
      filename: 'js/main.js',
      publicPath: '/build'
   },
   plugins: [
      // new CleanWebpackPlugin('build', {}),
      new MiniCssExtractPlugin({
         filename: `css/[name].css`,
      }),
      ...PAGES.map(page => new HtmlWebpackPlugin({
         template: `${PAGES_DIR}/${page}`,
         filename: `./${page.replace(/\.pug/, '.html')}`
      })),
      new CopyWebpackPlugin([
         {
            from: `./src/img`,
            to: `./img`
         },
         {
            from: `./src/fonts`,
            to: `./fonts`
         },
         {
            from: `./src/svg/single`,
            to: `./svg`
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
            test: /\.(png|jpg|gif)$/,
            loader: 'file-loader',
            options: {
               name: '[name].[ext]'
            }
         },
         {
            test: /\single.svg$/,
            loader: 'file-loader',
            options: {
               name: `./[name].[ext]`
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
               spriteFilename: '/svg-sprite/icons.svg',
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
                  name: `./fonts/[name].[ext]`,
               }
            }
         },
      ]
   }
}


module.exports = conf;