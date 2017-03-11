



$('document').ready(function () {
    // initialization de la map
    var map = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);


   

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Ajout d'un marker avec popup
    var marker = L.marker([48.4532573993011, -68.5227191989171]).addTo(map);
    marker.bindPopup("Je fait des tests");

    //Ajout d'un popup Onclick sur la map 
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Tu as cliqués sur la map à " + e.latlng.toString())

            .openOn(map);
    }
    map.on('click', onMapClick);


    var LeafIcon = L.Icon({

        iconUrl: "http://icon-icons.com/icons2/851/PNG/512/pikachu_icon-icons.com_67535.png",
        iconRetinaUrl: 'my-icon@2x.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'my-icon-shadow.png',
        shadowRetinaUrl: 'my-icon-shadow@2x.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]

    }
    );
   
    var geojsonRabattement = new L.GeoJSON();
    var geojsonVert = new L.GeoJSON();
    var geojsonBleue = new L.GeoJSON();
    var geojsonRouge = new L.GeoJSON();



    geojsonRabattement.addTo(map);
    geojsonVert.addTo(map);
    geojsonBleue.addTo(map);
    geojsonRouge.addTo(map);

    geojsonBleue.options.iconUrl

    function filtreZone(regex, data) {
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

    //Lecture GeoJson
    $.getJSON("Arrets.json", function (data) {
        var array = data.features;
        geojsonRouge.addData(filtreZone(/rouge/, array));
        geojsonVert.addData(filtreZone(/verte/, array));
        geojsonBleue.addData(filtreZone(/bleue/, array));
        geojsonRabattement.addData(filtreZone(/rabattement/, array));
    });
    var overlayMaps = {
        "Ligne rouge": geojsonRouge,
        "Zone Verte": geojsonVert,
        "Zone Bleue": geojsonBleue,
        "Point de rabattement": geojsonRabattement
    };

    L.control.layers(null, overlayMaps).addTo(map);

});

