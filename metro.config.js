const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for web extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

// Add support for chess files
config.resolver.assetExts = [...config.resolver.assetExts, 'pgn', 'fen'];

module.exports = config;
