var mapCitebus = L.map('map').setView(-68.5289754901558, 48.4506343914947, 13);

//Carte modiale de base
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'your.mapbox.public.access.token'
}).addTo(mapCitebus);


//Loading du GeoJson
var layerArretcitebus = L.geoJSON().addTo(mapCitebus);

$.getJSON("arretcitebus.json", function (json) {
    layerArretcitebus.addData(json);

});