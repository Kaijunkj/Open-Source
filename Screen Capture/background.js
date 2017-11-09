var screenshot = {
    content: document.createElement("canvas"),
    data : '',

    init : function() {
        this.initEvents();
    },

    saveScreenshot : function() {
        var image = new Image();
        image.onload = function() {
            var canvas = screenshot.content;
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);

            //save image
            var link = document.createElement('a');
            link.download = "image.png";
            link.href = screenshot.content.toDataURL();
            link.click();
            screenshot.data = '';
        };
        image.src = screenshot.data;
    },

    initEvents : function() {
        firefox.browserAction.onClicked.addListener(function(tab){
            firefox.tabs.captureVisibleTab(null, {
                format: "png",
                quality: 100
            }, function(data){
                screenshot.data = data;

                //send an alert message to webpage
                firefox.tabs.query({
                    
                    active : true,
                    currentWindow : true
                    
                }, function(tabs) {
                    firefox.tabs.sendMessage(tabs[0].id, {ready : "ready"}, function(response) {
                
                        if (response.download === "download") {
                            screenshot.saveScreenshot();
                        }
                        else {
                            screenshot.data = '';
                        }
                    });
                });
            });
        });
    }
};

screenshot.init();




