module.exports = {
   devtool: 'source-map',
   entry: "./dev/EntryPoints.tsx",
   mode: "development",
   target: 'node',
   output: {
      filename: "./cmn-bundle.js",
      devtoolModuleFilenameTemplate: '[resource-path]', // removes the webpack:/// prefix
      libraryTarget: 'commonjs'
   },
   resolve: {
      extensions: ['.tsx', '.js', '.css'],
   },
   module: {
      rules: [
         {
            test: /\.tsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'ts-loader',
               options: {
                  configFile: "tsconfig-core.json"
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