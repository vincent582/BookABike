var Slider = {

	buttonPrev: $(".buttonDisplay").append("<button id='prev'><span class='glyphicon glyphicon-backward'></span></button>"),
	buttonPlay: $(".buttonDisplay").append("<button id='play'><span class='glyphicon glyphicon-play'></span></button>"),
	buttonPause: $(".buttonDisplay").append("<button id='pause'><span class='glyphicon glyphicon-pause'></span></button>"),
	buttonNext: $(".buttonDisplay").append("<button id='next'><span class='glyphicon glyphicon-forward'></span></button>"),
	
	init: function(images){
		this.imageIndex = 1; //
		this.pictures = images;
		this.autoChange = null;
		this.showSlide();
		this.autoChangeIndex();
		this.changeIndexByKeyboard();
		this.buttonPrev();
		this.buttonPlay();
		this.buttonPause();
		this.buttonNext();
	},

	//function to display the pictures 
	showSlide: function(){

		if (this.imageIndex > this.pictures.length)
		{
			this.imageIndex = 1;
		}

		if (this.imageIndex < 1) 
		{
			this.imageIndex = this.pictures.length;
		}

		for (var i = 0; i < this.pictures.length; i++) {
			this.pictures[i].style.display = "none";
		}

		this.pictures[this.imageIndex -1].style.display="block";

		return 
	},

	//change index of picture 
	changeIndex: function(number){
		return this.showSlide(this.imageIndex += number)
	},

	//controle by keyboard to change index
	changeIndexByKeyboard: function(){
		var that = this;
		document.addEventListener("keydown", function(e)
		{
			if (e.keyCode === 37)
			{
				that.changeIndex(-1);
			}
			
			if (e.keyCode === 39)
			{
				that.changeIndex(+1);
			}
		});
	},	

	//function to change index automatic
	autoChangeIndex: function(){
		var that = this;
		this.autoChange = setInterval(function(){
			that.changeIndex(+1)}, 5000);
		return 
	},

	//stop automatic function
	stopAutoChange : function ()
	{
		clearInterval(this.autoChange);
		return
	},

	//start automatic function
	startAutoChange : function ()
	{
		clearInterval(this.autoChange);
		this.autoChangeIndex();
		return
	},

	//add function on click to buttons controller 
	buttonPrev: function(){
		var that = this;
		$('#prev').on('click', function(){
			that.changeIndex(-1);
		})
	},

	buttonPlay: function(){
		var that = this;
		$('#play').on('click', function(){
			that.startAutoChange();
		})
	},

	buttonPause: function(){
		var that = this;
		$('#pause').on('click', function(){
			that.stopAutoChange();
		})
	},

	buttonNext: function(){
		var that = this;
		$("#next").on('click', function(){
			that.changeIndex(+1);
		})
	},

};




