import * as fs from 'fs';

let appJson = JSON.parse(fs.readFileSync('./app.json').toString());

let buildNumber = appJson.expo.ios.buildNumber;
buildNumber = (parseInt(buildNumber) + 1).toString();

appJson.expo.ios.buildNumber = buildNumber;

fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 2));

console.log('Bumped build number to: ' + buildNumber)