document.addEventListener("DOMContentLoaded", function() {

	// Custom JS
	//var bigNumber = Number.POSITIVE_INFINITY;
	console.log(console);

	//drag
    var cNode = document.getElementById('cNode');

    cNode.onmousedown = function(e) {

      var coords = getCoords(cNode);
      var shiftX = e.pageX - coords.left;
      var shiftY = e.pageY - coords.top;

      cNode.style.position = 'absolute';
      //document.body.appendChild(cNode);
      moveAt(e);

      cNode.style.zIndex = 1000; // над другими элементами

      function moveAt(e) {
        cNode.style.left = e.pageX - shiftX + 'px';
        cNode.style.top = e.pageY - shiftY + 'px';
      }

      document.onmousemove = function(e) {
        moveAt(e);
      };

      cNode.onmouseup = function() {
        document.onmousemove = null;
        cNode.onmouseup = null;
      };

    }

    cNode.ondragstart = function() {
      return false;
    };


    function getCoords(elem) { // кроме IE8-
      var box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

    }

});

