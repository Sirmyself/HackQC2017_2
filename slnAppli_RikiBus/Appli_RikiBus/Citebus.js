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
    var geojsonCircuit11 = new L.GeoJSON();
    var geojsonCircuit21 = new L.GeoJSON();
    var geojsonCircuit31 = new L.GeoJSON();


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
    $.getJSON("ressources/fichiers_JSON/arretcitebus.json", function (data) {
        var iconRouge = L.icon({
            iconUrl: 'ressources/img/Pointers/marker-red.png',
            shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 41],
            shadowAnchor: [13, 41],
            popupAnchor: [12, -2]
        });

        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: iconRouge })
                    .bindPopup("<b>Arrêt</b> :" + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
            }
        }).addTo(mapCitebus);
    });

    $.getJSON("ressources/fichiers_JSON/circuitcitebus.json", function (data) {
        var array = data.features;
        geojsonCircuit11.addData(filtreCircuit(/Circuit 11/, array));
        geojsonCircuit21.addData(filtreCircuit(/Circuit 21/, array));
        geojsonCircuit31.addData(filtreCircuit(/Circuit 31/, array));
    });
    
    //$.getJSON("ressources/fichiers_JSON/circuitcitebus.json", function (jsoncircuit) {
    //    geojsonLayerCircuit.addData(jsoncircuit);
    //});

    //Ajout layer dans map
    geojsonLayer.addTo(mapCitebus);
    //L.geoJSON(geojsonCircuit11, style: function).addTo(mapCitebus);
    geojsonCircuit21.addTo(mapCitebus);
    geojsonCircuit31.addTo(mapCitebus);


    var overlayMaps = {
        "Circuit11": geojsonCircuit11,
        "Circuit21": geojsonCircuit21,
        "Circuit31": geojsonCircuit31,
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