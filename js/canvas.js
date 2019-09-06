var canvas = {
	signature: document.getElementById("canvas"),
	drawing: false,
	
	init: function(){
		this.context = this.signature.getContext('2d');
		this.context.strokeStyle = "#086a6a";
		this.context.lineWidth = 2;
		this.signature.style.backgroundColor = "white";
		this.signature.style.display = "block";
		this.signature.style.position = "relative";

		this.mouseDown();
		this.mouseMove();
		this.mouseUp();
		this.clearCanvas();
		this.touchMove();
		this.touchStart();
		this.touchEnd();
		this.createToolBox();
	},

	createToolBox: function(){
		$("#canvas").before('<div class="canvasButton"></div>'),
		$(".canvasButton").append('<h4 class="sign"><span class="glyphicon glyphicon-pencil"></span> Signing up:</h4>'),
		$(".canvasButton").append('<button id="clear">Clear</button>'),
		$(".canvasButton").append('<button id="send">Send</button>');
	},

	mouseDown: function(){
		var that = this;

		this.signature.addEventListener("mousedown", function(e)
		{
			console.log(e);
			that.drawing = true;
			that.context.moveTo(e.offsetX, e.offsetY);
		});
	},

	mouseMove: function(){
		var that = this;

		this.signature.addEventListener("mousemove", function(e)
		{
			if (that.drawing === true)
			{
				that.draw(e.offsetX, e.offsetY);
			}
		});
	},

	mouseUp: function(){
		var that = this;

		this.signature.addEventListener("mouseup", function(e){
			that.drawing = false;
		});
	},

	draw: function(x,y){
		this.context.lineTo(x,y);
		this.context.stroke();
	},

	clearCanvas: function(){
		this.context.clearRect(0,0,500,500);
		this.context.beginPath();
	},

	checkCanvas: function(callback){
		var that = this;

		this.signature.toBlob(function(blob){
			if(blob.size > 927){
				callback(that.canvasSigned = true);
				$(".canvasButton").remove();
				that.signature.style.display = "none";
			}else{
				alert("Please sign to book !");
				callback(that.canvasSigned = false);
			};
		});
	},

	//tactile function:
	touchStart: function(){
		var that = this;
		this.signature.addEventListener("touchstart", function(e){
			e.preventDefault();
			console.log(e.targetTouches[0].target);
			console.log(e);
			that.context.moveTo(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
			that.drawing = true;
		});
	},

	touchMove: function(){
		var that = this;

		this.signature.addEventListener("touchmove", function(e){
			e.preventDefault();
			if (that.drawing === true)
			{
				console.log(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
				that.draw(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
			}
		});
	},

	touchEnd: function(){
		var that = this;

		this.signature.addEventListener("touchend", function(e){
			e.preventDefault();
			that.drawing = false;
		})
	},


};
