function importAll(r) {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const IMAGES = importAll(require.context('../../assets/pieces', false, /\.png$/));

export default IMAGES;
