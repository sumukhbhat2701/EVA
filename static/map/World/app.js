mapboxgl.accessToken = "pk.eyJ1Ijoic3VtdWtoYmhhdDI3MDEiLCJhIjoiY2tja3cxc3drMXh3ZDJxcGY4ZnJzaWx4bSJ9.HWGh19cxLpx4q8d_sTxLPA";

function clusterMaps()
{
    window.addEventListener('DOMContentLoaded',initializeApp);

let coronaDetailsContainer;
let countrySelectDropdown;
let coronaWorldDetailsContainer;


let coronaData = {
    info : [],
    global:[]
};

let locationCoronaDetails = {
    info : []
};

let lngLat=[];
let indianStates={};

const countriesWithCountryCodes = {
    "TH": "Thailand",
    "JP": "Japan",
    "SG": "Singapore",
    "NP": "Nepal",
    "MY": "Malaysia",
    "CA": "Canada",
    "AU": "Australia",
    "KH": "Cambodia",
    "LK": "Sri Lanka",
    "DE": "Germany",
    "FI": "Finland",
    "AE": "United Arab Emirates",
    "PH": "Philippines",
    "IN": "India",
    "IT": "Italy",
    "SE": "Sweden",
    "ES": "Spain",
    "BE": "Belgium",
    "EG": "Egypt",
    "LB": "Lebanon",
    "IQ": "Iraq",
    "OM": "Oman",
    "AF": "Afghanistan",
    "BH": "Bahrain",
    "KW": "Kuwait",
    "DZ": "Algeria",
    "HR": "Croatia",
    "CH": "Switzerland",
    "AT": "Austria",
    "IL": "Israel",
    "PK": "Pakistan",
    "BR": "Brazil",
    "GE": "Georgia",
    "GR": "Greece",
    "MK": "North Macedonia",
    "NO": "Norway",
    "RO": "Romania",
    "EE": "Estonia",
    "SM": "San Marino",
    "BY": "Belarus",
    "IS": "Iceland",
    "LT": "Lithuania",
    "MX": "Mexico",
    "NZ": "New Zealand",
    "NG": "Nigeria",
    "IE": "Ireland",
    "LU": "Luxembourg",
    "MC": "Monaco",
    "QA": "Qatar",
    "EC": "Ecuador",
    "AZ": "Azerbaijan",
    "AM": "Armenia",
    "DO": "Dominican Republic",
    "ID": "Indonesia",
    "PT": "Portugal",
    "AD": "Andorra",
    "LV": "Latvia",
    "MA": "Morocco",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "AR": "Argentina",
    "CL": "Chile",
    "JO": "Jordan",
    "UA": "Ukraine",
    "HU": "Hungary",
    "LI": "Liechtenstein",
    "PL": "Poland",
    "TN": "Tunisia",
    "BA": "Bosnia and Herzegovina",
    "SI": "Slovenia",
    "ZA": "South Africa",
    "BT": "Bhutan",
    "CM": "Cameroon",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "PE": "Peru",
    "RS": "Serbia",
    "SK": "Slovakia",
    "TG": "Togo",
    "MT": "Malta",
    "MQ": "Martinique",
    "BG": "Bulgaria",
    "MV": "Maldives",
    "BD": "Bangladesh",
    "PY": "Paraguay",
    "AL": "Albania",
    "CY": "Cyprus",
    "BN": "Brunei",
    "US": "US",
    "BF": "Burkina Faso",
    "VA": "Holy See",
    "MN": "Mongolia",
    "PA": "Panama",
    "CN": "China",
    "IR": "Iran",
    "KR": "Korea, South",
    "FR": "France",
    "XX": "Cruise Ship",
    "DK": "Denmark",
    "CZ": "Czechia",
    "TW": "Taiwan*",
    "VN": "Vietnam",
    "RU": "Russia",
    "MD": "Moldova",
    "BO": "Bolivia",
    "HN": "Honduras",
    "GB": "United Kingdom",
    "CD": "Congo (Kinshasa)",
    "CI": "Cote d'Ivoire",
    "JM": "Jamaica",
    "TR": "Turkey",
    "CU": "Cuba",
    "GY": "Guyana",
    "KZ": "Kazakhstan",
    "ET": "Ethiopia",
    "SD": "Sudan",
    "GN": "Guinea",
    "KE": "Kenya",
    "AG": "Antigua and Barbuda",
    "UY": "Uruguay",
    "GH": "Ghana",
    "NA": "Namibia",
    "SC": "Seychelles",
    "TT": "Trinidad and Tobago",
    "VE": "Venezuela",
    "SZ": "Eswatini",
    "GA": "Gabon",
    "GT": "Guatemala",
    "MR": "Mauritania",
    "RW": "Rwanda",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "SR": "Suriname",
    "XK": "Kosovo",
    "CF": "Central African Republic",
    "CG": "Congo (Brazzaville)",
    "GQ": "Equatorial Guinea",
    "UZ": "Uzbekistan",
    "NL": "Netherlands",
    "BJ": "Benin",
    "LR": "Liberia",
    "SO": "Somalia",
    "TZ": "Tanzania",
    "BB": "Barbados",
    "ME": "Montenegro",
    "KG": "Kyrgyzstan",
    "MU": "Mauritius",
    "ZM": "Zambia",
    "DJ": "Djibouti",
    "GM": "Gambia, The",
    "BS": "Bahamas, The",
    "TD": "Chad",
    "SV": "El Salvador",
    "FJ": "Fiji",
    "NI": "Nicaragua",
    "MG": "Madagascar",
    "HT": "Haiti",
    "AO": "Angola",
    "CV": "Cape Verde",
    "NE": "Niger",
    "PG": "Papua New Guinea",
    "ZW": "Zimbabwe",
    "TL": "Timor-Leste",
    "ER": "Eritrea",
    "UG": "Uganda",
    "DM": "Dominica",
    "GD": "Grenada",
    "MZ": "Mozambique",
    "SY": "Syria"
  };    //169 countries
  


function renderMap(){
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [0,20],
    zoom: 1
    });
    
    const geocoder = new MapboxGeocoder({
        accessToken:mapboxgl.accessToken
    });
    map.addControl(geocoder);
    map.addControl(new mapboxgl.NavigationControl());
        
    map.on('load', async function() {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('places', {
    type: 'geojson',
    data:
    {
        type:"FeatureCollection",
        crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},
        features:(coronaData.info.map(Location => {

            
            lngLat=[`${Location.longitude}`,`${Location.latitude}`]
            if((lngLat[0]=="undefined" || lngLat[1]=="undefined") && indianStates[Location.location]!=undefined)
            {
                lngLat=[`${indianStates[Location.location][0]}`,`${indianStates[Location.location][1]}`]
            }
            let active;
            if(Location.recovered!=0 || Location.recovered!=null){
                active = Location.confirmed-Location.dead-Location.recovered
            }
            else{
                active=' -'
            }

            
            return {
                type:"Feature",
                properties:{
                    description:`
                        <table>
                            <thead>
                                <tr><strong><em>${Location.location}</em></strong></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Confirmed Cases: </strong></td>
                                    <td>${Location.confirmed}</td>
                                </tr>
                                <tr>
                                    <td style='color:red'><strong>Deaths: </strong></td>
                                    <td>${Location.dead}</td>
                                </tr>
                                <tr>
                                    <td><strong style='color:green'>Recovered Cases: </strong></td>
                                    <td>${Location.recovered}</td>
                                </tr>
                                <tr>
                                    <td><strong>Active Cases: </strong></td>
                                    <td>${active}</td>
                                </tr>

                                
                            </tbody>
                        </table>`,
                        icon:'rocket'
                },
                geometry:{
                    type:"Point",
                    coordinates:lngLat
                    
                }
            };
        }))
    },
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    // console.log(coronaData.locations[0]);
    
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'places',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    100,
    '#f1f075',
    750,
    '#f28cb1'
    ],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
    ]
    }
    });
    
    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'places',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
    });
    
    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });
    
    // inspect a cluster on click
    map.on('click', 'clusters', function(event) {
    const features = map.queryRenderedFeatures(event.point, {
    layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('places').getClusterExpansionZoom(
    clusterId,
    function(err, zoom) {
    if (err) return;
    
    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function(event) {
    const coordinates = event.features[0].geometry.coordinates.slice();
    var {description} = event.features[0].properties;
    
    
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }
 
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
    
    map.on('mouseenter', 'clusters', function() {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function() {
    map.getCanvas().style.cursor = '';
    });
    });
}


// function showCoords(event) {
//     var x = event.clientX;
//     var y = event.clientY;
//     var coords = "X coords: " + x + ", Y coords: " + y;
//     // document.getElementById("countryMaps").innerHTML = coords;
//     console.log(coords);
//     document.getElementsByClassName('container').getElementById("countryMaps")[0].style.transition = "transform 0.25s ease";
    
//   }

async function initializeApp(){
    //console.log('initialize the app');
    setReferences();
    doEventBindings();
    NProgress.start();
    populateLocations();
    await performAsyncCall();
    renderUI(coronaData.global,world =true);
    renderMap();
    NProgress.done();
}

async function performAsyncCall(){

    {
        //global
        let globalResponse = await fetch('https://api.covid19api.com/summary');
        let global_fdata = await globalResponse.json();
        coronaData.global.push(global_fdata.Global);
    }
    
    {
        //cities
        let cityResponse = await fetch('https://www.trackcorona.live/api/cities');
        let city_fdata = await cityResponse.json();
        let {data}  = city_fdata;
        coronaData.info.push( ...data);
    }
    

    //states
    let stateResponse = await fetch('https://www.trackcorona.live/api/provinces');
    let indianStatesResponse = await fetch('https://api.rootnet.in/covid19-in/stats/latest');
    let state_fdata = await stateResponse.json();
    let indianStates_fdata = await indianStatesResponse.json();
    let {data}  = state_fdata;
    let {regional}  = indianStates_fdata.data;

    coronaData.info.push( ...data);
    let length1 = Object.keys(coronaData.info).length;
    coronaData.info.push( ...regional);
    let length2 = Object.keys(coronaData.info).length;


    for(let j=0;j<length1;j++){
        if(coronaData.info[j].country_code == 'in'){
            indianStates[coronaData.info[j].location]=[coronaData.info[j].longitude,coronaData.info[j].latitude];
            delete coronaData.info[j]
        }
    }
    coronaData.info = coronaData.info.filter(Boolean)
    json_string=JSON.stringify(coronaData);
    json_string=json_string.replace(/\"totalConfirmed\":/g, "\"confirmed\":");
    json_string=json_string.replace(/\"deaths\":/g, "\"dead\":");
    json_string=json_string.replace(/\"loc\":/g, "\"location\":");
    json_string=json_string.replace(/\"discharged\":/g, "\"recovered\":");
    coronaData=JSON.parse(json_string)
    

    //console.log(Object.keys(coronaData.locations).length) //9946=states+cities
    //console.log(length,Object.keys(coronaData.locations).length);
}


function setReferences(){
    coronaDetailsContainer = document.querySelector('#corona-details');
    countrySelectDropdown = document.querySelector('[name="select-country"]')
    coronaWorldDetailsContainer = document.querySelector('#corona-world-details')
}

function doEventBindings(){
    countrySelectDropdown.addEventListener('change',renderDetailsForSelectedLocation);
}

function populateLocation(country,country_code){
    const countryOption = document.createElement('option');
    countryOption.value = country;
    countryOption.textContent = `${country_code} - ${country}`;
    //console.log(countryOption);
    countrySelectDropdown.appendChild(countryOption);
} 

function populateLocations(){
    Object.entries(countriesWithCountryCodes)
    .forEach(([country_code,country]) => populateLocation(country,country_code))
}

async function renderDetailsForSelectedLocation(event){
    //console.log(event.target.value)
    let countrySelected = event.target.value;

    //countries
    let response = await fetch('https://www.trackcorona.live/api/countries');
    let fdata  = await response.json();
    let {data}  = fdata;
    locationCoronaDetails.info.push( ...data);
    //console.log(locationCoronaDetails.locations);
    //console.log(locationCoronaDetails.locations.length); //226 countries

    let accumalator={
        'country':"",
        'country_code':"",
        'confirmed':0,
        "deaths":0,
        "recovered":0,
        "active":0
    };
    for(let i=0;i<Object.keys(locationCoronaDetails.info).length;i++){
        if(locationCoronaDetails.info[i].location.toLowerCase() == countrySelected.toLowerCase()){
            accumalator.country = locationCoronaDetails.info[i].location;
            accumalator.confirmed = locationCoronaDetails.info[i].confirmed;
            accumalator.deaths = locationCoronaDetails.info[i].dead;
            accumalator.country_code = locationCoronaDetails.info[i].country_code.toUpperCase();
            accumalator.recovered = locationCoronaDetails.info[i].recovered;
            accumalator.active = accumalator.confirmed-accumalator.deaths-accumalator.recovered;
            
    renderUI(accumalator);
    return(accumalator);
    
}}
}
function renderUI(details,world=false)  {
    let html ='';
    html = `
    <table class="table">
        <thead>
        ${world ? '<h1><strong><em>World Details</strong></em></h1>':`
        <tr><u><strong><h2>${details.country}(${details.country_code})</h2></strong><u></tr>`}
        </thead>
        <tbody>
        <tr>
            <td class="cases"><strong>Reported Cases: </strong></td>
            <td>${world ? details[0].TotalConfirmed : details.confirmed}</td>
        </tr>
        <tr>
            <td class="deaths"><strong>Deaths: </strong></td> 
            <td>${world ? details[0].TotalDeaths : details.deaths}</td>
        </tr>
        <tr>
            <td class="recovered"><strong>Recovered: </strong></td> 
            <td>${world ? details[0].TotalRecovered : details.recovered}</td>
        </tr>
        <tr>
            <td class="active"><strong>Active: </strong></td> 
            <td>${world ? details[0].TotalConfirmed-details[0].TotalDeaths-details[0].TotalRecovered : details.active}</td>
        </tr>
        

    </table>`;
    if(world){
        coronaWorldDetailsContainer.innerHTML = html;
    }
    else {
        coronaDetailsContainer.innerHTML = html;
    }
}

}


function countryData(){
    
    var countryMaps = new mapboxgl.Map({
        container: 'countryMaps',
        style: 'mapbox://styles/mapbox/dark-v10',
        zoom:1,
        center:[0,20]
        }); 
        
    
        
        let country;
        let confirmedCases;
        let deadCases;
        let recoveredCases;
        let lastUpdate;
        let activeCases;
        var lngClicked;
        var latClicked;
        var latitude=[], longitude=[];
        
    
        /*function getColor(data,activeCases){
            if(activeCases < 100)
            {    return "green";    }
            else if((activeCases >= 100)&&(activeCases < 10000))
            {   return "#BDC9E1";  }
            else{
                return "red";
            }
        }*/
    fetch("https://www.trackcorona.live/api/countries").then(response => response.json()).then(fjson => {
    const data = fjson.data
    
    for(let i=0;i<Object.keys(data).length;i++){

        latitude.push(Math.round(data[i].latitude));
        longitude.push(Math.round(data[i].longitude));
        // console.log(latitude+longitude); Checking the format
        country=data[i].location;
        confirmedCases=data[i].confirmed.toString();
        deadCases=data[i].dead.toString();
        recoveredCases=data[i].recovered.toString();
        if(recoveredCases=='0'){
                recoveredCases='  -'
        }
        lastUpdate=data[i].updated.toString();
        if(parseInt(recoveredCases)!=0 || recoveredCases!=null)
        {activeCases= (parseInt(confirmedCases)-parseInt(deadCases)-parseInt(recoveredCases))}
        else{
                return '  -';
        }

        //console.log(latitude,longitude,country,confirmedCases,deadCases,recoveredCases,lastUpdate)
        

        var popup = new mapboxgl.Popup().setHTML(`
        <table>
            <thead>
                <tr><strong><em>${country}</em></strong></tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Confirmed Cases: </strong></td>
                    <td>${confirmedCases}</td>
                </tr>
                <tr>
                    <td style='color:red'><strong>Deaths: </strong></td>
                    <td>${deadCases}</td>
                </tr>
                <tr>
                    <td><strong style='color:green'>Recovered Cases: </strong></td>
                    <td>${recoveredCases}</td>
                </tr>
                <tr>
                    <td><strong>Active Cases: </strong></td>
                    <td>${activeCases}</td>
                </tr>
                <tr>
                    <td><strong>Last Update: </strong></td>
                    <td>${lastUpdate}</td>
                </tr>

                
            </tbody>
        </table>`
 
        );
        
        var marker = new mapboxgl.Marker({
            color: "#BDC9E1",
            scale:0.3
        })
        .setLngLat([ longitude[i],latitude[i]])
        .addTo(countryMaps)
        .setPopup(popup);
    };
    

    countryMaps.on('click', function(e) {
        /*lngClicked = (Number(Math.round(e.lngLat.lng)));
        latClicked = (Number(Math.round(e.lngLat.lat)));
        if (latitude.includes(latClicked) && longitude.includes(lngClicked)) console.log(true+"LOL");
        else console.log(lngClicked+' '+latClicked);
        // if($("#popup").length) console.log("AGAIN TRUE LOL"); // thinking about using the popup id which comes from the popup function*/

        countryMaps.flyTo({center: {lng:e.lngLat.lng,lat:e.lngLat.lat}, zoom:2});
        
    });
    });
}

/*function stateData(){
    fetch("https://www.trackcorona.live/api/provinces").then(response => response.json()).then(fjson => {
    const data = fjson.data
    
    for(let i=0;i<Object.keys(data).length;i++){

        latitude=data[i].latitude;
        longitude=data[i].longitude;
        state=data[i].location;
        confirmedCases=data[i].confirmed.toString();
        deadCases=data[i].dead.toString();
        recoveredCases=data[i].recovered;
        if(recoveredCases==0 || recoveredCases==null){
                recoveredCases='  -'
        }
        else{
            recoveredCases=data[i].recovered.toString()
        }
        lastUpdate=data[i].updated.toString();
        if(parseInt(recoveredCases)!=0 || recoveredCases!=null)
        {activeCases= (parseInt(confirmedCases)-parseInt(deadCases)-parseInt(recoveredCases))}
        else{
                return '  -';
        }

        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<strong><em><h2>"+state+"</h2></em></strong><br><strong>Confirmed :</strong>"+confirmedCases+"<br><strong style='color:red'>Death :    </strong>"+deadCases+"<br><strong style='color:green'>Recovered :</strong>"+recoveredCases+"<br><strong>Active    :</strong>"+activeCases+"<br><strong>Last Update:</strong>"+lastUpdate.split(' ')[1]
        );
        
        var marker = new mapboxgl.Marker({
            color: "green",//getColor(data,activeCases),
            scale:0.4
        })
        .setLngLat([ longitude,latitude])
        .addTo(countryMaps)
        .setPopup(popup);
        }
    });
}

function cityData(){
    fetch("https://www.trackcorona.live/api/cities").then(response => response.json()).then(fjson => {
    const data = fjson.data
    
    for(let i=0;i<Object.keys(data).length;i++){

        latitude=data[i].latitude;
        longitude=data[i].longitude;
        city=data[i].location;
        confirmedCases=data[i].confirmed.toString();
        deadCases=data[i].dead;
        if(deadCases==0 || deadCases==null){
                deadCases='  -';
        }
        else{
                deadCases=data[i].dead.toString();
        }
        recoveredCases=data[i].recovered;
        if(recoveredCases==0 || recoveredCases==null){
                recoveredCases='  -';
        }
        else{
            recoveredCases=data[i].recovered.toString();
        }
        lastUpdate=data[i].updated.toString();
        if(parseInt(recoveredCases)!=0 || recoveredCases!=null)
        {activeCases=(parseInt(confirmedCases)-parseInt(deadCases)-parseInt(recoveredCases))}
        else{
                return '  -';
        }

        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<strong><em><h2>"+city+"</h2></em></strong><br><strong>Confirmed :</strong>"+confirmedCases+"<br><strong style='color:red'>Death :    </strong>"+deadCases+"<br><strong style='color:green'>Recovered :</strong>"+recoveredCases+"<br><strong>Active    :</strong>"+activeCases+"<br><strong>Last Update:</strong>"+lastUpdate.split(' ')[1]
        );
        
        var marker = new mapboxgl.Marker({
            color: "red",//getColor(data,activeCases),
            scale:0.2
        })
        .setLngLat([ longitude,latitude])
        .addTo(map)
        .setPopup(popup);
        }
    });
}*/
//stateData();
//cityData();




clusterMaps();
countryData();






