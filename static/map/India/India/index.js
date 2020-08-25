//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////SETTING UP THE MAP//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var map = L.map("map", { center: [20.5937, 78.9629], crs: L.CRS.EPSG3857, zoom: 4.5, zoomControl: true, preferCanvas: false, scrollWheelZoom: false });

var northEast, southWest;

var colorScaleLayer = {
    red: 250,
    green: 211,
    blue: 147,
    rScaleFactor: 5,
    gScaleFactor: 96,
    bScaleFactor: 147,
}

var maxActive, minActive, maxcc, mincc, maxrc, minrc, mindc, maxdc, layer = null;

let activeList = [];
let ccList = [];
let dcList = [];
let rcList = [];
// map.getContainer().addEventListener('mouseover', function () {
//         map.dragging.disable();
//     });

// map.getContainer().addEventListener('mouseout', function () {
//         map.dragging.enable();
//     });

map.on('doubleclick', function(e) {
    map.panTo(e.latlng);
});
// map.on('click', function(e) {
//   closeNav();
//   // console.log(e.target.getBounds());
//   // var i;
//   // northEast = e.target.getBounds()._northEast;
//   // southWest = e.target.getBounds()._southWest;
//   // console.log(northEast.lat,northEast.lng);
//   // console.log(southWest.lat,southWest.lng);

//   // if((northEast.lat >= 35.75097043944928-1 && northEast.lat <= 35.75097043944928 + 1) && northEast.lng == 79.70031738281251 && southWest.lat == 32.01273389791075 && southWest.lng == 73.62487792968751)
//   // {
//   //  i=13
//   //  console.log(true);
//   // }

//   openNav(i);
// });

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpbWVodGEiLCJhIjoiY2tjZ3F4d2JjMGkwOTM0cXFmZjc4enVpNSJ9.-g8OjRs_-7w7nIAqNUQ90w', {
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWRpbWVodGEiLCJhIjoiY2tjZ3F4d2JjMGkwOTM0cXFmZjc4enVpNSJ9.-g8OjRs_-7w7nIAqNUQ90w'
}).addTo(map);


L.tileLayer.provider('Stadia.AlidadeSmoothDark').addTo(map);

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        map.flyTo([20.5937, 78.9629], 4.5)
    }
});


L.geoJSON(statesData).addTo(map);

fetch("https://api.rootnet.in/covid19-in/stats/latest").then(response => response.json()).then(ldata => {

    const regionalData = ldata.data.regional;
    const update = ldata.lastOriginUpdate;
    var coordinates = {};
    for (let i = 0; i < regionalData.length; i++) {
        //  console.log(regionalData[i].loc,i);
        statesData.features[i].properties.loc = regionalData[i].loc;
        statesData.features[i].properties.totalConfirmedCase = regionalData[i].totalConfirmed;
        statesData.features[i].properties.recovered = regionalData[i].discharged;
        statesData.features[i].properties.deaths = regionalData[i].deaths
        statesData.features[i].properties.activeCases = statesData.features[i].properties.totalConfirmedCase - statesData.features[i].properties.recovered - statesData.features[i].properties.deaths;
        ccList.push(statesData.features[i].properties.totalConfirmedCase)
        rcList.push(statesData.features[i].properties.recovered)
        dcList.push(statesData.features[i].properties.deaths)
        activeList.push(statesData.features[i].properties.activeCases)
    }

    maxActive = Math.max.apply(Math, activeList);
    minActive = Math.min.apply(Math, activeList);
    maxcc = Math.max.apply(Math, ccList);
    mincc = Math.min.apply(Math, ccList);
    maxrc = Math.max.apply(Math, rcList);
    minrc = Math.min.apply(Math, rcList);
    maxdc = Math.max.apply(Math, dcList);
    mindc = Math.min.apply(Math, dcList);

    coordinates["Latitude"] = [11.66702557, 14.7504291, 27.10039878, 26.7499809, 25.78541445, 30.71999697, 22.09042035, 20.26657819, 28.6699929, 15.491997, 22.2587, 28.45000633, 31.10002545, 34.29995933, 23.80039349, 12.57038129, 8.900372741, 34.209515, 21.30039105, 19.25023195, 24.79997072, 25.57049217, 23.71039899, 25.6669979, 19.82042971, 11.93499371, 31.51997398, 26.44999921, 27.3333303, 12.92038576, 18.1124, 23.83540428, 30.32040895, 27.59998069, 22.58039044];
    coordinates["Longitude"] = [92.73598262, 78.57002559, 93.61660071, 94.21666744, 87.4799727, 76.78000565, 82.15998734, 73.0166178, 77.23000403, 73.81800065, 71.1924, 77.01999101, 77.16659704, 74.46665849, 86.41998572, 76.91999711, 76.56999263, 77.615112, 76.13001949, 73.16017493, 93.95001705, 91.8800142, 92.72001461, 94.11657019, 85.90001746, 79.83000037, 75.98000281, 74.63998124, 88.6166475, 79.15004187, 79.0193, 91.27999914, 78.05000565, 78.05000565, 88.32994665];


    L.geoJson(statesData, { style: style }).addTo(map);

    // for (let i = 0; i < coordinates["Latitude"].length; i++) {
    //     // 
    //     var marker = L.marker([coordinates["Latitude"][i], coordinates["Longitude"][i]]).addTo(map)
    //         .bindPopup("<strong><b>State  : " + statesData.features[i].properties.loc + "</strong> <br><strong><b>Total Confirmed Cases : " + statesData.features[i].properties.totalConfirmedCase + "</striong><br><strong><font color= red>Deaths : " + statesData.features[i].properties.deaths + "</font></striong><br><strong><font color=green>Recovered : </font>" + statesData.features[i].properties.recovered + "</striong><br><strong><b>Active Cases : " + statesData.features[i].properties.activeCases + "</striong>")
    //         .on('mouseover', function(e) {
    //             this.openPopup();
    //         });
    // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// EVENT LISTENERS FOR THE BUTTONS //////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var colorScale1 = d3.scaleSequential(d3.interpolateOranges)
        .domain([mincc, maxcc]);

    continuous("#legend1", colorScale1);

    document.getElementById("tccButton").addEventListener("click", () => {
        colorScaleLayer.red = 250;
        colorScaleLayer.green = 211;
        colorScaleLayer.blue = 147;
        colorScaleLayer.rScaleFactor = 5;
        colorScaleLayer.gScaleFactor = 96;
        colorScaleLayer.bScaleFactor = 147;
        document.getElementById('legend1').innerHTML = '';
        colorScale1 = d3.scaleSequential(d3.interpolateOranges)
            .domain([mincc, maxcc]);

        continuous("#legend1", colorScale1);

        if (layer) {
            map.removeLayer(layer);
        }

        layer = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
    document.getElementById("acButton").addEventListener("click", () => {
        colorScaleLayer.red = 153;
        colorScaleLayer.green = 214;
        colorScaleLayer.blue = 255;
        colorScaleLayer.rScaleFactor = -153;
        colorScaleLayer.gScaleFactor = 75;
        colorScaleLayer.bScaleFactor = 0;
        document.getElementById('legend1').innerHTML = '';
        colorScale1 = d3.scaleSequential(d3.interpolateBlues)
            .domain([minActive, maxActive]);

        continuous("#legend1", colorScale1);
        if (layer) {
            map.removeLayer(layer);
        }

        layer = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
    document.getElementById("recoveredButton").addEventListener("click", () => {
        colorScaleLayer.red = 173;
        colorScaleLayer.green = 234;
        colorScaleLayer.blue = 173;
        colorScaleLayer.rScaleFactor = -123;
        colorScaleLayer.gScaleFactor = 29;
        colorScaleLayer.bScaleFactor = 123;
        document.getElementById('legend1').innerHTML = '';
        colorScale1 = d3.scaleSequential(d3.interpolateGreens)
            .domain([minrc, maxrc]);

        continuous("#legend1", colorScale1);
        if (layer) {
            map.removeLayer(layer);
        }

        layer = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

    });
    document.getElementById('dButton').addEventListener("click", () => {
        colorScaleLayer.red = 242;
        colorScaleLayer.green = 189;
        colorScaleLayer.blue = 174;
        colorScaleLayer.rScaleFactor = 13;
        colorScaleLayer.gScaleFactor = 189;
        colorScaleLayer.bScaleFactor = 174;
        document.getElementById('legend1').innerHTML = '';
        colorScale1 = d3.scaleSequential(d3.interpolateReds)
            .domain([mindc, maxdc]);

        continuous("#legend1", colorScale1);
        if (layer) {
            map.removeLayer(layer);
        }

        layer = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });






    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// DIFFERENT LAYERS ON THE MAP ////////////////////////////////////// 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function style(feature) {
        const r = colorScaleLayer.red + (colorScaleLayer.rScaleFactor * ((feature.properties.activeCases - minActive) / (maxActive - minActive)));
        const g = colorScaleLayer.green - (colorScaleLayer.gScaleFactor * ((feature.properties.activeCases - minActive) / (maxActive - minActive)));
        const b = colorScaleLayer.blue - (colorScaleLayer.bScaleFactor * ((feature.properties.activeCases - minActive) / (maxActive - minActive)));
        return {
            fillColor: `rgb(${r},${g},${b})`,
            weight: 2,
            opacity: 1,
            color: 'rgb(140, 133, 129)',
            dashArray: '3',
            fillOpacity: 0.7
        };

    }

    function highlightFeature(e) {
        layer = e.target;
        layer.setStyle({
            weight: 3,
            dashArray: '',
            color: 'rgb(92, 87, 84)',
            fillOpacity: 0.7
        });
        lastClickedLayer = layer;
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    var geojson;

    function zoomToFeature(e) {
        //Uncomment the next line to again enable zoom on Single click!!!!!!!!!!!!!!!!!!!!!!!!
        //  map.fitBounds(e.target.getBounds());
        closeNav();
        state = e.target.feature.properties.loc;
        console.log(state);
        openNav(state, true);
    }

    function onEachFeature(feature, layer) {

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////Legend////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function continuous(selector_id, colorscale) {
        var legendheight = 300,
            legendwidth = 70,
            margin = { top: 10, right: 60, bottom: 10, left: 2 };

        var canvas = d3.select(selector_id)
            .style("height", legendheight + "px")
            .style("width", legendwidth + "px")
            .style("position", "relative")
            .append("canvas")
            .attr("height", legendheight - margin.top - margin.bottom)
            .attr("width", 1)
            .style("height", (legendheight - margin.top - margin.bottom) + "px")
            .style("width", (legendwidth - margin.left - margin.right) + "px")
            .style("border", "1px solid #000")
            .style("position", "absolute")
            .style("top", (margin.top) + "px")
            .style("left", (margin.left) + "px")
            .node();

        var ctx = canvas.getContext("2d");

        var legendscale = d3.scaleLinear()
            .range([1, legendheight - margin.top - margin.bottom])
            .domain(colorscale.domain());

        var image = ctx.createImageData(1, legendheight);
        d3.range(legendheight).forEach(function(i) {
            var c = d3.rgb(colorscale(legendscale.invert(i)));
            image.data[4 * i] = c.r;
            image.data[4 * i + 1] = c.g;
            image.data[4 * i + 2] = c.b;
            image.data[4 * i + 3] = 255;
        });
        ctx.putImageData(image, 0, 0);

        var legendaxis = d3.axisRight()
            .scale(legendscale)
            .tickSize(6)
            .ticks(8);

        var svg = d3.select(selector_id)
            .append("svg")
            .attr("height", (legendheight) + "px")
            .attr("width", (legendwidth) + "px")
            .style("left", " 10px")
            .style("top", "50px")

        svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")

        .call(legendaxis);

        svg
            .select("g").append("text")
            .attr("fill", "#fff")

        .call(legendaxis);
    };
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////  
//////////////////////////////////////////SIDE NAV///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////


function openNav(state, stateFlag = false) {
    document.getElementById("mySidenav").style.width = "420px";
    document.getElementById("mySidenav").style.opacity = "1";
    document.getElementById("hover-details").style.visibility = 'hidden';
    try {
        //document.getElementById("mySidenav").innerHTML = '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a><strong><font color = white><b>State  : '+statesData.features[i].properties.loc+"</font></strong> <br><strong><b><font color = orange>Total Confirmed Cases : "+statesData.features[i].properties.totalConfirmedCase+"</font></striong><br><strong><font color= red>Deaths : "+statesData.features[i].properties.deaths+"</font></striong><br><strong><font color=green>Recovered : "+statesData.features[i].properties.recovered+"</font></striong><br><strong><b><font color=blue>Active Cases : "+statesData.features[i].properties.activeCases+"</font></striong>";

        if (stateFlag == false) {
            document.getElementById("mySidenav").innerHTML = '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>';

            fetch("https://api.covid19india.org/data.json").then(response => response.json()).then(ldata => {
                // console.log(ldata.cases_time_series[182]);
                var indiaData = ldata.cases_time_series[Object.keys(ldata.cases_time_series).length - 1]
                    // console.log(indiaData);
                    // var trace1 = {
                    //     x: [Number(indiaData.totalconfirmed)],
                    //     y: indiaData.date,
                    //     type: 'bar',
                    //     name: 'Total Confirmed Cases',
                    //     marker: { color: "orange", opacity: 0.8 },
                    //     orientation: "h"
                    // };

                // var trace2 = {
                //     x: [Number(indiaData.totalrecovered)],
                //     y: indiaData.date,
                //     type: 'bar',
                //     name: 'Recovered',
                //     marker: { color: "green", opacity: 0.8 },
                //     orientation: "h"
                // };
                // var trace4 = {
                //     x: [Number(indiaData.totaldeceased)],
                //     y: indiaData.date,
                //     type: 'bar',
                //     name: 'Deaths',
                //     marker: { color: "red", opacity: 0.8 },
                //     orientation: "h"
                // };

                // var data = [trace2, trace4, trace1];

                // var layout = {
                //     title: "<b>India</b>",
                //     font: {
                //         family: 'Courier New, monospace',
                //         size: 18,
                //         color: '#fff',
                //         align: 'center'
                //     },
                //     autosize: false,
                //     width: 400,
                //     height: 200,
                //     margin: {
                //         l: 100,
                //         r: 100,
                //         pad: 4
                //     },
                //     barmode: "stack",
                //     showlegend: false,
                //     plot_bgcolor: "#111",
                //     paper_bgcolor: "#111",
                //     xaxis: {
                //         showticklabels: false,
                //         linecolor: 'grey',
                //         linewidth: 2,
                //         mirror: true
                //     },
                //     yaxis: {
                //         automargin: false,
                //         showticklabels: false,
                //         linecolor: 'grey',
                //         linewidth: 2,
                //         mirror: true
                //     }

                // };

                // document.getElementById("mySidenav").style.marginBottom = "-20px";
                // Plotly.newPlot("mySidenav", data, layout, { displayModeBar: false });

                var divSide = document.createElement('div');
                divSide.setAttribute('id', "indiaStats")
                document.getElementById("mySidenav").appendChild(divSide);
                divSide.style.color = "white";
                divSide.innerHTML +=
                    "<p><h1><center>India</center></h1><br><span style='color: orange;'>Total Confirmed Cases: " + indiaData.totalconfirmed + "</span><br><span style='color: green;'>Total Recovered Cases: " + indiaData.totalrecovered + "</span><br><span style='color: red;'>Total Deceased Cases: " + indiaData.totaldeceased +
                    "</span></p>";

                fetch("https://api.rootnet.in/covid19-in/stats/latest").then(response => response.json()).then(ldata => {

                    let tcc = [],
                        recovered = [],
                        deaths = [],
                        activeCases = [],
                        state = [];
                    const regionalData = ldata.data.regional;
                    const update = ldata.lastOriginUpdate;

                    for (let i = 0; i < regionalData.length; i++) {
                        state[i] = regionalData[i].loc;
                        tcc[i] = regionalData[i].totalConfirmed;
                        recovered[i] = regionalData[i].discharged;
                        deaths[i] = regionalData[i].deaths
                        activeCases[i] = tcc[i] - deaths[i] - recovered[i];

                    }

                    var trace1 = {
                        values: tcc,
                        labels: state,
                        domain: { column: 0 },
                        name: 'Total Confirmed Cases',
                        hoverinfo: 'label+percent+name',
                        hole: 0.4,
                        type: 'pie',
                        automargin: true,
                        textposition: 'inside',
                        marker: {
                            line: {
                                color: '#444',
                                width: 2
                            },
                        }
                    };

                    var trace3 = {
                        values: activeCases,
                        labels: state,
                        domain: { column: 1 },
                        name: 'Total Active Cases',
                        hoverinfo: 'label+percent+name',
                        hole: .4,
                        type: 'pie',
                        automargin: true,
                        textposition: 'inside',
                        marker: {
                            line: {
                                color: '#444',
                                width: 2
                            },
                        }
                    };

                    var data = [trace1, trace3];

                    var layout = {
                        annotations: [{
                                font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#fff',
                                    align: 'center'
                                },
                                showarrow: false,
                                text: 'Confirmed Cases',
                                x: -0.1,
                                y: 1.2
                            },
                            {
                                font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#fff',
                                    align: 'center'
                                },
                                showarrow: false,
                                text: 'Active Cases',
                                x: 1.0,
                                y: 1.2
                            }
                        ],
                        showlegend: false,

                        autosize: false,
                        height: 400,
                        width: 400,
                        margin: { l: 60, r: 50 },
                        float: "left",
                        plot_bgcolor: "#111",
                        paper_bgcolor: "#111",
                        grid: { rows: 1, columns: 2 }
                    };
                    var divID = document.createElement('div');
                    divID.setAttribute('id', "allData")
                    document.getElementById("mySidenav").appendChild(divID);
                    Plotly.newPlot(divID.id, data, layout, { displayModeBar: false });
                    var trace1 = {
                        values: recovered,
                        labels: state,
                        domain: { column: 0 },
                        name: 'Recovered Cases',
                        hoverinfo: 'label+percent+name',
                        hole: 0.4,
                        type: 'pie',
                        automargin: true,
                        textposition: 'inside',
                        marker: {
                            line: {
                                color: '#444',
                                width: 2
                            },
                        }
                    };

                    var trace3 = {
                        values: deaths,
                        labels: state,
                        domain: { column: 1 },
                        name: 'Deceased',
                        hoverinfo: 'label+percent+name',
                        hole: .4,
                        type: 'pie',
                        automargin: true,
                        textposition: 'inside',
                        marker: {
                            line: {
                                color: '#444',
                                width: 2
                            },
                        }
                    };

                    var data = [trace1, trace3];

                    var layout = {
                        annotations: [{
                                font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#fff',
                                    align: 'center'
                                },
                                showarrow: false,
                                text: 'Recovered Cases',
                                x: -0.1,
                                y: 1.2
                            },
                            {
                                font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#fff',
                                    align: 'center'
                                },
                                showarrow: false,
                                text: 'Deceased',
                                x: 1.0,
                                y: 1.2
                            }
                        ],
                        showlegend: false,

                        autosize: false,
                        height: 400,
                        width: 400,
                        margin: { l: 60, r: 50 },
                        float: "left",
                        plot_bgcolor: "#111",
                        paper_bgcolor: "#111",
                        grid: { rows: 1, columns: 2 }
                    };
                    var divID = document.createElement('div');
                    divID.setAttribute('id', "allData1")
                    document.getElementById("mySidenav").appendChild(divID);
                    document.getElementById(divID.id).style.marginBottom = "50px";
                    Plotly.newPlot(divID.id, data, layout, { displayModeBar: false });
                });

            });
        } else {
            document.getElementById("mySidenav").innerHTML = '';
            document.getElementById("mySidenav").innerHTML = '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>';
            fetch("https://api.covid19india.org/states_daily.json").then(response => response.json()).then(fdata => {

                const statesData = fdata.states_daily;
                let conf = [],
                    rec = [],
                    dec = [],
                    dates = [];
                let j = 1,
                    date = null;
                for (let i = 0; i < statesData.length; i++) {
                    date = statesData[i].date;
                    delete statesData[i].date;
                    delete statesData[i].status;
                    if (j == 1) {
                        conf.push(statesData[i]);
                        dates.push(date);
                        j++;
                    } else if (j == 2) {
                        rec.push(statesData[i]);
                        j++;
                    } else {
                        dec.push(statesData[i]);
                        j = 1;
                    }
                }
                let stateCode = { 'Andaman and Nicobar Islands': "an", "Andhra Pradesh": "ap", "Arunachal Pradesh": "ar", "Assam": "as", "Bihar": "br", "Chandigarh": "ch", "Chhattisgarh": "ct", "XXXXX": "dd", "Delhi": "dl", "Dadra and Nagar Haveli and Daman and Diu": "dn", "Goa": "ga", "Gujarat": "gj", "Himachal Pradesh": "hp", "Haryana": "hr", "Jharkhand": "jh", "Jammu and Kashmir": "jk", "Karnataka": "ka", "Kerala": "kl", "Ladakh": "la", "Lakshadweep": "ld", "Maharashtra": "mh", "Meghalaya": "ml", "Manipur": "mn", "Madhya Pradesh": "mp", "Mizoram": "mz", "Nagaland": "nl", "Odisha": "or", "Punjab": "pb", "Pondicherry": "py", "Rajasthan": "rj", "Sikkim": "sk", "Telangana": "tg", "Tamil Nadu": "tn", "Tripura": "tr", "India": "tt", "Unknown": "un", "Uttar Pradesh": "up", "Uttarakhand": "ut", "West Bengal": "wb" };
                let recovered = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let deceased = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let confirmed = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let recoveredDaily = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let deceasedDaily = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let confirmedDaily = { "an": [], "ap": [], "ar": [], "as": [], "br": [], "ch": [], "ct": [], "dd": [], "dl": [], "dn": [], "ga": [], "gj": [], "hp": [], "hr": [], "jh": [], "jk": [], "ka": [], "kl": [], "la": [], "ld": [], "mh": [], "ml": [], "mn": [], "mp": [], "mz": [], "nl": [], "or": [], "pb": [], "py": [], "rj": [], "sk": [], "tg": [], "tn": [], "tr": [], "tt": [], "un": [], "up": [], "ut": [], "wb": [] };
                let everythingR = [];
                let everythingC = [];
                let everythingD = [];
                let states = Object.keys(statesData[0]);


                for (let i = 0; i < rec.length; i++) {
                    everythingR.push(Object.values(rec[i]));
                    everythingC.push(Object.values(conf[i]));
                    everythingD.push(Object.values(dec[i]));
                }

                function cummulativeSum(a) {
                    let result = [a[0]];

                    for (let i = 1; i < a.length; i++) {
                        result[i] = result[i - 1] + a[i];
                    }

                    return result;
                };

                for (let i = 0; i < everythingR.length; i++) {
                    for (let j = 0; j < everythingR[i].length; j++) {
                        recovered[states[j]].push(Number(everythingR[i][j]));
                        deceased[states[j]].push(Number(everythingD[i][j]));
                        confirmed[states[j]].push(Number(everythingC[i][j]));
                        recoveredDaily[states[j]].push(Number(everythingR[i][j]));
                        deceasedDaily[states[j]].push(Number(everythingD[i][j]));
                        confirmedDaily[states[j]].push(Number(everythingC[i][j]));
                    }
                }

                for (let i = 0; i < Object.keys(confirmed).length; i++) {
                    recovered[states[i]] = cummulativeSum(recovered[states[i]]);
                    deceased[states[i]] = cummulativeSum(deceased[states[i]]);
                    confirmed[states[i]] = cummulativeSum(confirmed[states[i]]);
                }

                // console.log(recovered,deceased,confirmed)   # statewise data in datewise order of dates list above
                var divID1 = document.createElement('div');
                divID1.setAttribute('id', "tester1")
                divID1.style.width = "100%";
                divID1.style.display = "inline-block";
                divID1.style.color = "white";
                divID1.style.textAlign = "center";
                document.getElementById("mySidenav").appendChild(divID1);
                document.getElementById("tester1").innerHTML = `<b style="font-size: 20px; font-family: 'Courier New', Courier, monospace;">${state}</b>`;


                var divID = document.createElement('div');
                divID.setAttribute('id', "tester")
                divID.style.width = "100%";
                divID.style.height = "40%";
                document.getElementById("mySidenav").appendChild(divID);
                plotCumulative(dates, confirmed[stateCode[state]], deceased[stateCode[state]], recovered[stateCode[state]], divID, states[stateCode[state]]);




                var divID2 = document.createElement('div');
                divID2.setAttribute('id', "tester2")
                divID2.style.width = "100%";
                divID2.style.height = "40%";
                divID2.style.marginTop = "100px";
                document.getElementById("mySidenav").appendChild(divID2);

                plotDaily(dates, confirmedDaily[stateCode[state]], deceasedDaily[stateCode[state]], recoveredDaily[stateCode[state]], divID2, states[stateCode[state]]);

            });

            function plotCumulative(xLabel, cumulativeDaily, cumulativeDailyDeceased, cumulativeDailyRecovered, divID, state) {
                // console.log(xLabel);
                var trace1 = {
                    x: xLabel,
                    y: cumulativeDaily,
                    name: 'Total Confirmed Cases',
                    type: 'scatter'
                };
                var trace2 = {
                    x: xLabel,
                    y: cumulativeDailyDeceased,
                    name: 'Total Deceased',
                    type: 'scatter'
                };
                var trace3 = {
                    x: xLabel,
                    y: cumulativeDailyRecovered,
                    name: 'Total Recovered Cases',
                    type: 'scatter'
                };

                var data = [trace1, trace3, trace2];

                var layout = {
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#fff',
                        align: 'center'

                    },
                    showlegend: false,

                    autosize: false,
                    height: 400,
                    width: "100%",
                    margin: { l: 60, r: 50 },
                    float: "left",
                    plot_bgcolor: "#111",
                    paper_bgcolor: "#111",
                    grid: { rows: 1, columns: 2 },
                    xaxis: {
                        showticklabels: true,
                        linecolor: '#fff',
                        linewidth: 2
                    },
                    yaxis: {
                        linecolor: '#fff',
                        linewidth: 2
                    }
                };
                Plotly.newPlot(divID.id, data, layout, { displayModeBar: false });

            }

            function plotDaily(xLabel, cumulativeDaily, cumulativeDailyDeceased, cumulativeDailyRecovered, divID, state) {
                console.log(xLabel);
                var trace1 = {
                    x: xLabel,
                    y: cumulativeDaily,
                    type: 'bar',
                    name: 'Total Confirmed Cases',
                    marker: { color: "orange" },
                    orientation: "v"
                };

                var trace2 = {
                    x: xLabel,
                    y: cumulativeDailyRecovered,
                    type: 'bar',
                    name: 'Recovered',
                    marker: { color: "green" },
                    orientation: "v"
                };
                var trace3 = {
                    x: xLabel,
                    y: cumulativeDailyDeceased,
                    type: 'bar',
                    name: 'Deaths',
                    marker: { color: "orange" },
                    orientation: "v"
                };

                var data = [trace3, trace2, trace1];

                var layout = {
                    title: state,
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#fff',
                        align: 'center'

                    },
                    showlegend: false,

                    autosize: false,
                    height: 600,
                    width: "100%",
                    margin: { l: 60, r: 50 },
                    float: "left",
                    plot_bgcolor: "#111",
                    paper_bgcolor: "#111",
                    grid: { rows: 1, columns: 2 },
                    barmode: "stack",
                    xaxis: {
                        type: "category",
                        showticklabels: false,
                        mirror: 'ticks',
                        linecolor: '#fff',
                        linewidth: 2
                    },
                    yaxis: {
                        automargin: true,
                        showticklabels: false,
                        mirror: 'ticks',
                        linecolor: '#fff',
                        linewidth: 2
                    }

                };
                Plotly.newPlot(divID.id, data, layout, { displayModeBar: false });

            }
        }
    } catch {
        // marker.on('mouseover', function (e) {
        //   this.openPopup();
        console.log(false);
    };
}


function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("hover-details").style.visibility = 'visible';
}

///////////////////////////////////////////////////////////////////////////////////////////////////////