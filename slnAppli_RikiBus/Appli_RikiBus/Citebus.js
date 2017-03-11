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

    //filtrage par circuit
    function filtreCircuit(regex, data) {
        var array = [];
        for (i = 2; i < data.length; ++i) {
            var str = "";
            str = data[i].properties.Circuit;
            if (regex.test(str)) {
                array[array.length] = data[i];
            }
        }
        return array;
    }

    //Lecture GeoJson
    $.getJSON("arretcitebus.json", function (data) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng)
                        .bindPopup("<b>Circuit</b> :" + feature.properties.Circuit);
                }
            }).addTo(mapCitebus);
        
    });
    
    //$.getJSON("Arrets.json", function (data) {
    //    var array = data.features;
    //    geojsonArret11.addData(filtreCircuit(/11/, array));
    //    geojsonArret21.addData(filtreZone(/21/, array));
    //    geojsonArret31.addData(filtreZone(/31/, array));
    //});

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