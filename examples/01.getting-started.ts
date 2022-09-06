import { LifeHash } from '../ts_src';
import { LifeHashVersion } from '../ts_src/lifehash/types/LifeHashVersion';
import * as fs from 'fs';
import { Image } from '../ts_src/lifehash/Image';

const savePng = (image: Image, input: string, version: LifeHashVersion) => {
  fs.writeFile(
    `./examples/${input}-${version}.png`,
    Buffer.from(
      image.toDataUrl().substring('data:image/png;base64,'.length),
      'base64',
    ),
    function (err) {
      if (err) console.log(err);
      console.log('The file has been saved!');
    },
  );
};

const input = 'Hello, world!';

const versions = [
  LifeHashVersion.version1,
  LifeHashVersion.version2,
  // LifeHashVersion.detailed,
  // LifeHashVersion.fiducial,
  // LifeHashVersion.grayscale_fiducial,
];

versions.forEach((version) => {
  const lifehash = LifeHash.makeFrom(input, version, 1, true);

  savePng(lifehash, input, version);
});
