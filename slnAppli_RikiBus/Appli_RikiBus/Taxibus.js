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
        var nouvIcon = function (iconColor) {
            return L.icon({
                iconUrl: 'ressources/img/Pointers/marker-' + iconColor + '.png',
                shadowUrl: 'ressources/img/Pointers/marker-shadow.png',

                iconSize: [25, 41],
                shadowSize: [41, 41],
                iconAnchor: [12, 41],
                shadowAnchor: [13, 41],
                popupAnchor: [12, -2]
            });
        };

        var redIcon = nouvIcon("red");
        var blueIcon = nouvIcon("blue");
        var greenIcon = nouvIcon("green");
        var yellowIcon = nouvIcon("yellow");

        var array = data.features;


        //instanciation des layers
        var geojsonRabattement = new L.GeoJSON(filtreZone(/rabattement/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: yellowIcon });
            }
        });
        var geojsonVert = new L.GeoJSON(filtreZone(/verte/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: greenIcon });
            }
        });
        var geojsonBleue = new L.GeoJSON(filtreZone(/bleue/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: blueIcon });
            }
        });
        var geojsonRouge = new L.GeoJSON(filtreZone(/rouge/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: redIcon });
            }
        });



        //ajout des layers à la carte
        geojsonRabattement.addTo(map);
        geojsonVert.addTo(map);
        geojsonBleue.addTo(map);
        geojsonRouge.addTo(map);

        //       geojsonRouge.addData(filtreZone(/rouge/, array));
        //geojsonVert.addData(filtreZone(/verte/, array));
        //geojsonBleue.addData(filtreZone(/bleue/, array));
        //geojsonRabattement.addData(filtreZone(/rabattement/, array));

        remplirTab(geojsonBleue);

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
            "1 - Ligne rouge": geojsonRouge,
            "2 - Zone Verte": geojsonVert,
            "3 - Zone Bleue": geojsonBleue,
            "4 - Point de rabattement": geojsonRabattement
        };

        L.control.layers(null, overlayMaps).addTo(map);

        function remplirTab(tableau) {
           
            var sel = document.getElementById('Depart');
            for (var i = 0; i < tableau.length; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = tableau[i];
                opt.value = tableau[i].properties.CODE;
                sel.appendChild(opt);
            }
        }

    });
});

