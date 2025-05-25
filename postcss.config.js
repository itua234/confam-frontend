import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss').ProcessOptions} */
export default {
    plugins: [tailwindcss, autoprefixer],
    // plugins: {
    //     '@tailwindcss/postcss': {},
    //     autoprefixer: {},
    // },
};
// export default {
//   plugins: {
//     '@tailwindcss/postcss': {},
//     autoprefixer: {},
//   },
// }