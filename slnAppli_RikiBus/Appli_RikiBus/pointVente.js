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