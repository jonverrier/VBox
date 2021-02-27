module.exports = {
   devtool: 'source-map',
   entry: "./dev/app.tsx",
   mode: "development",
   target: 'node',
   output: {
      filename: "./client-bundle.js",
      devtoolModuleFilenameTemplate: '[resource-path]',  // removes the webpack:/// prefix
      libraryTarget: 'commonjs'
   },
   resolve: {
      extensions: ['.tsx', '.js', '.css']
   },
   module: {
      rules: [
         {
            test: /\.tsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'ts-loader',
               options: {
                  configFile: "tsconfig.json"
               }
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