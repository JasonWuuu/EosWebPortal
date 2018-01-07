/*
 author : zhupinglei_zjnb@163.com
 desc : popUp.js
 data : 2012/7/19
 dependon : jquery-1.7.js
 verson : 3.0
 */
 (function($){
     function _popUp(here,options,index){
         var _this = this;
         _this.$e = $(here);
         _this.opts = options;
         _this.index = index;
         _this.init();
     }
     _popUp.prototype = {
         init : function(){
             var _this = this;
             //弹出框代码
             var code = '<div id="popup_mask"></div>'+
                         '<div id="popup">' +
                             '<h3 class="popup_title"><span>'+_this.opts.title+'</span><i class="closeBtn" title="关闭">X</i></h3>' +
                             '<div class="popup_con">'+_this.opts.content+'</div>' +
                             '<div class="btncontain"><span class="btn submitBtn">确定</span><span class="btn closeBtn">取消</span></div>' +
                         '</div>';
             $('body').append(code);
             if($.browser.msie && ($.browser.version == 6.0)){
                 $('#popup_mask').css({'height':$(window).height() + 'px'});
             }
             $('#popup').css({
                 'width' : _this.opts.width+'px',
                 'height' : _this.opts.height+'px'
             });
             _this.position();
             $(window).resize(function(){
                 _this.position();
             });
             _this.event();
         },
         event : function(){
             var _this = this;
             $('#popup').on('click','.submitBtn',function(){
                 _this.closePopup();
                 _this.opts.callback();
             });
             $('#popup').on('click','.closeBtn',function(){
                 _this.closePopup();
             });
         },
         position : function(){
             var showLeft = ( $(window).width() - $('#popup').width() )/2 + 'px',
                 showHeight = ( $(window).height() - $('#popup').height() )/2 - 20 + 'px';
             $('#popup').css({
                 'left' : showLeft,
                 'top' : showHeight
             });
         },
         closePopup : function(){
             $('#popup_mask').remove();
             $('#popup').remove();
         }
     }
     $.fn.popUp = function(options){
         var opts = $.extend({},$.fn.popUp.defaults,options);
         return this.each(function(index){
             this.popUp = new _popUp(this,opts,index);
         });
     }
     $.alert = function(width,title,content){
         var code = '<div id="popup_mask"></div>'+
                     '<div id="popup">' +
                         '<h3 class="popup_title">'+title+'</h3>' +
                         '<div class="popup_con">'+content+'</div>' +
                         '<div class="btncontain"><span class="btn submitBtn">确定</span></div>' +
                     '</div>';
         $('body').append(code);
         if($.browser.msie && ($.browser.version == 6.0)){
             $('#popup_mask').css({'height':$(window).height() + 'px'});
         }
         $('#popup').css({'width' : width});
         function position(){
              var showLeft = ( $(window).width() - $('#popup').width() )/2 + 'px',
                 showHeight = ( $(window).height() - $('#popup').height() )/2 - 20 + 'px';
             $('#popup').css({
                 'left' : showLeft,
                 'top' : showHeight
             });
         }
         position();
         $(window).resize(function(){
             position();
         });
        
         $('#popup').on('click','.submitBtn',function(){
             $('#popup_mask').remove();
             $('#popup').remove();
         });
     }
     $.fn.popUp.defaults = {
         width : 200,
         height : 150,
         title : '标题',
         content : '<a href="#1">内容</a>',
         callback : function(){}
     }
 })(jQuery);