/*
 * create by curiosity
 * 2016年10月29日 16:37:31
 * 
 * options = {drap:true,nav:true,arrow:true,scale:0.5};
 * 能否拖拽(默认false)，是否有导航(默认true)，是否有左右箭头(默认false),高度宽度比例(默认第一个图片的比例，不能超过图片比例);
 * 调用cSlider(element, options);
 */

(function() {
	//事件监听
	var eventListener = (function() {
		var touchSupport = "ontouchend" in document;
		var event = {
			start:(function() {
				if(touchSupport){
					return "touchstart";
				}else{
					return "mousedown";
				}
			})(),
			moving:(function() {
				if (touchSupport) {
					return "touchmove";
				} else{
					return "mousemove";
				}
			})(),
			end:(function() {
				if (touchSupport) {
					return "touchend";
				} else{
					return "mouseup";
				}
			})(),
			out:(function() {
				if (touchSupport) {
					return "touchcancel";
				} else{
					return "mouseout";
				}
			})()
		};
		return {
			onStart: function(el, callback) {
				addEvent(el, event.start, callback);
			},
			onMoving: function(el, callback) {
				addEvent(el, event.moving, callback);
			},
			onEnd: function(el, callback) {
				addEvent(el, event.end, callback);
				addEvent(el, event.out, callback);
			}
		}
	})();
	//事件添加封装
	var addEvent = (function() {
		if(document.addEventListener){
			return function(elem, type, fn) {
				elem.addEventListener(type, fn, false);
				return fn;
			}
		}else if(document.attachEvent){
			return function(elem, type, fn) {
				var bound = function() {
					return fn.apply(elem, arguments);
				};
				elem.attachEvent("on"+type, bound);
				return bound;
			}
		}
	})();
	//设置、获取位置(判断是否可以使用translate属性)
	var left = (function() {
		var documentStyle = document.documentElement.style;
		var cacheTransform = null,
			cacheTransition = null;
		//IE10,Firefox,Opera支持transform
		var transforms = ["transform","msTransform","webkitTransform","MozTransform","oTransform"];
		var transitions = ["transition","msTransition","webkitTransition","MozTransition","oTransition"];
		map(transforms, function(item, i) {
			if(item in documentStyle){
				cacheTransform = item;
				cacheTransition = transitions[i];
			}
		});
		if(cacheTransform != null){
			return {
				inside: false,
				set: function(el, l, a) {
					if(!a){
						el.style[cacheTransition] = "all 0.5s";
					}else{
						el.style[cacheTransition] = "";
					}
					el.style[cacheTransform] = "translate(" + l + "px,0)";
				},
				get: function(el) {
					return parseInt(el.style[cacheTransform].split("(")[1]);
				}
			}
		}else{
			return{
				inside: true,
				set: function(el, l) {
					el.style.left = l + "px";
				},
				get: function(el) {
					return parseInt(el.style.left);
				}
			}
		}
	})();
	/*
判断是否支持CSS3属性
function supportCss3(style) { 
	var prefix = ['webkit', 'Moz', 'ms', 'o'], 
		i, 
		humpString = [], 
		htmlStyle = document.documentElement.style, 
		_toHumb = function (string) { 
			return string.replace(/-(\w)/g, function ($0, $1) { 
				return $1.toUpperCase(); 
			}); 
		}; 
	 
	for (i in prefix) 
		humpString.push(_toHumb(prefix[i] + '-' + style)); 
	 
	humpString.push(_toHumb(style)); 
	 
	for (i in humpString) 
		if (humpString[i] in htmlStyle) return true; 
	 
	return false; 
}

	 */
	//遍历
	function map (arr, cb) {
		for(var i = 0; i<arr.length; i++){
			cb(arr[i], i);
		}
	}
	//方法
	var method = {
		setProperty: function(obj, el, wrap, items){
			//if初次调用
			if(!obj.left){
				//left百分比
				obj.left = 0;
				obj.time = 3000;
				obj.length = items.length;
				//1右-1左
				obj.direction = 1;
				obj.draging = false;
				obj.loop = null;
				obj.move = null;
				//设置css样式
				el.style.position = "relative";
				el.style.overflow = "hidden";
				wrap.style.listStyle = "none";
				wrap.style.position = "absolute";
				wrap.style.left = 0;
				map(items, function(item) {
					item.style.position = "absolute";
					item.style.top = "0";
				});
			}
			//每一个li宽
			obj.width = el.offsetWidth;
			//ul宽
			obj.widths = obj.width * obj.length;
			//设置css样式
			map(items, function(item,index) {
				item.style.width = obj.width+"px";
				item.style.left = obj.width*index + "px";
			});
			el.style.height = parseInt(obj.width*obj.scale) + "px";
			wrap.style.width = obj.widths+"px";
			//初始化ul位置
			left.set(wrap, -parseInt(obj.left*obj.width));
		},
		//切换图片
		loop: function(wrap, obj, navItems) {
			window.clearInterval(obj.loop);
			obj.loop = window.setInterval(function loop() {
				method.move(wrap, obj, obj.direction, navItems);
			},obj.time);
		},
		//缓动图片
		move: function(wrap, obj, d, navItems, i) {
			var index = i != undefined ? i : (d<0 ? Math.ceil(obj.left)-1 : Math.floor(obj.left)+1);
			if(i){
				if(i < obj.left){
					d = -1;
				}else{
					d = 1;
				}
			}
			var step = d/50;
			//修正图片位置
			if(d<0 && obj.left == 0){
				obj.left = obj.length-1;
				index = obj.left - 1;
			}else if(d>0 && obj.left == obj.length - 1){
				obj.left = 0;
				index = 1;
			}
			left.set(wrap, -parseInt(obj.left*obj.width),true);
			//缓动
			if(!left.inside){
				//
				window.setTimeout(function() {
					left.set(wrap, -parseInt(index*obj.width));
				},1);
				obj.left = index;
			}else{
				window.clearInterval(obj.move);
				obj.move = window.setInterval(function run() {
					obj.left += step;
					if(Math.abs(obj.left - index)<=Math.abs(step)){
						obj.left = index;
						window.clearInterval(obj.move);
					}
					left.set(wrap, -parseInt(obj.left*obj.width));
				},10);
			}
			//下部导航动画
			method.setFocus(navItems, index%(obj.length-1)+1);
		},
		//鼠标或手指移动轮播图
		touchMove: function(el, wrap, obj, navItems) {
			var start = {},
				temp = {},
				move = {},
				//标记转换图片防止跳出
				change = false,
				d = -1;
			eventListener.onStart(wrap, function(e) {
				obj.draging = true;
				if(left.inside){
					window.clearInterval(obj.move);
				}else{
					obj.left = -left.get(wrap)/obj.width;
				}
				window.clearInterval(obj.loop);
				start = method.getPos(e);
				move = temp = start;
			});
			eventListener.onMoving(el, function(e) {
				if(obj.draging){
					change = false;
					move = method.getPos(e);
					//修正轮播图位置
					if((move.x-temp.x)>0 && obj.left <= 0){
						obj.left += (obj.length - 1);
						change = true;
					}else if((move.x-temp.x)<0 && obj.left >= obj.length - 1){
						obj.left -= (obj.length - 1);
						change = true;
					}
					//console.log(obj.left);
					obj.left -= (move.x-temp.x)/obj.width;
					left.set(wrap, -parseInt(obj.left*obj.width), true);
					d = temp.x - move.x;
					temp = move;
				}
			});
			eventListener.onEnd(wrap, function(e) {
				if(obj.draging && change == false){
					if(Math.abs(d) > 7 || Math.abs(move.x - start.x)>obj.width/3){
						obj.direction = d = d>0?1:-1;
					}else{
						//回正
						d = d>0?-1:1;
					}
					if(move.x - start.x != 0){
						method.move(wrap, obj, d, navItems);
					}
					method.loop(wrap, obj, navItems);
					obj.draging = false;
				}
			});
		},
		makeNav: function(el, wrap, obj, items) {
			var nav = document.createElement("ul");
			var navItems = (function(wrap, obj, items) {
				var navItems = {};
				for(var i = 1; i< items.length; i++){
					navItems[i] = document.createElement("li");
					nav.appendChild(navItems[i]);
				}
				navItems[1].className = "focus-cslider";
				navItems.length = items.length - 1;
				return navItems;
			})(wrap, obj, items);
			for(i = 1; i< items.length; i++){
				(function(index, navItems) {
					addEvent(navItems[index], "click", function() {
						method.loop(wrap, obj, navItems);
						method.move(wrap, obj, obj.direction, navItems, index-1);
					});
				})(i,navItems);
			}
			nav.className = "nav-cslider";
			el.appendChild(nav);
			return navItems;
		},
		setFocus: function(items, index) {
			if(items != null){
				for(var i in items){
					items[i].className = "";
				}
				items[index].className = "focus-cslider";
			}
		},
		//左右箭头
		makeArrow: function(el, wrap, obj, navItems) {
			var leftArrow = document.createElement("div");
			var rightArrow = document.createElement("div");
			leftArrow.className = "cslider-arrow-left";
			rightArrow.className = "cslider-arrow-right";
			addEvent(leftArrow, "click", function() {
				window.clearInterval(obj.loop);
				method.move(wrap, obj, -1, navItems);
				method.loop(wrap, obj, navItems);
			});
			addEvent(rightArrow, "click", function() {
				window.clearInterval(obj.loop);
				method.move(wrap, obj, 1, navItems);
				method.loop(wrap, obj, navItems);
			});
			el.appendChild(leftArrow);
			el.appendChild(rightArrow);
		},
		//焦点位置获取
		getPos: function(e) {
			var touches = e.touches ? e.touches[0] : e;
			e = e || window.event;
			var x = e.pageX || (touches.clientX + document.body.scrollLeft || document.documentElement.scrollLeft);
			var y = e.pageY || (touches.clientY + document.body.scrollTop || document.documentElement.scrollTop);
			return {x:x, y:y};
		}
	}
//  绑定元素
//  el
//  参数
//	options = {
//		是否可拖动,默认false
//		drag:true,
//		是否有导航,默认true
//		nav:true,
//		是否有左右箭头,默认false
//		arrow:true
//	}
	window.cSlider = function(el, options){
		if(el.getAttribute("c-slider") == "c-slider"){
			return undefined;
		}
		el.setAttribute("c-slider","c-slider");
		//获取DOM节点
		var wrap = el.getElementsByTagName("ul")[0],
			items = wrap.getElementsByTagName("li"),
			nextItem = items[0].cloneNode(true);
		var navItems = null;
		wrap.appendChild(nextItem);
		//获取图片宽高比，设置轮播图高度
		var img = new Image();
		img.src = items[0].getElementsByTagName("img")[0].src;
		img.onload = function() {
			//初始化选项
			options = {
				drag: options.drag!=undefined ? options.drag : false,
				nav: options.nav!=undefined ? options.nav : true,
				arrow: options.arrow!=undefined ? options.arrow : false,
				scale: options.scale!=undefined ? options.scale : undefined
			};
			//阻止默认拖拽事件
			el.ondragstart = function() {
				return false;
			};
			//轮播图属性
			var property = {scale:img.height/img.width};
			if(options.scale && options.scale<property.scale){
				property.scale = options.scale;
			}
			console.log(property);
			method.setProperty(property, el, wrap, items);
			addEvent(window,"resize", function() {
				method.setProperty(property, el, wrap, items);
			});
			//创建导航
			if(options.nav){
				navItems = method.makeNav(el, wrap, property, items);
			}
			//创建动画循环
			method.loop(wrap, property, navItems);
			//拖拽交互
			if(options.drag){
				method.touchMove(el, wrap, property, navItems);
			}
			//创建arrow
			if(options.arrow){
				method.makeArrow(el, wrap, property, navItems);
			}
		}
	}
})();
