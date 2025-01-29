const path = require('path');

module.exports = {
  entry: {
    index: './static/js/index.js',
    search: './static/js/search.js',
    doctorProfile: './static/js/docProfile.js',
    profileList: './static/js/profileList.js',
    editDescription: './static/js/editDescription.js',
    manageSpecs: './static/js/manageSpecs.js',
    dateSchedule: './static/js/dateSchedule.js',
    myDates: './static/js/mydates.js',
    deleteAccount: './static/js/deleteAccount.js',
    manageSchedule: './static/js/manageSchedule.js',
    PatientsManagement: './static/js/PatientsManagement.js',
    SelectPatient: './static/js/SelectPatient.js',
    showMessages: './static/js/showMessages.js',
  }, // Your main React file
  output: {
    path: path.resolve(__dirname, 'static/dist'),
    filename: '[name].bundle.js', // Output file to include in your Django templates
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // For both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allows omitting extensions when importing
  },
  mode: 'development', // Change to 'production' for optimized bundles
};
