// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Gunakan ini, bukan 'tailwindcss'
    autoprefixer: {},
  },
}