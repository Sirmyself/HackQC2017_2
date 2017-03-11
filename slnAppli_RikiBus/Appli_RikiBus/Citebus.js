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
                    .bindPopup("<b>Arrêt</b> :" + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
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


function getTemps(horaire)
{
    var heures = horaire.split(", ");
    var x = 0;
    for (x = 0; x < heures.length; x++)
    {
        var temp = heures[x];
        heures[x] = String(temp).split(":");
    }

    var y = 0;
    for (y = 0; y < heures.length; y++) {
        var temp = heures[y][0];
        heures[y] = parseInt(temp * 60) + parseInt(heures[y][1]);
    }

    //var d = new Date();
    //var hour = d.getHours();
    //var minute = d.getMinutes();
    //hour = 9;
    minute = 1334;

    var i = 0;
    for (i = 0; i < heures.length; i++)
    {
        if (heures[i ] > minute)
        {
            return "dans " + (parseInt(heures[i]) - parseInt(minute)) + " minutes";
        }
    }
    return "demain à " + heures[0];
}