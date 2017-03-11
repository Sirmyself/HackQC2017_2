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
                    //.on('click', markerClick(feature))    
                    .bindPopup("<b>Arrêt</b> " + feature.properties.Nom + "<br> Prochain arrêt " + getTemps(feature.properties.Horaire_SEM));
            }
        }).addTo(mapCitebus)
        .on('click', markerClick()); // Ajoute à la map et event onClick sur un marker
    });
    
    $.getJSON("circuitcitebus.json", function (jsoncircuit) {
        geojsonLayerCircuit.addData(jsoncircuit);
    });

    // Ajout layer dans map
    geojsonLayer.addTo(mapCitebus);
    geojsonLayerCircuit.addTo(mapCitebus);


    var overlayMaps = {
        "Circuit": geojsonLayerCircuit,
        "Arret": geojsonLayer
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

    minute = 1334; //////////////////////////////////////////////////Valeur en minutes pour le temps de la journée

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

// Évènement click sur un marker
function markerClick(e)
{
    $("unArret").append("<p>test</p>");
}