/*
 author : panqiang
 desc : Btn-head-1.0.js
 data : 2014/7/14
 dependon : Btn-head-1.0.js
 verson : 1.0
 */
(function ($) {
    function _btn_head(here, options, index, callback) {
        var _this = this;
        _this.$e = $(here);
        _this.opts = options;
        _this.index = index;
        _this.callback = callback
        _this.init();
        return this;
    }
    _btn_head.prototype = {
        init: function () {
            var _this = this;
            var $btn;
            if (_this.index == 0) {
                $btn = $(" <input type='button' class='btn btn-head' data-id='" + _this.opts.id + "' value='" + _this.opts.value + "' />");
            } else {
                $btn = $(" <input type='button' class='btn btn-head btn-gray' data-id='" + _this.opts.id + "' value='" + _this.opts.value + "' />");
            }
            $btn.click(function () {
                $(".btn-head").addClass("btn-gray");
                $(this).removeClass("btn-gray");
                var dataid = $(this).attr("data-id");
                var value = $(this).val();
                _this.callback(dataid, value);
            });
            _this.$e.append($btn);
        }
    }
    $.fn.btn_head = function (options) {
        $(this).empty();
        for (var i = 0; i < options.data.length; i++) {
            var opts = $.extend({}, $.fn.btn_head.defaults, options.data[i]);
            new _btn_head(this, opts, i, options.callback);
        }
        return this.btn_head.manger;
    }
    $.fn.btn_head.defaults = {
        id: 'id',
        value: 'value'
    }
})(jQuery);
