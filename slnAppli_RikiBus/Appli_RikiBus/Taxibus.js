$('document').ready(function () {
    // initialization de la map
    var map = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);




    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Ajout d'un marker avec popup
    //var marker = L.marker([48.4532573993011, -68.5227191989171]).addTo(map);
    //marker.bindPopup("Je fait des tests");

    //Ajout d'un popup Onclick sur la map 
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Tu as cliqués sur la map à " + e.latlng.toString())

            .openOn(map);
    }
    map.on('click', onMapClick);





    //test d'icône

    //Lecture GeoJson
    $.getJSON("ressources/fichiers_JSON/Arrets.json", function (data) {
        var iconRouge = L.icon({
            iconUrl: 'ressources/img/Pointers/marker-red.png',
            shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

            iconSize:     [25, 41],
            shadowSize:   [41, 41],
            iconAnchor:   [12, 41],
            shadowAnchor: [13, 41],
            popupAnchor:  [12, -2] 
        });
        var array = data.features;

        
        //instanciation des layers
        var geojsonRabattement = new L.GeoJSON();
        var geojsonVert = new L.GeoJSON();
        var geojsonBleue = new L.GeoJSON();
        var geojsonRouge = new L.GeoJSON(filtreZone(/rouge/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: iconRouge });
            }
        });



        //ajout des layers à la carte
        geojsonRabattement.addTo(map);
        geojsonVert.addTo(map);
        geojsonBleue.addTo(map);
        geojsonRouge.addTo(map);

 //       geojsonRouge.addData(filtreZone(/rouge/, array));
        geojsonVert.addData(filtreZone(/verte/, array));
        geojsonBleue.addData(filtreZone(/bleue/, array));
        geojsonRabattement.addData(filtreZone(/rabattement/, array));

        function filtreZone(regex, data) {
            /*Filtrage des données geojson avec un regex (si le type de point contient le regex, il sera dans la liste de données)*/
            var array = [];
            for (i = 2; i < data.length; ++i) {
                var str = "";
                str = data[i].properties.Type_arret;
                if (regex.test(str)) {
                    array[array.length] = data[i];
                }
            }
            return array;
        }

        var overlayMaps = {
            "Ligne rouge": geojsonRouge,
            "Zone Verte": geojsonVert,
            "Zone Bleue": geojsonBleue,
            "Point de rabattement": geojsonRabattement
        };

        L.control.layers(null, overlayMaps).addTo(map);

    });
});

