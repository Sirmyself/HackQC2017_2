var map;
var overlayMaps = [];

var geojsonVert;
var geojsonBleue;
var geojsonRouge;
var geojsonRabattement;
var Depart = true;
var PointA = null;
var PointB = null;
var filtre = false;

var greyIcon;
var greenIcon;
var blueIcon;
var redIcon;
var yellowIcon;

$('document').ready(function () {
    // initialization de la map
    map = L.map('map').setView([48.4506343914947, -68.5289754901558], 12);
    $('#btnReservation').hide();

    map.on('click', onMapClick);

    //Chargement de la carte de base
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Ajout d'un marker avec popup
    //var marker = L.marker([48.4532573993011, -68.5227191989171]).addTo(map);
    //marker.bindPopup("Je fait des tests");

    //Ajout d'un popup Onclick sur la map 
    var popup = L.popup();

    //liaison au toggle de la page



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
                popupAnchor: [1, -27]
            });
        };

        greyIcon = nouvIcon("grey");
        greenIcon = nouvIcon("green");
        blueIcon = nouvIcon("blue");
        redIcon = nouvIcon("red");
        yellowIcon = nouvIcon("yellow");
        //variable qui contient un point dans la map
        var selection;

        var array = data.features;


        //instanciation des layers
        geojsonVert = new L.GeoJSON(filtreZone(/verte/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: greenIcon })
                    .on('click', markerClick)
                    .bindPopup("<b>Zone verte :</b>" + feature.properties.CODE);
            }
        });
        geojsonBleue = new L.GeoJSON(filtreZone(/bleue/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: blueIcon })
                    .on('click', markerClick)
                    .bindPopup("<b>Zone bleue :</b>" + feature.properties.CODE);
            }
        });
        geojsonRouge = new L.GeoJSON(filtreZone(/rouge/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: redIcon })
                    .on('click', markerClick)
                    .bindPopup("<b>Zone rouge :</b>" + feature.properties.CODE);
            }
        });
        geojsonRabattement = new L.GeoJSON(filtreZone(/rabattement/, array), {
            pointToLayer: function (feature, latlng) {
                return new L.Marker(latlng, { icon: yellowIcon })
                    .on('click', markerClick)
                    .bindPopup("<b>Rabattement : </b>" + feature.properties.CODE);
            }
        });

        //ajout des layers à la carte
        geojsonVert.addTo(map);
        geojsonBleue.addTo(map);
        geojsonRouge.addTo(map);
        geojsonRabattement.addTo(map);


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
        //ajout des layers dans le sélecteur
        L.control.layers(null, overlayMaps).addTo(map);
    });

    //fonction relier à l'événement onCLick
    function markerClick(e) {
        if (Depart) {
            var selection = document.getElementById('Depart');
            selection.innerHTML = e.target.feature.properties.CODE + " " + e.target.feature.properties.Type_arret;
            PointA = e;
        }
        else {
            var selection = document.getElementById('Destination');
            selection.innerHTML = e.target.feature.properties.CODE + " " + e.target.feature.properties.Type_arret;
            PointB = e;
        }

        var activer = PointA != null && PointB != null;
        $('#btnReservation').toggle(activer);

        if (activer) {
            determinerheures(PointA, PointB);
        }


    }
    map.on('locationfound', onLocation);
});


//Fonction de sélection des zones affichées en fonction du point de départ sélectionné
function checkDepart() {
    var checkbox = document.getElementById('myonoffswitch');
    Depart = !checkbox.checked;
    if (!Depart) {
        if (PointA != null) {
            var type = PointA.target.feature.properties.Type_arret;
            if (type != "Point de rabattement") {
                if (type != "Taxibus - Zone verte") {
                    uncheck("1 - Zone verte");
                }
                if (type != 'Taxibus - Zone bleue') {
                    uncheck("2 - Zone bleue");
                }
                if (type != "Taxibus - Ligne rouge") {
                    uncheck("3 - Ligne rouge");
                }
            }
            else {
                uncheck("4 - Point de rabattement");
            }
        }
    }
    else {
        check("1 - Zone verte");
        check("2 - Zone bleue");
        check("3 - Ligne rouge");
        check("4 - Point de rabattement");
    }
}


function uncheck(chaine) {
    if ($("span:contains(" + chaine + ")").parent().find(">:first-child").first()[0].checked) {
        $("span:contains(" + chaine + ")").parent().find(">:first-child").trigger("click");
    }
}

function check(chaine) {
    if (!($("span:contains(" + chaine + ")").parent().find(">:first-child").first()[0].checked)) {
        $("span:contains(" + chaine + ")").parent().find(">:first-child").trigger("click");
    }
}

//fonction de géolocalisation présentement hardcode À luceville pour des raisons de convivialité
function position() {
    map.locate({ setView: true, maxZoom: 17, enableHighAccuracy: true });/*
    var coord = [48.5206343914947, -68.4578054901558];
    map.setView(coord, 17);
    onLocation({ latlng: coord });//*/
}

function onLocation(e) {
    var acc = e.accuracy / 2;

    var marker = L.marker(e.latlng, { icon: greyIcon }).addTo(map);
    marker.bindPopup("Votre position actuelle");
}

function filtrerRadius(e, radius) {
    var cercleFiltre = L.circle(e.latlng, radius);
    var collection = new L.GeoJSON();
    var temp = [];
    map.eachLayer(
        function (layer) {
            // Check if layer is a marker
            if ((layer instanceof L.Circle)) {
                map.removeLayer(layer);
            }
            if (layer instanceof L.Marker) {
                if (cercleFiltre.getBounds().contains(layer._latlng)) {
                    temp.push(layer);
                }
            }
        });

    collection._layers = temp;
    overlayMap(collection);

    collection.addTo(map);
    cercleFiltre.addTo(map);
}

function enleverCercle() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Circle) {
            map.removeLayer(layer);
        }
    });
}

function reinitPts() {
    enleverCercle();

    check("Zone verte");
    check("Zone bleue");
    check("Ligne rouge");
    check("Point de rabattement");
    if (filtre) {
        uncheck("Filtre");
        filtre = false;
    }
}

function overlayMap(overlayFiltre) {
    $(".leaflet-top.leaflet-right > *").remove()
    if (overlayFiltre == null) {
        overlayMaps = {
            "1 - Zone verte": geojsonVert,
            "2 - Zone bleue": geojsonBleue,
            "3 - Ligne rouge": geojsonRouge,
            "4 - Point de rabattement": geojsonRabattement
        };
    }
    else {
        overlayMaps = {
            "1 - Zone verte": geojsonVert,
            "2 - Zone bleue": geojsonBleue,
            "3 - Ligne rouge": geojsonRouge,
            "4 - Point de rabattement": geojsonRabattement,
            "Filtre": overlayFiltre
        };
    }

    L.control.layers(null, overlayMaps).addTo(map);
}

//fonction onclick de la map
function onMapClick(e) {
    filtrerRadius(e);
}

function determinerheures(a, b) {
    var heures;
    if (a.target.feature.properties.Type_arret == b.target.feature.properties.Type_arret) {
        heures = a.target.feature.properties.SEM_SEUL.split(", ");
    }
    else if (a.target.feature.properties.Type_arret == "Point de rabattement") {
        heures = a.target.feature.properties.SEM_VERS_TAXI.split(", ");
    }
    else {
        heures = a.target.feature.properties.SEM_VERS_BUS.split(", ");
    }

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
    var contenu = '<h1>Arrêt ' + a.target.feature.properties.CODE + ' ( ' + a.target.feature.properties.Type_arret + ')</h1>' + contenuHeures;
    $('#infoArret').html(contenu);
}

function onMapClick(e) {
    filtrerRadius(e, document.getElementById("nudRayon").value * 1000);
}

function setFiltreRadius() {
    map.eachLayer(function (layer) {
        // Check if layer is a marker
        if (layer instanceof L.Circle) {
            var coord = layer._latlng;
            var preferredRadius = document.getElementById("nudRayon").value * 1000;
            filtrerRadius({ latlng: coord }, preferredRadius);
        }
    });
}