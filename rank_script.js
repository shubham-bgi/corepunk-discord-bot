const rarity = require("./data/rarity_weights");
const metadata = require("./data/_metadata_copy.json");
const {writeFileSync} = require('fs');
let metadataCopy = [...metadata]
metadataCopy = metadataCopy.map((element, index) => {
    element.score = 0;
    element.attributes.forEach((atribute) => {
        const obj = rarity[atribute.trait_type].find((obj) => obj.trait == atribute.value);
        element.score += +obj.occurrence.split('%').shift();
    });
    return element;
});

metadataCopy.sort(function(a, b) {
    let keyA = a.score;
    let keyB = b.score;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

metadataCopy = metadataCopy.map((element, index) => {element.rank = index+1; return element;});

metadataCopy.sort(function(a, b) {
let keyA = a.edition;
let keyB = b.edition;
if (keyA < keyB) return -1;
if (keyA > keyB) return 1;
return 0;
});

writeFileSync('./data/metadata_rank.json', JSON.stringify(metadataCopy));