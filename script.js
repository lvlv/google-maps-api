var geocoder, map;

function initialize() {
    geocoder = new google.maps.Geocoder();
    //начальные настройки
    var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //меняем настройки на Москву
    codeAddress();
    
    var btn = document.getElementById('search-btn');
    google.maps.event.addDomListener(btn, 'click', codeAddress);
}

var markerArray = [];

function codeAddress() {
    var address = document.getElementById('search-box').value || 'Москва';
    geocoder.geocode({
            //для городов названия которых такое же как и их страна, потому что в первую очередь находит страну
            'address' : address + ' город'
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //определить город ли пришел в ответе. возможно есть лучший способ отфильтровать города...
                if(results[0].types[0] === 'locality'){
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(14);
                    var marker = new google.maps.Marker({
                        animation : google.maps.Animation.DROP,
                        icon : 'http://iconizer.net/files/WooFunction_Icon_set/orig/home.png',
                        map : map,
                        position : results[0].geometry.location
                    });
                    map.clearOverlays();
                    markerArray.push(marker);
                }else {
                    alert('This is not a city!');
                    return;
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }


            var content = document.createElement('div');
            content.innerHTML = results[0].formatted_address + '<br>Центр города';


            var infowindow = new google.maps.InfoWindow({
                content: content,
            });

            infowindow.open(map, marker);
        });

}

//можно очистить память просто обнулением объекта marker (obj = null)
google.maps.Map.prototype.clearOverlays = function() {
    for (i in markerArray) {
        //убрать с карты
        markerArray[i].setMap(null);
    }
    //удалить ссылки на объекты, вследствие чего сборщик мусора удалит объекты из памяти
    markerArray.length = 0;

}

google.maps.event.addDomListener(window, 'load', initialize);
