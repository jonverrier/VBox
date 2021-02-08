module.exports = {
   devtool: 'source-map',
   entry: "./client/app.tsx",
   mode: "development",
   output: {
      filename: "./app-bundle.js",
      devtoolModuleFilenameTemplate: '[resource-path]'  // removes the webpack:/// prefix
   },
   resolve: {
      extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx', '.css']
   },
   module: {
      rules: [
         {
            test: /\.tsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'ts-loader'
            }
         },
         {
            test: /\.css$/,
            use: [{
               loader: 'css-loader'
            },
            {
               loader: 'style-loader'
            }]
         }
      ]
   }
}