'use strict'
const csv = require('csv-parser');
const fs = require('fs');
var stringify = require('csv-stringify');
const fastCSV = require('fast-csv');
const s3Upload = require('./s3storage');

const FileType = require('file-type');
// fs.createReadStream('data.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });
var someData = [
    {
        "Country": "Nigeria",
        "Population": "200m",
        "Continent": "Africa",
        "Official Language(s)": "English"
    },
    {
        "Country": "India",
        "Population": "1b",
        "Continent": "Asia",
        "Official Language(s)": "Hindi, English"
    },
    {
        "Country": "United States of America",
        "Population": "328m",
        "Continent": "North America",
        "Official Language": "English"
    },
    {
        "Country": "United Kingdom",
        "Population": "66m",
        "Continent": "Europe",
        "Official Language": "English"
    },
    {
        "Country": "Brazil",
        "surname": 'White',
        "Continent": "South America",
        "Official Language": "Portugese"
    }
]

//   stringify(someData, {
//     header: true
// }, function (err, output) {
//     fs.writeFile(__dirname+'/someData.csv', output);
// })
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  
const data = [
    {
      name: 'John',
      surname: 'Snow',
      age: 26,
      gender: 'M'
    }, {
      name: 'Clair',
      surname: 'White',
      age: 33,
      gender: 'F',
    }, {
      name: 'Fancy',
      surname: 'Brown',
      age: 78,
      gender: 'F'
    }
  ];
// const csvWriter = createCsvWriter({
//     path: 'out.csv',
//     header: [
//       {id: 'name', title: 'Name'},
//       {id: 'surname', title: 'Surname'},
//       {id: 'age', title: 'Age'},
//       {id: 'gender', title: 'Gender'},
//     ]
//   });
//   csvWriter
//   .writeRecords(data)
//   .then(()=> console.log('The CSV file was written successfully'));
const export_csv = async () => {
  const flightId = Date.now();
  var ws = fs.createWriteStream(`${flightId}.csv`);
  await fastCSV.write(data, {headers: true}).on('finish', async function() {
console.log('write csv successfully');
    try {
      await s3Upload.s3Upload(flightId, `${flightId}.csv`)
    } catch (err) {
      console.log('--->err', err);
    }
  }).pipe(ws);
}

export_csv();