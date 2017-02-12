var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var brush;
var mousedown;
var ix, iy, fx, fy;
var cache;

//defaults
brush = new Brush(2, "black", 15, 1);
brush.changeBrush("pencil");
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
mousedown = false;
cache = [];


$("#canvas").mousedown(function(e){
	mousedown = true;
	ix = getMousePos(canvas, e).x;
	iy = getMousePos(canvas, e).y;
});

$("#canvas").mouseup(function(){
	mousedown = false;
	cache.push({
		'type':'undo'
	});
});

$("#canvas").mouseout(function(){
	mousedown = false;
	cache.push({
		'type':'undo'
	});
});

$("#canvas").mousemove(function(e){
	if(mousedown){
		
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
	redraw(parseInt($("#speed").val()));
})

function update(jscolor) {    
    document.getElementById('color').style.backgroundColor = '#' + jscolor;
    ctx.strokeStyle = '#' + jscolor;
    ctx.fillStyle = '#' + jscolor;
    console.log(ctx.strokeStyle);
}


function redraw(speed){	
	clear();
	var i = 0;
	var timer = setInterval(function(){
		for(var j=0; j<speed; j++){
			var c = cache[i];
			if(c){
				brush.changeBrush(c.type);
				ctx.strokeStyle = c.color;
				ctx.lineWidth = c.size;
				brush.draw(ctx, c.ix, c.iy, c.fx, c.fy);	
			}			
			i++;
			if(i >= cache.length-1) clearInterval(timer);
		}	
	}, 100);
}

function init(){
	
}

init();


