const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

const config = {
  mode,
  entry: './src/index.js',
  devtool: mode === 'development' ? 'inline-source-map' : undefined,
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[hash].[name][ext]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      favicon: './src/assets/icon/Favicon.png'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')]
              }
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg|mp3|wav|ogg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  devServer: {
    static: './dist',
  },
}

if (config.mode !== 'development') {
  config.entry = ['@babel/polyfill', './src/index.js'];

  delete config.module.rules.at(-1).type;
  config.module.rules.at(-1).use = [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
        },
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        webp: {
          quality: 75
        }
      }
    },
  ];

  config.module.rules.push({
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  });

}

module.exports = config;