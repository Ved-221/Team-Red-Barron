const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const rawPixelmatch = require('pixelmatch');
const pixelmatch = rawPixelmatch.default || rawPixelmatch;

function diffImages(img1Path, img2Path, diffOutputPath) {
  if (!fs.existsSync(img1Path)) {
    throw new Error(`File not found: ${img1Path}`);
  }
  if (!fs.existsSync(img2Path)) {
    throw new Error(`File not found: ${img2Path}`);
  }

  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  const { width, height } = img1;
  if (img2.width !== width || img2.height !== height) {
    return {
      match: false,
      diffPixels: -1,
      totalPixels: width * height,
      error: `Dimension mismatch: ${width}x${height} vs ${img2.width}x${img2.height}`
    };
  }

  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1
  });

  if (diffOutputPath && diffPixels > 0) {
    fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));
  }

  return {
    match: diffPixels === 0,
    diffPixels,
    totalPixels: width * height,
    diffPercentage: ((diffPixels / (width * height)) * 100).toFixed(4)
  };
}

module.exports = { diffImages };

if (require.main === module) {
  const [,, file1, file2, diffOut] = process.argv;
  if (!file1 || !file2) {
    console.log("Usage: node scripts/diff.js <file1.png> <file2.png> [diffOut.png]");
    process.exit(1);
  }
  const result = diffImages(file1, file2, diffOut);
  console.log("Diff result:", result);
}

