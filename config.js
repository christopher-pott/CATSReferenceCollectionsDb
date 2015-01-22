var config = {}

config.imageDir = process.env.HOME + '/data/catsdb/'; /*Path to store user uploaded images*/
config.port = process.env.PORT || 3000;

module.exports = config;
