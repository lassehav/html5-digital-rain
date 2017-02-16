var width = document.body.clientWidth-4,
  height = document.body.clientHeight-4,
  gLoop,
  c = document.getElementById('canvas'),
  ctx = c.getContext('2d');
  c.width = width;
  c.height = height;
  
var charwidth = 15;
var charheight = 10;
var chars = "01ABCDEF#¤%&*=ÖÄ{}\/^~<>¤1000011110101011010"
var greenValues = [255,230,205,180,165,140,115,90,65,40,20,10,0];
var updateCounter = 0;
var dropHolder = new Array();

function CharacterDrop() {
	this.x = 0;
    this.y = 0;
    this.speedx = 0;
    this.speedy = 0; 
	this.chars = [];
	this.charSize = 0;
}

CharacterDrop.prototype.move = function(dx, dy)
{
    this.x -= dx;
    this.y -= dy;
}

CharacterDrop.prototype.changeSpeed = function(deltaVx, deltaVy)
{
    this.speedx += deltaVx;
    this.speedy += deltaVy;
}

CharacterDrop.prototype.setPos = function(x,y)
{
    this.x = x;
    this.y = y;
}

CharacterDrop.prototype.update = function(deltaT)
{
    this.move(this.speedx * deltaT / 1000, this.speedy * deltaT / 1000);
	if(this.y >= height + this.chars.length * this.charSize)
	{
		this.y = -10;
		this.x = Math.floor(Math.random()* width );
	}
	
	if((updateCounter % 5) == 0)
	{
		var randomCharChangeCount = Math.floor(Math.random() * this.chars.length);
		var i = 0;
		for(i = 0; i < randomCharChangeCount; i++)
		{
			var randomCharIndex = Math.floor(Math.random() * chars.length);		
			var changeCharIndex = Math.floor(Math.random() * this.chars.length);
			this.chars[changeCharIndex] = chars.charAt(randomCharIndex);
			
		}
	}
           
}

function createCharacterDrops(count)
{   	
	var i = 0;
    for(i = 0; i < count; i++)
    {
        var rndRadius = 0       
        var rndSpeedX = 0;
		var rndSpeedY = -Math.random()*350-20;
        var signX = 0;
		var signY = 0;
		var rndPosX = Math.random()*width;
		var rndPosY = -10;
                
        dropHolder[i] = new CharacterDrop();
        dropHolder[i].x = rndPosX;
        dropHolder[i].y = rndPosY;
        dropHolder[i].speedx = rndSpeedX;
        dropHolder[i].speedy = rndSpeedY;       		
		dropHolder[i].charSize = Math.floor(Math.random() * 25)+10;
		for(x = 0; x < greenValues.length; x++)
		{
			var greenValue = greenValues[x];	
			var randomCharIndex = Math.floor(Math.random() * chars.length);
			var randomChar = chars.charAt(randomCharIndex);
			dropHolder[i].chars[x] = randomChar;
        } 
    }    
}

function UpdateObjects(deltaTime)
{
	var i = 0;
    for(i = 0; i < dropHolder.length; i++)
    {
        dropHolder[i].update(deltaTime);
    }   
}

function clear()
{
  ctx.beginPath()  
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0,0,width, height);
}

function Draw()
{    
    var i = 0;
    for(i = 0; i < dropHolder.length; i++)
    {        		       
		var posCounter = dropHolder[i].y;
		posCounter = Math.floor(posCounter / dropHolder[i].charSize) * dropHolder[i].charSize;
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.font =  dropHolder[i].charSize + "px Courier";
		var x = 0;
		for(x = 0; x < greenValues.length; x++)
		{				
			ctx.fillText(dropHolder[i].chars[x], dropHolder[i].x, posCounter); 
			ctx.fillStyle = 'rgb(0,' + greenValues[x] + ',0)';
			posCounter -= dropHolder[i].charSize;
        }                     
    }          
}


var startTime = 0;

function StartBuffer()
{
	timeNow = new Date().getTime();
	setTimeout(ExecutionLoop, ONE_FRAME_TIME);
}

function ExecutionLoop() {
	var now;
	if (window.performance.now) {
        now = window.performance.now();
    } else {
        now = Date.now();
    }
    var timeDelta = now - startTime;

	ctx.clearRect(0,0,width,height);        
	
	UpdateObjects(timeDelta);
	Draw();
		         
    startTime = now;
	updateCounter++;
	window.requestAnimationFrame( ExecutionLoop );
}

clear();
createCharacterDrops( width / 5 );
        			
window.requestAnimationFrame( ExecutionLoop );