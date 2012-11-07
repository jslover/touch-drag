﻿/**
* @Class
* @description 触屏版拖动组件，支持多示例，支持X\Y轴限制，支持范围限制
* @author http://jslover.com
* @version 1.0  2012.10.30
*/
(function ($) {
    //是否调试
    var isDebug = false;
    //几个手势动作
    var isTouch = 'ontouchstart' in document;
    var touchStart = isTouch?'touchstart':'mousedown';
    var touchMove = isTouch?'touchmove':'mousemove';
    var touchEnd = isTouch?'touchend':'mouseup';
    //注册JQ方法
    $.fn.touchDrag = function(opts){
         //合并参数
        var opts = $.extend({}, defualts, opts);
        var _t = this;
        _t.touchDrag = [];
        _t.each(function(i,item){
            var t = new TouchDrag(item,opts);
            _t.touchDrag.push(t);
        });        
        return _t;
    };
    //当前拖动对象（每次只拖动一个对象）
    var $currDrag = null;
    var $currDragbar = null;
    var $doc = $(document);
    var currPosition = {
        x0: 0
        ,y0:0
        ,touchX0:0
        ,touchY0:0
    };
    var currObject = null;
    //构造函数
    var TouchDrag = function (obj,opts) {
        var _this = this;
        //当前被拖物
        _this.$this = $(obj);
        //拖动的激活区域
        _this.$dragbar = opts.dragbar=='' ?_this.$this :_this.$this.find(opts.dragbar);
        _this.winW = $(window).width();
        _this.winH = $(window).height();
        _this.minTop = opts.minTop||0;
        _this.minLeft = opts.minLeft||0;
        _this.maxLeft = opts.maxLeft||_this.winW;
        _this.maxTop = opts.maxTop||_this.winH;
        _this.dragX = !!opts.dragX;
        _this.dragY = !!opts.dragY;
        //初始化
        _this.init();
    };
    //方法
    var fn = {
        init: function () {
            var _this = this;
            _this.initDragEvent();
        }      
        //注册拖动事件
        ,initDragEvent : function(){
            var _this = this;
            console.log(_this.$dragbar)
            if('addEventListener' in document){
                _this.$dragbar[0].addEventListener(touchStart,function(e){
                    handerTouchStart(e,_this);
                });
            }else{
                 _this.$dragbar.bind(touchStart,function(e){
                    handerTouchStart(e,_this);
                });
            }
        }
    };
    //点击开始 
    var handerTouchStart = function(e,_this){
        e.preventDefault();
        log('start');
        $currDrag = _this.$this;
        $currDragbar = _this.$dragbar;
        currObject = _this;
        if (isTouch && !e.touches.length) { return; }
        var touch = isTouch ? e.touches[0] : e;
             
        //当前手指位置
        currPosition.touchX0 = touch.pageX;
        currPosition.touchY0 = touch.pageY;
       
        //当前拖动对象位置
        currPosition.x0 =  parseInt($currDrag.css('left')||0);
        currPosition.y0 = parseInt($currDrag .css('top')||0);
        if(isNaN(currPosition.x0)){
            currPosition.x0 = 0;
        }
        if(isNaN(currPosition.y0)){
            currPosition.y0 = 0;
        }
        if('addEventListener' in document){
            //注册拖动事件
            document.addEventListener(touchMove,handerTouchMove,false)
            document.addEventListener(touchEnd,handerTouchEnd,false);    
        }else{
            $(document).bind(touchMove,handerTouchMove).bind(touchEnd,handerTouchEnd);
        }     
    };
    //移动 
    var handerTouchMove = function(e){
        e.preventDefault();
        log('move');
        if (isTouch && !e.touches.length) { return; }
        var touch = isTouch ? e.touches[0] : e;
        //新位置样式
        var css = {};
        if(currObject.dragX){
            css.left = currPosition.x0 + touch.pageX - currPosition.touchX0;
            css.left = css.left<currObject.minLeft?currObject.minLeft:(css.left>currObject.maxLeft?currObject.maxLeft:css.left);
        }
        if(currObject.dragY){
            css.top = currPosition.y0 + touch.pageY - currPosition.touchY0;            
            css.top = css.top<currObject.minTop?currObject.minTop:(css.top>currObject.maxTop?currObject.maxTop:css.top);
        }
        if(currObject.dragX||currObject.dragY){
            $currDrag.css(css);
        }        
    };
    //结束 
    var handerTouchEnd = function(e){
        e.preventDefault();
        log('end');
        currObject = null;
        $currDrag = null;
        $currDragbar = null;
        //注销拖动事件
        if('removeEventListener' in document){
            document.removeEventListener(touchMove, handerTouchMove, false);        
            document.removeEventListener(touchEnd, handerTouchEnd, false);
        }else{
            $(document).unbind(touchMove, handerTouchMove).unbind(touchEnd, handerTouchEnd);
        }
    };

    TouchDrag.prototype = fn;
    //html模板
    var Html = {       
    };
 
    //工具类
    var Tools = {
    };
      
    //默认配置
    var defualts = {  
        dragbar:''
        //支持X轴、Y轴移动 
        ,dragX:true
        ,dragY:true
        //最小位置、最大位置
        ,minLeft:-1999
        ,minTop:-1999
        ,maxLeft:1999
        ,maxTop:1999            
    };
    //日记调试
    var $loger;
    function log(e){
        if(isDebug){
           $loger && $loger.html(e);
        }        
    }
    if(isDebug){
        $(document).ready(function(){
            $loger = $('<div style="color:#fff;position:absolute;top:0;right:0;width:100px;z-index:99999;background:#000;padding:5px;">log</div>').appendTo($('body'));
        });
        window.onerror = function(e){
            log(e);
        };
   }
})(jQuery);