// Object map
map = {
	//get element with id "mapid" to create the map Object. Give path to images for custom marker. 
	mapElt: document.getElementById("mapid"),
	markerBicycle: L.icon({iconUrl: 'images/bicycleMarker.png',iconSize: [30,50]}),
	markerBicycleClosed: L.icon({iconUrl: 'images/markerClosed.png',iconSize: [30,50]}),
	form: $("form").hide(), //hide div form of html
	bookedDetails: $(".bookedDetails").hide(),

	//init Object with parameters.
	init: function(data,latitude,longitude){
		console.log(this.mapElt)
		this.stations = data;
		this.lat = latitude;
		this.lon = longitude;
		this.getMap();
		this.getStations();
		this.checkSession();
		this.checkForm();
	},


	//show map with Leaflet.
	getMap: function()
	{
		this.mapElt = L.map(this.mapElt).setView([this.lat,this.lon], 14);
		L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png').addTo(this.mapElt);
	},


	//get marker on the map.
	getStations: function()
	{
		var that = this;
		var stations = [];
		//get position informations for each stations. and add marker property to station
		this.stations.forEach(function (station)
		{
			var lat = station.position.lat;
			var lng = station.position.lng;
			//add marker following station status.
			if (station.status === "OPEN")
			{
				this.marker = L.marker([lat,lng], {icon: this.markerBicycle}).addTo(this.mapElt);
			}
			else
			{
				this.marker = L.marker([lat,lng], {icon: this.markerBicycleClosed}).addTo(this.mapElt);
			}

			//add marker to the object station
			station.marker = this.marker;
			
			//add popup onclick marker.	
			this.marker.bindPopup(station.name+"<br>"+station.status);

			stations.push(station);
		}, this);
	
		stations.forEach(function(m){
			console.log(m);
			m.marker.on("click", function(){
			//onclick marker start function showInfo() with informations about the station selected.
			that.getInfo(m.address, m.bike_stands, m.available_bikes, m.status);
			$("#canvas").hide();
			$(".canvasButton").hide();
			})
		})

		return stations;
	},


	//show information on marker click 
	getInfo: function(address,bikeStands,availableBikes,status)
	{
		console.log(status);
		// give value to var global of the object
		this.address = address;
		this.availableBikes = availableBikes;

		//check if station Open 
		if(status === "OPEN")
		{
			//check if bicycle available
			if(availableBikes > 0)
			{
				//show information in a div.
				$("#infoStation").html("<p>"+address +"<br>"+bikeStands+" Bicycles Stands<br>"+availableBikes+" Bicycle(s) available<br></p>");
				//show form.
				this.form.show();
			}
			else
			{
				//if no available
				$("#infoStation").html("<p>"+address +"<br>"+bikeStands+" Bicycles Stands<br>"+availableBikes+" Bicycle(s) available<br></p><p style='color:#fffb00;'>No bicycles available here!<br></p>");
				this.form.hide();
			}
		}
		else
		{
			//if station closed.
			$("#infoStation").html("<p style='color:#fffb00;'>This station is closed.<br>You can't book a bicycle here.</p>");
			//hide form
			this.form.hide();
		}
	},


	checkSession: function(){
		//fill the form with local storage
		$('#surname').val(localStorage.getItem('surname'));
		$("#name").val(localStorage.getItem('name'));
		
		//check if session exist
		if(sessionStorage.getItem('address') != null)
		{
			//get info to show the timer
			var min = sessionStorage.getItem('min');
			var sec = sessionStorage.getItem('sec');

			if (min != 0 || sec != 0)
			{
				$(".bookedDetails").show();
				$("#infoBooked").html("<p>Bicycle booked at station : "+sessionStorage.getItem("address")+" , By "+sessionStorage.getItem("surname")+" "+sessionStorage.getItem("name")+"</p>");
				$("#timer").html("<p>Remaining time: "+min+"m "+sec+"s</p>");
				$("#infoStation").html("<p>1 bicycle booked at "+sessionStorage.getItem("address")+"</p>");
				
				//restart timer with information saved
				this.sessionTimer(min,sec);
			};

			sessionOpen = true;
		}
		else
		{
			sessionOpen = false;
		}

		return sessionOpen
	},


	checkForm: function(){
		var that = this;
		//when send form:
		this.form.on("submit", function(e) 
		{
			// hide form 
			that.form.hide();
			//create var global of info customer
			that.surname = $('#surname').val();
			that.name = $("#name").val();
			//save the value in local storage
			localStorage.setItem('surname', that.surname);
			localStorage.setItem('name', that.name);

			//check if one session already have information:
			if(sessionOpen === true)
			{
				//create form to keep or delete.
				$("#infoStation").html("<p>You already have a reservation at : <br>"+sessionStorage.getItem("address")+"</p><p> Do you want delete it?</p><br><button id='yes'>Yes</button><button id='no'>No</button>");
				//if choose to delete, clear session and reload the page.
				$("#yes").on("click", function(){
					sessionStorage.clear();
					$(".bookedDetails").hide();
					$("#infoStation").hide();
					$("#infoBooked").hide();
					$("#timer").hide();
					that.newBooking(that.address,that.surname,that.name);
				});
				// if keep session reload without clear.
				$("#no").on("click", function(){
					$("#infoStation").show().html("<p>1 bicycle booked at "+sessionStorage.getItem("address")+"</p>");
				});
			}
			else
			{
				// create booking
				that.newBooking(that.address,that.surname,that.name);
				sessionOpen = true;
			}

			event.preventDefault(e); // cancel data sending
		});
	},

	newBooking: function()
	{
		var that = this;
		
		$("#infoStation").hide();
		var sign = Object.create(canvas);
		sign.init();
		
		$("#send").on('click', function(){
			sign.checkCanvas(function(){
				if(sign.canvasSigned === true)
				{
					$(".bookedDetails").show();
					$(".sign").hide();
					$("#send").hide();
					$("#clear").hide();			
					$("#infoBooked").show().html("<p>Bicycle booked at station : "+that.address+" , By "+that.surname+" "+that.name+"</p>");
					$("#infoStation").show().html("<p>1 bicycle booked at "+that.address+"</p>");
					$("#timer").show().html("<p>Remaining time: 20m 00s</p>");
					that.saveSession(that.address,that.surname,that.name);

					clearInterval(that.time);
					that.sessionTimer(20,0);
				}
				else
				{
					console.log(sign.canvasSigned);
				}
			});
		});	

		$("#clear").on("click", function(){
			sign.clearCanvas();
		});
	},


	saveSession: function(namestation,surname,name){
		//set differents items to session storage and local.
		sessionStorage.setItem('address', namestation);
		sessionStorage.setItem('surname', surname);
		sessionStorage.setItem('name', name);
	},
	

	sessionTimer: function(minutes,secondes){
		var min = minutes;
		var sec = secondes;
		this.time = setInterval(timer, 1000);

		function timer()
		{
			if(sec > 0)
			{
				sec -= 1;
			}
			else if(sec == 0)
			{
				if(min > 0)
				{
					min -= 1;
					sec = 59;
				}
				else if(min == 0 && sec == 0) 
				{
					//if timer = 0min 0s send alert, clear infos, reload page.
					alert("Reservation Expired !");
					clearInterval(this.time);
					sessionStorage.clear();
					location.reload();
				};
			};
			
			//show timer each time the function timer is called and set values in sessionStorage.
			$("#timer").html("Remaining time: "+min+"m "+sec+"s");
			sessionStorage.setItem('min', min);
			sessionStorage.setItem('sec', sec);		
		};
	},	
}