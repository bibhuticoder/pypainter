var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var brush;
var mousedown, playing, playSpeed;
var ix, iy, fx, fy;
var cache, finalData;
var timer;

//defaults
brush = new Brush(2, "black", 10, 2);
brush.changeBrush("pencil");
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = "black";
ctx.lineWidth = brush.size;
mousedown = false;
playing = false;
playSpeed = 20;
cache = [];

$("#canvas").mousedown(function(e){
	mousedown = true;
	ix = getMousePos(canvas, e).x;
	iy = getMousePos(canvas, e).y;
});

$("#canvas").mouseup(function(){
	mousedown = false;
	// cache.push({
	// 	'type':'undo'
	// });
});

$("#canvas").mousemove(function(e){
	if(mousedown && !playing){
		
		fx = getMousePos(canvas, e).x;
		fy = getMousePos(canvas, e).y;
		
		brush.draw(ctx, ix, iy, fx, fy);
		
		cache.push({
			'type':brush.getType(),
			'ix':ix,
			'iy':iy,
			'fx':fx,
			'fy':fy,
			'color':ctx.strokeStyle,
			'size':ctx.lineWidth,
		});		
		
		ix = fx;
		iy = fy;
	}
});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

$("#slider").change(function(e){
	brush.size = this.value;
	ctx.lineWidth = this.value;
})

$(".brush").click(function(){
	brush.changeBrush($(this).attr("id"));

	$(".brush").removeClass("brush-active");
	$(this).addClass("brush-active");
})

$("#replay").click(function(){
	redraw(playSpeed);
	$("#progress").attr("max", cache.length-1);
	$("#progress").attr("min", 0);
})

$("#stop-replay").click(function(){
	clearInterval(timer);
	clear(false);
	var speed = playSpeed;
	playSpeed = cache.length;
	redraw(function(){
		playSpeed  = speed;		
	});
	
})

$(".replay-speed").click(function(){

	var offset = 5;
	var type = $(this).attr("id");		
	if(type === 'fast'){
		playSpeed += offset;
	}else if(type === 'slow'){
		playSpeed -= offset;
	}
})

$("#clear").click(function(){
	clear(true);
})

function update(jscolor) {    
    document.getElementById('color').style.backgroundColor = '#' + jscolor;
    ctx.strokeStyle = '#' + jscolor;
    ctx.fillStyle = '#' + jscolor;
    console.log(ctx.strokeStyle);
}

function redraw(callback){	
	clear(false);
	clearInterval(timer);
	var i = 0;	
	timer = setInterval(function(){
		playing = true;
		for(var j=0; j<playSpeed; j++){
			var c = cache[i];
			if(c){
				brush.changeBrush(c.type);
				ctx.strokeStyle = c.color;
				ctx.lineWidth = c.size;
				brush.draw(ctx, c.ix, c.iy, c.fx, c.fy);
				$("#progress").val(i);	
			}			
			i++;
			if(i >= cache.length || cache.length === 0){
				clearInterval(timer);
				playing = false;				
				if(typeof(callback) === 'function') callback();
				$("#progress").val(0);	
			} 
		}	
	}, 100);
}

function reinstate(){
	// var img = new Image;
	// img.src = finalData;
	// img.onload = function(){
	//   ctx.drawImage(img,0,0);
	// };	
}

$(window).resize(function(){
	fixLayout();
})

function fixLayout(){
	var W = window.innerWidth;
	var H = window.innerHeight;

	var w = $("#canvas-container").width();
	var h = $("#canvas-container").height();

	$("#canvas-container").css("margin-left", (W-w)/2);
	$("#canvas-container").css("margin-top", (H-h)/2);
}

fixLayout();



