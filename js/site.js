var label = new L.TileLayer.d3_geoJSON('http://tile.openstreetmap.us/vectiles-skeletron/{z}/{x}/{y}.json', {
  id: function(d) {return d.geometry.coordinates[0]+d.geometry.coordinates[1]},
  id2: function(d) {return "#"+d.geometry.coordinates[0]+d.geometry.coordinates[1]},
  class: function(d) {return "text-"+d.properties.highway; console.log(d.properties.highway)},
  class: function(d) {return "text text-"+d.properties.highway; console.log(d.properties.highway)},
  text: function(d) {return d.properties.name }
})

var land = new L.TileLayer.d3_geoJSON('http://tile.openstreetmap.us/vectiles-land-usages/{z}/{x}/{y}.json', {
  class: function(d) {return 'landuse ' + d.properties.kind; console.log(d.properties.kind)},
});

var building = new L.TileLayer.d3_geoJSON('http://tile.openstreetmap.us/vectiles-buildings/{z}/{x}/{y}.json', {
  class: 'building'
});

var road = new L.TileLayer.d3_geoJSON('http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.json', {
  class: function(d) { return d.properties.kind}
});

var water = new L.TileLayer.d3_geoJSON('http://tile.openstreetmap.us/vectiles-water-areas/{z}/{x}/{y}.json', {
  class: 'water'
});

// Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
var dummy = new L.geoJson({'type': 'LineString','coordinates':[[0,0],[0,0]]})

var map = L.map('map', {
  center: [37.7837,-122.4166],
  zoom: 17,
  // layers: [dummy,label],
  layers: [land, water, building, road, dummy,label]
}).addControl(L.mapbox.geocoderControl('bobbysud.map-15wycltk'));

// var hash = new L.Hash(map);

if(window.location.hash) {
	var hash = window.location.hash.substr(1);
 	$.ajax({
    type:'GET',
    url: 'https://api.github.com/gists/' + hash,
    success:function(response){
    	var css = response.files.map.content;
    	$('.main').html(css)
    	$('.style').html(css)
    },
    error:function(error){
    	console.log(error)
    }
  })
}

var style = $('.style').text();
$('.main').html(style)

$('.main').keyup(function(){
  var text = $(this).val()
  $('.style').html(text);
});


$('#save').click(function(){
	window.location.hash = '#';	
	var text = $('.main').val();
	var url = window.location.href;

	$.ajax({
    type:'POST',
    url: 'https://api.github.com/gists',
    data: JSON.stringify({
        "public": true,
        "files": {
            "map": {
                "content": text
            }          
        },
    }),
    success:function(response){
       	window.location.hash = response.id;
       	$('.modal').show()
       	$('.modal h4').after("<p>Link: <a href='" + window.location.origin + "/VectorMill/embed/#" + response.id + "'>" + window.location.origin + "/embed/#" + response.id +"</a></p>");
       	$('.modal h4').after("<p>iframe: &lt;iframe width='500px' height='300px' frameBorder='0' src='" + window.location.origin + '/VectorMill/embed/#' + response.id + "' &gt;&lt;/iframe&gt;</p>")
       	$('.modal iframe').attr('src', window.location.origin + '/embed/#' + response.id)
       	$('#editor, #map').click(function(){
       		$('.modal').hide();
       	})
    }
	});
})