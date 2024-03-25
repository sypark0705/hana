var CommonUI = {
	//commom value
	settings : {
		$header: "header",
        $nav: "nav",
		$article: "article",
		scrollTop : 0,
		isPopup : false,
		navActive: 0
	},

	enableScroll : function(_target){
		$(_target).removeClass("noscroll");
	},
	disableScroll : function(_target){
		$(_target).addClass("noscroll");
	},
	saveScrollTop : function(_target){
		CommonUI.settings.scrollTop = $(_target).scrollTop();
		//console.log(CommonUI.settings.scrollTop)
		//return CommonUI.settings.scrollTop;
	},
	moveScrollTop : function(_target){
		//console.log(CommonUI.settings.scrollTop)
		$(_target).scrollTop(CommonUI.settings.scrollTop);
		//console.log(CommonUI.settings.scrollTop)
	},
	accordion : {
		defaults : {
			header : ".card-header",
			parent : ".card-group",
			panel : ".card-panel",
			index :-1,
			active : true,
			case : 0,
			scroll: false
		},
		init : function(target, data){
			this.$this = target;
			this.option = $.extend({}, this.defaults, data);
			this.$header = $(this.$this).find(this.defaults.header);
			this.$parent = $(this.$this).find(this.defaults.parent);
			this.$panel = $(this.$this).find(this.defaults.panel);
			var that = this;

			this.$header.each(function(idx){
				$(this).attr({
					"data-index": idx,
					"data-type": that.option.case,
					"data-scroll" : true
				});
				$(this).closest(that.option.parent).find(that.option.panel).eq(0).attr({
					"data-index": idx,
					"data-type": that.option.case,
					"data-scroll" : true
				});
				$(this).closest(that.option.parent).attr({
					"data-index": idx,
					"data-type": that.option.case,
					"data-scroll" : true
				})
			});

			if(this.option.active === false){
				this.show(this.option.index);
			}else{
				this.hide(this.option.index);
			}
			var that = this;
			this.$header.off().on("click", function(e){			
				if($(this).get(0).tagName == "A") e.preventDefault();
				var _idx = $(this).data("index"),
					_case = $(this).data("type");
				if($(this).hasClass("active")){
					that.hide(_idx, _case);
				}else{
					that.show(_idx, _case);
				}
			});
			
		},
		
		show : function(_idx){
			this.option.index = _idx;
			this.option.active = false;
			this.moveType(_idx);
			if(this.option.scroll) this.moveScroll(_idx)
		},
		hide : function(_idx){
			this.option.index = _idx;
			this.option.active = true;
			this.moveType(_idx);
		},
		moveType : function(_idx){
			//console.log(_idx)
			var $parent = $(this.$this).find(this.option.parent+"[data-index='"+_idx+"']"),
				$header = $(this.$this).find(this.option.header+"[data-index='"+_idx+"']"),
				$panel = $(this.$this).find(this.option.panel+"[data-index='"+_idx+"']");

			switch(this.option.case){
				// 다중선택 slide ani 있음
				case 0 : 
					if(this.option.active==true){
						if (_idx < 0) {
							// 전체 닫기
							this.$header.removeClass("active");
							this.$panel.slideUp(300);
							
						} else {
							$header.removeClass("active");
							$panel.slideUp(300);
							
						}
						
					}else{
						if (_idx < 0) { 
							// 전체 열기
							this.$header.addClass("active");
							this.$panel.slideDown(300);
						} else {
							$header.addClass("active");
							$panel.slideDown(300);
							
						}
						
					}
				break;
				// 다중선택 slide ani 없음
				case 1 : 
					if(this.option.active==true){
						$header.removeClass("active");
						$panel.hide();
					}else{
						$header.addClass("active");
						$panel.show();
					}
				// 단일선택 slide ani 없음
				case 2 : 
					if(this.option.active==true){
						$header.removeClass("active");
						$panel.hide();
					}else{
						$parent.siblings(this.option.parent).find(this.option.header).removeClass("active");
						$parent.siblings(this.option.parent).find(this.option.panel).hide();
						$header.addClass("active");
						$panel.show();
					}
				
				break;
				
			}
			
		},
		moveScroll: function(_idx){
			// if(_idx < 0 ) _idx = 0; 전체 열기일때 scroll top index = 0으로 설정
			if(_idx < 0 ) return; // 전체열기 일때 scroll 이동 안 함
			var $parent = $(this.$this).find(this.option.parent+"[data-index='"+_idx+"']");
			var _header = $(".header").outerHeight(),
				_pdTop = _header ? _header : 0,
				_top =  $parent.offset().top - _pdTop;
			function setTop(__top){
				$("html, body").stop().animate({
					scrollTop : __top
				}, 300);
			}
			setTimeout(function(){
				setTop(_top)
			}, 300);
			
		}
	}

}

$.fn.Tabs = function(idx){
	console.log(this);
	console.log($(this))
	var _id = this[0].id,
        active = idx,
        $this= $(this),
		// fixed = $this.hasClass("fixed"),
		$nav = $this.find(".tabs-list"),
		$item = $nav.find(".tabs-item"),
        $link = $nav.find(".tabs-link"),
		$contents = $this.find(".tabs-contents"),
		$panel = $contents.find(".tabs-panel"),
		$scrolltarget = $(window);
	/*if(this.hasClass("fixed")){
		this.attr("data-height", "body");
		$nav.attr("data-height", "content");
		$contents.attr("data-height", "scroll");
		var __bodyHeight = this.closest(contBody).height();
		var __bodyMaxHeight = this.closest(contBody).css("max-height");
		
		//console.log(__bodyMaxHeight)
		if(__bodyMaxHeight > 0){
			__bodyMaxHeight = CommonUI.stringNumber(__bodyMaxHeight);
			__bodyHeight = __bodyMaxHeight;
		} 
		//console.log(__bodyHeight)
		CommonUI.autoScrollHeight.init({
			_target : this.selector,
			_bodyHeight : __bodyHeight
		})
		fixed = "fixed";

	}*/
    $nav.attr("role", "tablist");
    $item.attr("role", "presentation");    
    $link.each(function(idx){
        $(this).attr({ 
            id: `${_id}-item-${idx}`,
            role: "tab",
            "aria-controls": `${_id}-panel-${idx}`,
            "aria-selected": false,
			"data-active": idx
        });
    });
   
    $panel.each(function(idx){
        $(this).attr({ 
            id: `${_id}-panel-${idx}`,
            role: "tabpanel",
            "aria-labelledby": `${_id}-item-${idx}`,
        });
    });
   
   
	function events(idx){
		console.log("tabindex :"+ idx);
		$item.removeClass("active");
		$item.find(".blind").remove();
        $link.attr("aria-selected", false);
		$item.eq(idx).addClass("active");
        $item.eq(idx).find(".nav-link").attr("aria-selected", true);
        if($panel.length > 1) $panel.eq(idx).addClass("active").show().siblings().hide().removeClass('active');
	};
	if(CommonUI.settings.popupStr === true){
		$scrolltarget = $panel 
	}
	events(active);
   
	$link.off().on("click", function(e){
		e.preventDefault();
        var offsetTop = $this.position().top;
        // if(offsetTop > $(window).height()) $scrolltarget.scrollTop(offsetTop);
		console.log(offsetTop)
		events($(this).parent("li").index());
        $(window).scrollTop(offsetTop - $(CommonUI.settings.$nav).outerHeight());
	})
	return this;
};

// 다중선택 ani있음 scroll top 이동
$.fn.AccordionScroll = function(_idx){
	// console.log('typeof' , typeof _idx)
	if( typeof _idx === 'boolean') {
		console.log('_idx' , _idx)
		var data = {
			active : !_idx,
			index : -1,
			case: 'all'
		}
	} else {
		const idx = _idx ? _idx : -1;
		var data = {
			index: idx,
			scroll: true
		}
	}
	const acc = {...CommonUI.accordion}
	acc.init(this , data);
	return acc;
}


// 다중선택 ani없음
$.fn.Accordion =function(_idx){
	var data = {
		case : 1
	}
	const acc = {...CommonUI.accordion}
	acc.init(this, data);
	return acc;
}

// 단일선택 ani 없음
$.fn.Toggle =function(_idx){
	var data = {
		case : 2,
		header : ".toggle-target",
		parent : ".toggle-group",
		panel : ".toggle-panel",
	}
	const acc = {...CommonUI.accordion}
	acc.init(this, data);
	return acc;
}
function NavMenu(idx){   
	CommonUI.settings.navActive = idx;
    var $nav = $('nav'),
    _thisPos = $nav.find('li:nth-child('+idx+')').offset().left,
    _thisWidth = $nav.find('li:nth-child('+idx+')').outerWidth(),
    _thisRight = _thisPos + _thisWidth,
    _thisScrollX = $nav.scrollLeft();
	$nav.find('li:nth-child('+idx+')').addClass("active").siblings().removeClass("active");

   	if(idx === $nav.find('li').length) return;
    if(_thisRight > window.outerWidth){
        //console.log('move', _thisRight - window.outerWidth, _thisWidth, _thisPos)
        $nav.scrollLeft(_thisScrollX + (_thisRight - window.outerWidth));
    }else if(_thisPos < 0){
        $nav.scrollLeft(_thisScrollX + _thisPos);
    }
	$(".article").attr("tabindex", 0)

}
let checkScroll = false;
function moveContents(idx, isUp){
	

	if(isUp === 'scroll-up' ) {
		var st = $(`${CommonUI.settings.$article}:nth-child(${idx})`).offset().top - $(CommonUI.settings.$header).outerHeight();
		console.log(st, $(CommonUI.settings.$header).outerHeight())
	} else {
		var st = $(`${CommonUI.settings.$article}:nth-child(${idx})`).offset().top - $(CommonUI.settings.$nav).outerHeight();
	}
	console.log(st, $(CommonUI.settings.$header).outerHeight(), isUp)
	$(window).scrollTop(st);
	

}


let preScrollTop = 0;

function onScroll(){

	let lastScrollY = window.scrollY;

	if(checkScroll) return;
	checkScroll = true;
	let headerHeight = $(CommonUI.settings.$header).outerHeight()
	requestAnimationFrame(function(){ 
		console.log(lastScrollY);
		// header 높이 이후 발생
		if(lastScrollY > headerHeight){
			$('body').addClass("isSticky");
		}
		if(preScrollTop < lastScrollY) {
			console.log('Down!');
			$('body').removeClass("scroll-up");
			$('body').addClass("scroll-down");
			// event실행
			$(CommonUI.settings.$article).each(function(idx){
				
				var thisTop = $(this).offset().top - headerHeight;   //컨텐츠 오프셋값
	
				if(lastScrollY >= thisTop) {  //컨텐츠 오프셋값보다 스크롤바가 아래에 있으면
					//이벤트 발생 코드
					$(this).addClass('active').siblings().removeClass("active");
					NavMenu(idx + 1);
				}
			});
		}
		else { // (preScrollTop > nextScrollTop)
			console.log('Up!', CommonUI.settings.navActive);
			// if($('body').hasClass('nav-back')) {
			// 	$('body').removeClass("scroll-down");
			// } else {
			// 	$('body').removeClass("scroll-down isSticky");
			// }
			$('body').removeClass("scroll-down isSticky");
			$('body').addClass("scroll-up");
			// event실행
			$(CommonUI.settings.$article).each(function(idx){
				
				var thisTop = $(this).offset().top;   //컨텐츠 오프셋값

				var scrollBottom = lastScrollY + $(window).height() * 0.5;  //지금 스크롤바 하단좌표

				if(scrollBottom > thisTop) {  //컨텐츠 오프셋값보다 스크롤바가 아래에 있으면
					//이벤트 발생 코드
					$(this).addClass('active').siblings().removeClass("active");
					NavMenu(idx + 1);
				}
			});
		}
		preScrollTop = lastScrollY;

		checkScroll = false;
		
	});

}


$(function(){
	
	// $(window).scroll(function() {
	// 	// 스크롤 이동 시 실행되는 코드
	// 	var scrollTop = $(this).scrollTop();

	// 	$(CommonUI.settings.$article).each(function(idx){
			
	// 		var thisTop = $(this).offset().top;   //컨텐츠 오프셋값
	// 		if(scrollTop > thisTop) {  //컨텐츠 오프셋값보다 스크롤바가 아래에 있으면
	// 			//이벤트 발생 코드
	// 			$(this).addClass('active');
	// 			NavMenu(idx+1);
	// 			//console.log('down')
	// 		}else{
	// 			//이벤트 삭제 코드
	// 			$(this).removeClass('active');
	// 			//console.log('up')
	// 		};
	// 	});
	// });

	

  });

document.addEventListener('scroll', onScroll, {
	passive: true,
})