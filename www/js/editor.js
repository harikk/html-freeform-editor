$.fn.editor = function (options) {
    var _self = this;
    var effect = "fast";
    
    _self.css({
        "-webkit-user-select": "none",
        "-moz-user-select": "none", 
        "-ms-user-select": "none",     
        "user-select": "none"
    });

    _self.click(function () {
        $(this).find("[contenteditable]").removeAttr("contenteditable");
        $(this).find(".ui-resizable-handle").hide(effect);
        $(this).find(".ui-resizable-border").removeClass("ui-resizable-border");
        $(this).find('.ui-rotatable-handle').hide(effect);
    }); 
    
    _self.addText = function (text) {
        var el = $("<div class='canvasObj'><span>" + (text || "Sample Text")+ "</span></div>");
        this.append(el);
        prepateElement(el, false, false, undefined, el.find("span"));
    };

    _self.addImage = function (src, x, y) {
        var droppedImage = new Image();
        droppedImage.onload = function () {
            var el = $("<div class='canvasObj' style='left: " + x + ";top: " + y + ";display:inline-block; width: " + this.width + "px; height: " + this.height + "px'> </div>");
            _self.append(el);
            el.append(droppedImage);
            prepateElement(el, true, true);
        };
        droppedImage.src = src;
    };

    this.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        if (!$(e.target).hasClass("canvasObj") && !$(e.target).hasClass("ui-draggable-dragging")) {
            e.preventDefault();
            e.stopPropagation();
        }
    }).on('drop', function (e) {
        var droppedFiles = e.originalEvent.dataTransfer.files;
        var thisPos = $(this).position();
        var cord = {x: e.originalEvent.x - thisPos.left, y: e.originalEvent.y - thisPos.top};
        for (var i = 0; i < droppedFiles.length; i++) {
            _self.addImage(URL.createObjectURL(droppedFiles[i]), cord.x, cord.y);
        }
    });

    function selectElementContents(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function prepateElement(el, noEdit, aspectRatio, handles, draggableHandle) {
        el.resizable({
            containment: "parent",
            alsoResize: el.find("img"),
            handles: handles || 'ne, se, sw, nw',
            aspectRatio: aspectRatio
        }).rotatable({
            handle: $(document.createElement('img')).attr('src', 'img/alternate_rotate.png').addClass("ui-rotatable-handle"),
            wheelRotate: false
        }).draggable({
            containment: "parent",
            start: function () {
                _self.click();
                $(this).addClass("ui-resizable-border");
            },
            stop: function () {
                $(this).find(".ui-resizable-handle").show(effect);
                $(this).find(".ui-rotatable-handle").show(effect);
            },
            handle: draggableHandle
        }).click(function (e) {
            e.stopPropagation();
            var attr = $(this).find("span").attr('contentEditable');
            _self.click();
            $(this).find(".ui-resizable-handle").show(effect);
            $(this).find(".ui-rotatable-handle").show(effect);
            $(this).addClass("ui-resizable-border");
            if (!noEdit) {
                $(this).find("span").attr("contentEditable", '');
                $(this).draggable('disable');
                $(this).find("span")[0].focus();
                if (typeof attr === typeof undefined) {
                    selectElementContents($(this).find("span")[0]);
                }
                $(this).find("span").blur(function () {
                    if (!noEdit) {
                        $(el).draggable('enable');
                        $(this).removeAttr("contentEditable");
                    }
                });
            }
        }).find(".ui-resizable-handle, .ui-rotatable-handle").hide(effect);
    }
};