document.addEventListener("DOMContentLoaded", function() {

	// Custom JS
	//var bigNumber = Number.POSITIVE_INFINITY;
	console.log(dNone);

	//drag

    var dNone = document.getElementById('testNone');

    dNone.onmousedown = function(e) {

      var coords = getCoords(dNone);
      var shiftX = e.pageX - coords.left;
      var shiftY = e.pageY - coords.top;

      dNone.style.position = 'absolute';
      document.body.appendChild(dNone);
      moveAt(e);

      dNone.style.zIndex = 1000; // над другими элементами

      function moveAt(e) {
        dNone.style.left = e.pageX - shiftX + 'px';
        dNone.style.top = e.pageY - shiftY + 'px';
      }

      document.onmousemove = function(e) {
        moveAt(e);
      };

      dNone.onmouseup = function() {
        document.onmousemove = null;
        dNone.onmouseup = null;
      };

    }

    dNone.ondragstart = function() {
      return false;
    };


    function getCoords(elem) { // кроме IE8-
      var box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

    }
	console.log(dNone);

});

