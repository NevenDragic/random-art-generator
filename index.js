const fs = require("fs");
const ARGS = process.argv.slice(2);

const path = require("path");
const { featureLayerData, width, height } = require("./process");
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const imageNumber = ARGS.length > 0 ? Number(ARGS[0]) : 1;

const saveLayer = (_canvas, _imageNumber) => {
	fs.writeFileSync(path.join(__dirname, `/generated/${_imageNumber}.png`), _canvas.toBuffer("image/png"));
};

const drawLayer = async (_feature, _imageNumber) => {
	//temporary rarity variable
	let item = _feature.items[Math.floor(Math.random() * _feature.items.length)];
	//

	const img = await loadImage(path.join(`${_feature.location}/${item.fileName}`));

	ctx.drawImage(img, 0, 0, 1000, 1000);

	saveLayer(canvas, _imageNumber);
};

for (let i = 1; i <= imageNumber; i++) {
	featureLayerData.forEach((feature) => {
		drawLayer(feature, i);
	});
	console.log("creating image", +i);
}
