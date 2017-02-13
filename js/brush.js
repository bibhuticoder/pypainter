function Brush(size, color, maxsize, minsize){
    this.size = size;    
    this.maxsize = maxsize;
    this.minsize = minsize; 
    this.type = "";    
}

Brush.prototype.draw = function(){}

Brush.prototype.pencil = function (context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

Brush.prototype.eraser = function (context, x1, y1, x2, y2) {
    var color = context.strokeStyle;
    
    context.lineWidth *=2;
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    context.strokeStyle = color;
    context.lineWidth /=2;
}

Brush.prototype.marker = function (context, x1, y1, x2, y2) {
    context.globalAlpha = 0.8;
     var color = context.strokeStyle;
   
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    context.beginPath();
    context.lineWidth = this.size / 2;
    context.strokeStyle = "white"; // for small middle line
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();  

    context.lineWidth *= 2;
    context.globalAlpha = 1;
    context.strokeStyle = color;
}

Brush.prototype.chalk = function (context, x1, y1, x2, y2) {
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    // Chalk Effect
    var length = Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / (5 / this.size));
    var xUnit = (x2 - x1) / length;
    var yUnit = (y2 - y1) / length;
    for (var i = 0; i < length; i++) {
        var xCurrent = x1 + (i * xUnit);
        var yCurrent = y1 + (i * yUnit);
        var xRandom = xCurrent + (Math.random() - 0.5) * this.size * 1.2;
        var yRandom = yCurrent + (Math.random() - 0.5) * this.size * 1.2;
        context.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }
}

Brush.prototype.spray =  function (context, x, y) {
    offsetX = this.size;
    offsetY = this.size;

    for (var i = this.size*2; i--;) {
        var offsetX = generateRandom(-this.size, this.size);
        var offsetY = generateRandom(-this.size, this.size);
        context.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
}

Brush.prototype.doubleBrush =  function (context, x1, y1, x2, y2) {

    offset = this.size;
    context.globalAlpha = this.size/5;

    //upper
    context.beginPath();
    context.moveTo(x1 - generateRandom(0, offset), y1 - generateRandom(0, offset));
    context.lineTo(x2 - generateRandom(0, offset), y2 - generateRandom(0, offset));
    context.stroke();

    //mid
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    //lower
    context.beginPath();
    context.moveTo(x1 + generateRandom(0, offset), y1 + generateRandom(0, offset));
    context.lineTo(x2 + generateRandom(0, offset), y2 + generateRandom(0, offset));
    context.stroke();

     context.globalAlpha = 1;
}

Brush.prototype.changeBrush = function(name){
    if(name === "pencil"){
        this.draw = this.pencil;
    }
    else if(name === "marker"){
        this.draw = this.marker;
    }
    else if(name === "chalk"){
        this.draw = this.chalk;
    }
    else if(name === "spray"){
        this.draw = this.spray;
    }
    else if(name === "doubleBrush"){
        this.draw = this.doubleBrush;
    }
    else if(name === "eraser"){
        this.draw = this.eraser;
    }
   
    this.type = name; 
}

Brush.prototype.getType = function(){
    return this.type;
}


function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var clear = function (clearCache) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    if(clearCache) cache = [];
}

// var undo = function () {
//     var color = ctx.strokeStyle;
//     var size = ctx.lineWidth;

//     var i = 0;
//     var c = cache.pop();
//     c = cache.pop();
//     c = cache.pop();
//     console.log(c.type);
//     while(c.type !== 'undo'){        
//         if(c && c.type !== 'undo'){
//             brush.changeBrush(c.type);
//             ctx.strokeStyle = "white";
//             ctx.lineWidth = c.size;    
//             brush.draw(ctx, c.ix, c.iy, c.fx, c.fy);  
            
//         }
//         c = cache.pop();
//         if(i > 500) break;
//         console.log(i);
//     } 

//     //defaults
//     ctx.strokeStyle = color;    
//     ctx.lineWidth = size;  
            
// }
