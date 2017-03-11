$('document').ready(function () {
    // initialization de la map
    var mapCitebus = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapCitebus);

    ////Ajout d'un marker avec popup
    //var marker = L.marker([48.4532573993011, -68.5227191989171]).addTo(map);
    //marker.bindPopup("Je fait des tests");

    //Ajout d'un popup Onclick sur la map 
    //var popup = L.popup();

    //function onMapClick(e) {
    //    popup
    //        .setLatLng(e.latlng)
    //        .setContent("Tu as cliqués sur la map à " + e.latlng.toString())

    //        .openOn(map);
    //}
    //map.on('click', onMapClick);

    var geojsonLayer = new L.GeoJSON();
    var geojsonLayerCircuit = new L.GeoJSON();

    //Lecture GeoJson
    $.getJSON("arretcitebus.json", function (json) {
        geojsonLayer.addData(json);
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