// filepath: /webpack.mix.js
const mix = require('laravel-mix');

mix.js('resources/react/app.js', 'public/js').react()
    .postCss('resources/css/app.css', 'public/css', [
        require("tailwindcss"),
    ])
