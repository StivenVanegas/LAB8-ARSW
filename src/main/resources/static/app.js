var app = (function () {

    var valX;
    var valY;

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        var topico = document.getElementById("topico").value;
        stompClient.send("/app/newpoint."+ topico, {}, JSON.stringify({x:valX,y:valY}));
    };

    var addPointToCanvas2 = function (point) {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.stroke();

        };
    
    var addPoligonToCanvas = function (point){
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            ctx.beginPath();

           for (var i in point){
                if (i === 0){
                    ctx.moveTo(point[i].x,point[i].y);
                }

                else {
                    ctx.lineTo(point[i].x,point[i].y);
                }
           }
           ctx.closePath();
           ctx.fill();
    }
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            var topico = document.getElementById("topico").value;
            stompClient.subscribe('/topic/newpoint.'+topico, function (eventbody) {
            var punto = JSON.parse(eventbody.body);
            addPointToCanvas2(punto);

            });
            stompClient.subscribe('/topic/newpoligon.'+topico, function (eventbody) {
                                var puntos = JSON.parse(eventbody.body);
                                addPoligonToCanvas(puntos);
                                });
        });
    };
    
    var canvasInit = function(){
    		var canvas = document.getElementById("canvas");
    		var offset = getOffset(canvas);
    		canvas.addEventListener("pointerdown", pointerHandler, false);

    	};

    	var pointerHandler = function(event,offset){
    		var canvas = document.getElementById("canvas");
    		var offset = getOffset(canvas);
    		valX = event.pageX-offset.left
    		valY = event.pageY-offset.top
    		console.log(valX);
    		console.log(valY);
    		publishPoint(valX,valY);
    	};

    	var getOffset = function(obj) {
              var offsetLeft = 0;
              var offsetTop = 0;
              do {
                if (!isNaN(obj.offsetLeft)) {
                    offsetLeft += obj.offsetLeft;
                }
                if (!isNaN(obj.offsetTop)) {
                    offsetTop += obj.offsetTop;
                }
              } while(obj = obj.offsetParent );
              return {left: offsetLeft, top: offsetTop};
        };

        var publishPoint= function(px,py){

                    var pt=new Point(px,py);
                    console.info("publishing point at "+pt);
                    addPointToCanvas(pt);


                    //publicar el evento
                };

    return {


        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectAndSubscribe();
            canvasInit();
        },



        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();