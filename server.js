const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const spawn = require("child_process").spawn;
const bodyParser = require('body-parser');
const csv1 = require('csvtojson');
const { query } = require('express');
const dotenv = require('dotenv');
dotenv.config();

const results = [];
const topNews = [],
    localNews = [],
    economicImpact = [],
    scienceResearch = [],
    travelImpact = [];

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static/map'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'lander.html'));
});

app.post('/evaChatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'lander.html'));
})

let predictions;
app.post('/preditionsModel', (req, res) => {
    res.render('index', { data: { prediction1: null } });
})

app.get('/preditionsModel', (req, res) => {
    res.render('index', { data: { prediction1: null } });
})
app.get('/newsAndTweets', (req, res) => {
    fs.createReadStream('./Tweets/All-Tweets.csv')
        .pipe(csv())
        .on('data', (data) => { if (data != undefined) results.push(data) })
        .on('end', () => {
            fs.createReadStream('./Tweets/Top News.csv')
                .pipe(csv())
                .on('data', (data) => { if (data != undefined) topNews.push(data) })
                .on('end', () => {
                    fs.createReadStream('./Tweets/Local newsSuggested locations.csv')
                        .pipe(csv())
                        .on('data', (data) => { if (data != undefined) localNews.push(data) })
                        .on('end', () => {

                            fs.createReadStream('./Tweets/Economic Impact.csv')
                                .pipe(csv())
                                .on('data', (data) => { if (data != undefined) economicImpact.push(data) })
                                .on('end', () => {

                                    fs.createReadStream('./Tweets/Science and Research.csv')
                                        .pipe(csv())
                                        .on('data', (data) => { if (data != undefined) scienceResearch.push(data) })
                                        .on('end', () => {


                                            fs.createReadStream('./Tweets/Travel Impact.csv')
                                                .pipe(csv())
                                                .on('data', (data) => { if (data != undefined) travelImpact.push(data) })
                                                .on('end', () => {
                                                    res.render("newsTweets", { tweets: results, topNews: topNews, localNews: localNews, economicImpact: economicImpact, scienceResearch: scienceResearch, travelImpact: travelImpact })

                                                });

                                        });
                                });

                        });
                });
        });
});
app.post('/predictions', (req, res) => {

    let date_query = req.body.name.split('-').reverse().join('-');
    let dd = new Date(req.body.name)

    var datetime = new Date();
    let limit = new Date(2022, 4, 12)
    let today = datetime;
    // console.log('ssd',today)
    const converter = csv1()
        .fromFile('./predictions.csv')
        .then((json) => {
            if (dd < today && !dd.toISOString().split('T')[0] == today.toISOString().split('T')[0]) { //Number(d)<Number(today[2]) && Number(m)<Number(today[1]) && Number(y)<Number(today[0])){
                predictions = [`Please enter a date which is either today or after today.`, ``];
                console.log(today, dd, dd.toISOString().split('T')[0], today.toISOString().split('T')[0])
                res.redirect('/output');
            } else if (dd > limit) {
                predictions = [`On ${date_query} ,it is predicted to have a maximum of ${0} infected cases in India.`, ``];
                res.redirect('/output');
            } else {

                let peak_date = (json.reverse())[0].date
                let peak_infected = json[0].I

                json.forEach(data => {
                    if (data.date == date_query) {

                        predictions = [`On ${data.date} ,it is predicted to have a maximum of ${data.I} infected cases.`, `COVID-19 infection peak in India is expected on or after ${peak_date}, with ${peak_infected} or more infected cases.`];
                        res.redirect('/output');
                    }
                })
            }

        })
});

app.get('/output', (req, res) => {
    res.render('index', { data: { prediction1: predictions[0], prediction2: predictions[1], prediction3: predictions[2] } });
});

app.get('/maps', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'map.html'));
})

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'about.html'));
})

app.get("/worldMap", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'worldMaps.html'));
})

app.get("/worldMap1", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'worldMaps1.html'));
})

app.get("/IndiaMap", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'IndiaMap.html'));
})

// app.listen(3000, () => console.log("Listening at port 3000...."));
app.listen(process.env.PORT || 3000)
