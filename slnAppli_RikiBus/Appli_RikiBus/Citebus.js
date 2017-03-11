$('document').ready(function () {
    // initialization de la map
    var mapCitebus = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapCitebus);

    ////Initialisation des Layers

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


    //Lecture GeoJson et séparation par Circuit
    $.getJSON("ressources/fichiers_JSON/arretcitebus.json", function (data) {
        var iconRouge = L.icon({
            iconUrl: 'ressources/img/Pointers/marker-red.png',
            shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 41],
            shadowAnchor: [13, 41],
            popupAnchor: [1, -27]
        });

        var iconOrange = L.icon({
            iconUrl: 'ressources/img/Pointers/marker-orange.png',
            shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 41],
            shadowAnchor: [13, 41],
            popupAnchor: [1, -27]
        });

        var array = data.features;

        //Circuit 11
        var geojSonArretCircuit11 = new L.GeoJSON(filtreCircuit(/11/,array), {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng)
                    .bindPopup("<b>Arrêt</b> :" + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
            }
        }).addTo(geojsonCircuit11);


        //Circuit 21
        var geojSonArretCircuit21 = new L.GeoJSON(filtreCircuit(/21/, array), {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: iconRouge })
                    .bindPopup("<b>Arrêt</b> :" + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
            }
        }).addTo(geojsonCircuit21);


        //Circuit 31
        var geojSonArretCircuit31 = new L.GeoJSON(filtreCircuit(/31/, array), {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: iconOrange})
                    .on('click', markerClick)    
                    .bindPopup("<b>Arrêt</b> " + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
            }
        }).addTo(geojsonCircuit31);
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
    geojsonCircuit11.addTo(mapCitebus);
    geojsonCircuit21.addTo(mapCitebus);
    geojsonCircuit31.addTo(mapCitebus);


    var overlayMaps = {
        "Circuit11": geojsonCircuit11,
        "Circuit21": geojsonCircuit21,
        "Circuit31": geojsonCircuit31,
    };

    L.control.layers(null, overlayMaps).addTo(mapCitebus);
});

// Affiche les infos de temps pour un marker
function getTemps(horaire)
{
    var debut;
    var heures = horaire.split(", ");
    var original = heures.slice();
    var x = 0;
    for (x = 0; x < heures.length; x++)
    {
        if (x == 0)
        {
            debut = heures[x];
        }
        var temp = heures[x];
        heures[x] = String(temp).split(":");
    }

    var y = 0;
    for (y = 0; y < heures.length; y++) {
        var temp = heures[y][0];
        heures[y] = parseInt(temp * 60) + parseInt(heures[y][1]);
    }

    var date = new Date();
    minute = (parseInt(date.getHours()) * 60) + parseInt(date.getMinutes());
    //minute = 1334; //////////////////////////////////////////////////Valeur en minutes pour le temps de la journée

    var i = 0;
    for (i = 0; i < heures.length; i++)
    {
        if (heures[i] > minute)
        {
            return "dans " + (parseInt(heures[i]) - parseInt(minute)) + " minutes (" + original[i] + ")";
        }
    }

    return "demain à " + debut;
}

