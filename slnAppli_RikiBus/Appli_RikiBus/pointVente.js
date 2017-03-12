var depart;
var arrivee;
var etape = 0;

$('document').ready(function () {
    // initialization de la map
    var mapPointVente = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapPointVente);

    ////Initialisation des Layers

    var geojsonLayerPointVente = new L.GeoJSON();


    //Lecture GeoJson et séparation par Circuit
    $.getJSON("ressources/fichiers_JSON/PointVente.json", function (data) {
        var iconRouge = L.icon({
            iconUrl: 'ressources/img/Pointers/marker-red.png',
            shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 41],
            shadowAnchor: [13, 41],
            popupAnchor: [1, -27]
        });

        var array = data.features;

        //Point de vente
        var geojSonPointVenteTemp = new L.GeoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: iconRouge})
                    .on('click', markerClick)
                    .bindPopup(feature.properties.name + "<br> <b>Adresse</b> :" + feature.properties.adresse + " " + feature.properties.NumeroRue);
            }
        }).addTo(geojsonLayerPointVente);
    });

    //Ajout layer dans map
    geojsonLayerPointVente.addTo(mapPointVente);



    var overlayMaps = {
        "Point de vente": geojsonLayerPointVente
    };

    L.control.layers(null, overlayMaps).addTo(mapPointVente);
});


// Évènement click sur un marker
function markerClick(e) {
    if (etape == 0) {
        depart = e.target;
    }
    else {
        arrivee = e.target;
    }

    var heures = e.target.feature.properties.Horaire_SEM.split(", ");
    var AM = new Array();
    var PM = new Array();
    for (i = 0; i < heures.length; i++) {
        if (parseInt(heures[i]) < parseInt("12:00")) {
            AM[AM.length] = heures[i];
        }
        else {
            PM[PM.length] = heures[i];
        }
    }

    var contenuHeures = '<div class="text-center">';
    contenuHeures += '<table style="width:100%" > <tr><th style="text-align: center;"> Avant-midi </th> <th style="text-align: center;"> Après-midi </th> </tr>';
    var x = 0;
    for (x = 0; x < heures.length; x++) {
        contenuHeures += '<tr>';
        if (x >= AM.length) {
            contenuHeures += '<td></td>';
        }
        else {
            contenuHeures += '<td>' + AM[x] + '</td>';
        }
        if (x >= PM.length) {
            contenuHeures += '<td></td>';
        }
        else {
            contenuHeures += '<td>' + PM[x] + '</td>';
        }
        contenuHeures += '</tr>';
    }

    contenuHeures += '</table>';
    contenuHeures += '</div>';
    var contenu = '<h1>Arrêt ' + e.target.feature.properties.Nom + ' (Circuit ' + e.target.feature.properties.Circuit + ')</h1>' + contenuHeures;
    $('#infoArret').html(contenu);

}