$('document').ready(function () {
    // initialization de la map
    var mapCitebus = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapCitebus);

    ////Ajout d'un marker avec popup

    var geojsonLayer = new L.GeoJSON();
    var geojsonLayerCircuit = new L.GeoJSON();

    //Lecture GeoJson
    $.getJSON("arretcitebus.json", function (data) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng)
                        .bindPopup("<b>Circuit</b> :" + feature.properties.Circuit);
                }
            }).addTo(mapCitebus);
        
    });
    


    $.getJSON("circuitcitebus.json", function (jsoncircuit) {
        geojsonLayerCircuit.addData(jsoncircuit); 
    });

    //Ajout layer dans map
    geojsonLayer.addTo(mapCitebus);
    geojsonLayerCircuit.addTo(mapCitebus);


    var overlayMaps = {
        "Circuit": geojsonLayerCircuit,
        "Arret": geojsonLayer
    };

    L.control.layers(null, overlayMaps).addTo(mapCitebus);
});