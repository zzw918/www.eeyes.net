window.onload = function () {
	

	/* 第一部分 banner轮播图
	 * 这一部分采用向右自动轮播的方式进行
	 * 可以设定轮播的间隔时间以及当鼠标划过时是否停止轮播
	 */
	var bannerSwipe = (function() {
		var imageWrap = document.querySelector(".image");
		imageWrap.style.left = "-1154px";
		function next_pic() {
			index++;
			if (index > 2) {
				index = 0;
			}
			var newLeft;
			if (imageWrap.style.left === "-4616px") {
				newLeft = -2308;
			} else {
				newLeft = parseInt(imageWrap.style.left) - 1154;
			}
			imageWrap.style.left = newLeft + "px"; 
			showCurrentDot();
		}

		var timer = null;
		function autoPlay () {
			timer = setInterval(function() {
				next_pic();
			}, 4000);
		}
		autoPlay();

		if (true) {
			var img_container = document.querySelector(".image-outer");
			img_container.onmouseenter = function() {
				clearInterval(timer);
			}
			img_container.onmouseleave = function() {
				autoPlay();
			}
		}

		var index = 0,
			dots = document.querySelectorAll(".list-num li"),
			len = dots.length,
			i;
		function showCurrentDot() {
			for (i = 0; i < len; i++) {
				dots[i].className = "";
			}
			dots[index].className = "selected";
		}
		
		for (i = 0; i < len; i++) {

			// 使函数立即执行，以获得对应的i
			(function(i) {
				dots[i].onclick = function() {

					// 计算当前与将要点击的图片的index差值
					var distance = index - i,
						imageWrapLeft = imageWrap.style.left; 

					// 解决当处于html中最后一张图片时(显示第一张图片)点击后出现的问题
					if (index === 0 && imageWrapLeft === "-4616px") {
						distance = 3 + distance;
					}
					imageWrapLeft = (parseInt(imageWrapLeft) + 1154*distance) + "px";

					// 这里必须将变量imageWrapLeft赋值给imageWrap.style.left才能生效
					imageWrap.style.left = imageWrapLeft;
					index = i;
					showCurrentDot();
				}
			}(i));
		}
	}());


	/* 第二部分：成员风采图片切换
	 * 方法：通过点击左右箭头时先判断图片的src,然后做出相应的替换
	 * 注意：在替换图片来源时，图片的名称一定要严格一致，否则会出现问题。
	 * TODO：当箭头重复点击时会出现问题，还没有找到合适的方法解决。
	 */
	var fade = (function() {
		$(".left-arrow, .right-arrow").click(function() {
				var imgpattern = /presence_2/;
				if (imgpattern.test($(".presence-img").attr("src"))) {
					$(".presence-img").fadeOut("fast")
					.attr("src", "./img/presence_1.png")
					.fadeIn("slow");
				} else {
					$(".presence-img").fadeOut("fast")
					.attr("src", "./img/presence_2.png")
					.fadeIn("slow");
				}
		});
	}());


	/* 第三部分：“我们的团队” 下拉菜单和轮播图制作
	 */
	var teamSwipe = (function() {

		var links = document.getElementsByClassName("big-team"),
			len = links.length,
		    link = null,
		    small_lists = document.getElementsByClassName("small-list"),
		    li_items = null,
		    i;

		for (i = 0; i < len; i++) {
			link = links[i];
			link.index = i;

			link.onmouseenter = function() {
				var j;
				for (j = 0; j < len; j++) {
					small_lists[j].style.display = "none";
				}
				small_lists[this.index].style.display = "block";
				this.className = "big-team big-team-selected";

				li_items = small_lists[this.index].getElementsByTagName("li");
				var	len = li_items.length,
				    k;
		        for (k = 0; k < len; k++) {
		        	(function(k) {

			        	li_items[k].onmouseenter = function() {
			        		var src = this.getElementsByTagName("img")[0].getAttribute("src"),
			        		    newSrc = src.replace(".png", "_hover.png");
			        		this.className += " selected";
			        		this.getElementsByTagName("img")[0].setAttribute("src", newSrc);
			        	}

			        	li_items[k].onmouseleave = function() {
			        		var src = this.getElementsByTagName("img")[0].getAttribute("src");
			        		var newSrc = src.replace("_hover.png", ".png");

			        		/* 当鼠标划出时，将selected替换成空字符串，因为“新媒体部”的li为special-li，
							   所以这里不能直接使用将class直接换成空字符串的形式*/
			        		this.className = this.className.replace("selected", "");
			        		this.getElementsByTagName("img")[0].setAttribute("src", newSrc);
			        	}
			        })(k);
		        }
			};

			link.onmouseleave = function() {
				this.className = "big-team";
				small_lists[this.index].style.display = "none";
			};

		}

		// “我们的团队”模块轮播图
		var currentIndex = 0;

		$(".team-right").click(function() {

			/* 如果当前图片处于不处于动画状态，就执行函数；
			   否则，为防止出现不点击还在滚动的现象不执行函数*/
			if (!$(".team-image").is(":animated")) {
				next_pic();
			}
		});

		$(".team-left").click(function() {
			if (!$(".team-image").is(":animated")) {
				prev_pic();
			}
		});

		function next_pic() {
			currentIndex++;
			if (currentIndex > 11) {
				currentIndex = 0;
			}

			// HACK：最后一张图片准确位置因为-14484，但不同设备下表现有差异
			if((parseInt($(".team-image").position().left) >= -14486) &&(parseInt($(".team-image").position().left) <= -14482)) {

				// 当图片到最后一张时，我们使图片瞬间到第一张，然后再过渡到下一张，达到无缝滑动效果
				$(".team-image").animate({left:"0"}, 0);
				$(".team-image").animate({left:"-=1207px"}, 500, lightCurrentImg);			
			} else {
				$(".team-image").animate({left:"-=1207px"}, 500, lightCurrentImg);			
			}
			showCurrentName();
		} 

		function prev_pic() {
			currentIndex--;
			if (currentIndex < 0) {
				currentIndex = 11;
			}

			// HACK：第一张图片准确位置因为-1207，但不同设备下表现有差异
			if ((parseInt($(".team-image").position().left) >= -1209)&&(parseInt($(".team-image").position().left) <= -1205)) {
				$(".team-image").animate({left:"-15691px"}, 0);			
				$(".team-image").animate({left:"+=1207px"}, 500, lightCurrentImg);			
			} else {
				$(".team-image").animate({left:"+=1207px"}, 500, lightCurrentImg);			
			}
			showCurrentName();
		} 

		// 使下面的部门名称同步更新
		function showCurrentName() {
			for(var i = 0; i < 12; i++){
				$(".image-name img").eq(i).removeClass("on");
			}
			$(".image-name img").eq(currentIndex).addClass("on");
		}
		showCurrentName();

		// 是当前图片明亮，其他图片添加black类
		function lightCurrentImg() {
			var currentImg = Math.abs(Math.round(parseInt($(".team-image").position().left)/1207)),
				i;
			for (i = 1; i < 13; i++) {
				$(".team-image div").eq(i).addClass("black");
			}
			$(".team-image div").eq(currentImg).removeClass("black");
		}
		lightCurrentImg();

		for (var i = 0; i < 12; i++) {
			(function(i) {
				$(".team-list li:not(.big-team)").eq(i).click(function() {
				var distance = currentIndex - i;
				$(".team-image").animate({left:"+="+distance*1207+"px"}, 500, lightCurrentImg);			
				currentIndex = i;
				showCurrentName();
				});
			})(i);
		}

	})();


	/* 第四部分：固定产品展示部分的外层div的宽度和高度，以使用hover后放大的效果
	 * 如果不希望此效果，可以直接注释掉，并在css中将hover后的代码删除
	 */
	var setImgWrapperSize = (function() {
		var img_wraps = document.querySelectorAll(".img-wrap");
		var img_wrap_img = document.querySelectorAll(".img-wrap img");
		for (var i = 0; i < 10; i++) {
			img_wraps[i].style.width = window.getComputedStyle(img_wrap_img[i]).width;
			img_wraps[i].style.height = window.getComputedStyle(img_wrap_img[i]).height;
		}
	})();


	// 产品展示平滑滚动
	(function ($) {
	    var scorllTo = function (scrollTop, duration) {
	        var scrollTop = scrollTop || 0;
	        var duration = duration || 500;
	        $('body').animate({scrollTop: scrollTop}, duration);
	    };
	    $('.show-product').click(function(){
	        scorllTo($('.intro-image').offset().top);
	    });
	})(jQuery);


};