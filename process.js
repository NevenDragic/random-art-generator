const fs = require("fs");
const path = require("path");
const util = require("util");

const dir = `${__dirname}/layers`;
const width = 1000;
const height = 1000;

//read all directories from layers directory
const readLayersDir = () => {
	try {
		//get all dirs
		const layers = fs.readdirSync(dir);
		//filter - only dirs that have number before # in name (e.g. 01#) - this is layer order - specified in documentation
		const cleanLayers = layers.filter((item) => /^\d+#/.test(item));
		return cleanLayers;
	} catch (e) {
		console.log(e);
	}
};

//get all items from feature directory
const readFeatureDir = (_feature) => {
	try {
		//get all feature layers
		const featureLayers = fs.readdirSync(`${dir}/${_feature}`);
		//filter only layers - ignore other files - only PNG supported (for now)
		const cleanFeatureLayers = featureLayers.filter((item) => {
			return path.extname(item).toLowerCase() === ".png";
		});

		const featureLayerItemDetails = cleanFeatureLayers.map((item, index) => {
			return {
				id: index + 1,
				fileName: item,
				rarity: getRarity(item),
			};
		});
		return featureLayerItemDetails;
	} catch (e) {
		console.log(e);
	}
};

//Create item properties, such as rarity
const getRarity = (_item) => {
	//Rarity is defined with special naming within a layer file
	// 1-100% defined on end of the name string, example body_01_[33].png (rarity set to 33%)
	//Get rarity from file name - rarity is set between [] brackets
	let rarity;
	if (_item.match(/\[(\d+)\]/)) {
		const extractRarityPercentage = _item.match(/\[(\d+)\]/)[1];
		rarity = parseInt(extractRarityPercentage);
	} else {
		//if rarity is not defined set it randomly to 1-99%
		let randomNumber = Math.floor(Math.random() * 99) + 1;
		rarity = randomNumber;
	}
	return rarity;
};

const getFeatureId = (_feature) => {
	//get feature id from feature name - feature id is set at start of the name string up to first #
	const featureId = _feature.match(/^(\d+)/)[1];
	return featureId;
};

const buildFeaturesObject = () => {
	try {
		const FEATURES = [];
		//get all directories
		const featureLayerDirs = readLayersDir();
		//go over all directories and grab all available feature variant from each directory
		featureLayerDirs.forEach((feature) => {
			FEATURES.push({
				id: getFeatureId(feature),
				name: feature,
				location: `${dir}/${feature}`,
				items: readFeatureDir(feature),
			});
		});
		return FEATURES;
	} catch (e) {
		console.log(e);
	}
};
const featureLayerData = buildFeaturesObject();
console.log(util.inspect(featureLayerData, { showHidden: false, depth: null, colors: true }));

module.exports = { featureLayerData, width, height };
