document.addEventListener("DOMContentLoaded", function() {
	//https://josephernest.github.io/bigpicture.js/index.html
	// Custom JS
	//var bigNumber = Number.POSITIVE_INFINITY;
	//console.log(console);

	//drag
	var DragManager = new function() {

		/**
		 * составной объект для хранения информации о переносе:
		 * {
		 *   elem - элемент, на котором была зажата мышь
		 *   avatar - аватар
		 *   downX/downY - координаты, на которых был mousedown
		 *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
		 * }
		 */
		var dragObject = {};
	  
		var self = this;
	  
		function onMouseDown(e) {
	  
		  if (e.which != 1) return;
	  
		  var elem = e.target.closest('.cNode');
		  if (!elem) return;
	  
		  dragObject.elem = elem;
	  
		  // запомним, что элемент нажат на текущих координатах pageX/pageY
		  dragObject.downX = e.pageX;
		  dragObject.downY = e.pageY;
	  
		  return false;
		}
	  
		function onMouseMove(e) {
		  if (!dragObject.elem) return; // элемент не зажат
	  
		  if (!dragObject.avatar) { // если перенос не начат...
			var moveX = e.pageX - dragObject.downX;
			var moveY = e.pageY - dragObject.downY;
	  
			// если мышь передвинулась в нажатом состоянии недостаточно далеко
			if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
			  return;
			}
	  
			// начинаем перенос
			dragObject.avatar = createAvatar(e); // создать аватар
			if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
			  dragObject = {};
			  return;
			}
	  
			// аватар создан успешно
			// создать вспомогательные свойства shiftX/shiftY
			var coords = getCoords(dragObject.avatar);
			dragObject.shiftX = dragObject.downX - coords.left;
			dragObject.shiftY = dragObject.downY - coords.top;
	  
			startDrag(e); // отобразить начало переноса
		  }
	  
		  // отобразить перенос объекта при каждом движении мыши
		  dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
		  dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
	  
		  return false;
		}
	  
		function onMouseUp(e) {
		  if (dragObject.avatar) { // если перенос идет
			finishDrag(e);
		  }
	  
		  // перенос либо не начинался, либо завершился
		  // в любом случае очистим "состояние переноса" dragObject
		  dragObject = {};
		}
	  
		function finishDrag(e) {
		  var dropElem = findDroppable(e);
		  var avatar = dragObject.avatar;//
	  
		  avatar.classList.remove("Draggable");//
		  avatar.classList.add("stayDrag");//
		  if (!dropElem) {
			  console.log('1')//
			self.onDragCancel(dragObject);
		  } else {
			console.log('2')//
			self.onDragEnd(dragObject, dropElem);
		  }
		}
	  
		function createAvatar(e) {
	  
		  // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
		  var avatar = dragObject.elem;
		  var old = {
			parent: avatar.parentNode,
			nextSibling: avatar.nextSibling,
			position: avatar.position || '',
			left: avatar.left || '',
			top: avatar.top || '',
			zIndex: avatar.zIndex || ''
		  };
	  
		  // функция для отмены переноса
		  avatar.rollback = function() {
			old.parent.insertBefore(avatar, old.nextSibling);
			avatar.style.position = old.position;
			avatar.style.left = old.left;
			avatar.style.top = old.top;
			avatar.style.zIndex = old.zIndex
		  };
	  
		  return avatar;
		}
	  
		function startDrag(e) {
		  var avatar = dragObject.avatar;
	  
		  // инициировать начало переноса
		  //document.body.appendChild(avatar);
		  avatar.classList.add("Draggable");//
		  avatar.classList.remove("stayDrag");//
		  //avatar.style.zIndex = 9999; //move to css .Draggable
		  //avatar.style.position = 'absolute'; //move to css .Draggable
		}
	  
		function findDroppable(event) {
		  // спрячем переносимый элемент
		  dragObject.avatar.hidden = true;
	  
		  // получить самый вложенный элемент под курсором мыши
		  var elem = document.elementFromPoint(event.clientX, event.clientY);
	  
		  // показать переносимый элемент обратно
		  dragObject.avatar.hidden = false;
	  
		  if (elem == null) {
			// такое возможно, если курсор мыши "вылетел" за границу окна
			return null;
		  }
	  
		  return elem.closest('.destroy');
		}
	  
		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;
		document.onmousedown = onMouseDown;
	  
		this.onDragEnd = function(dragObject, dropElem) {};
		this.onDragCancel = function(dragObject) {};
	  
	  };
	  
	  
	  function getCoords(elem) { // кроме IE8-
		var box = elem.getBoundingClientRect();
	  
		return {
		  top: box.top + pageYOffset,
		  left: box.left + pageXOffset
		};
	  
	  }

	  //*****************//
	  DragManager.onDragCancel = function(dragObject) {
		//dragObject.avatar.rollback();
	  };
  
	  DragManager.onDragEnd = function(dragObject, dropElem) {
		dragObject.elem.style.display = 'none';
		//dropElem.classList.add('computer-smile');
		setTimeout(function() {
		  dropElem.classList.remove('computer-smile');
		}, 200);
	  };
	//scroll

});
