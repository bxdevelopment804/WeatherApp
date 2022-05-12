require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
});
module.exports = {
	siteMetadata: {
		title: `Weather App 4`,
		siteUrl: `https://www.yourdomain.tld`,
	},
	plugins: [
		'gatsby-plugin-sass',
		'gatsby-plugin-image',
		'gatsby-plugin-sitemap',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/images/',
			},
			__key: 'images',
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: `GatsbyJS`,
				short_name: `GatsbyJS`,
				start_url: `/`,
				background_color: `#f7f0eb`,
				theme_color: `#a2466c`,
				display: `standalone`,
				icon: `src/images/partly_cloudy_day.svg`,
			},
		},
	],
};
