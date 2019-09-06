$(document).ready(function(){
	//create object diaporama 
	var images = $('.image');
	var diaporama = Object.create(Slider);
	diaporama.init(images);

	//give value to var for function ajax
	var apiKey = "&apiKey=04dcaebffeb272a20fcb1ca110a826b78c523ecc";
	var city = "brisbane";
	var latitude = -27.4710107;
	var longitude = 153.0234489;

	//if req ajax success create object map
	ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract="+city+apiKey,function(reponse){
		var data = JSON.parse(reponse);
		
		var myMap = Object.create(map);
		myMap.init(data,latitude,longitude);
	});
});

/*
	//test with other city:
	var city2 = "lyon";
	var latitude2 = 45.764043;
	var longitude2 = 4.835659;

	ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract="+city2+apiKey,function(reponse){
		var data = JSON.parse(reponse);
		var myMap = Object.create(map);
		myMap.init(data,latitude2,longitude2);
	});
*/