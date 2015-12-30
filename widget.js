// ChiliPeppr Widget/Element Javascript
/*global requirejs cprequire cpdefine chilipeppr THREE ko*/

requirejs.config({
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-pickandplace"], function(myWidget) {

    console.log("test running of " + myWidget.id);

    $('#com-chilipeppr-widget-pickandplace').css('position', 'relative');
    $('#com-chilipeppr-widget-pickandplace').css('background', 'none');
    $('#com-chilipeppr-widget-pickandplace').css('width', '300px');
    $('body').prepend('<div id="test-3dviewer"></div>');

    chilipeppr.load("#test-3dviewer", "http://fiddle.jshell.net/chilipeppr/y3HRF/show/light/", function (ew) {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            //$('#com-chilipeppr-widget-3dviewer .panel-heading').addClass('hidden');
            //autolevel.addRegionTo3d();
            //autolevel.loadFileFromLocalStorageKey('com-chilipeppr-widget-autolevel-recent8');
            //autolevel.toggleShowMatrix();

            // only init eagle widget once 3d is loaded
            // set doMyOwnDragDrop
            ew.init(true);
        });
    });

    $('#test-eagle-import').css('position', 'relative');
    $('#test-eagle-import').css('background', 'none');
    $('#test-eagle-import').css('width', '300px');
    chilipeppr.load("#test-eagle-import", "http://jsfiddle.net/xpix/qmt3e0sm/show/light/",
    function () {
        cprequire(
        ["inline:com-chilipeppr-widget-eagle"],

        function (imp) {
            imp.init();
        });
    });


    chilipeppr.load("#test-drag-drop", "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-elem-dragdrop"],

        function (dd) {
            dd.init();
            dd.bind("body", null);
        });
    });
    
    chilipeppr.load("#com-chilipeppr-flash",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",

    function () {
        console.log("mycallback got called after loading flash msg module");
        cprequire(["inline:com-chilipeppr-elem-flashmsg"], function (fm) {
            //console.log("inside require of " + fm.id);
            fm.init();
        });
    });


    // init my widget
    myWidget.init();
    $('#com-chilipeppr-widget-pickandplace').css('padding', '10px;');

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-pickandplace", ["chilipeppr_ready" /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-pickandplace", // Make the id the same as the cpdefine id
        name: "Widget / Pick&Place", // The descriptive name of your widget.
        desc: "This widget it's a part of eagle import and can place components on your milled PCB.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself

        /**
         * PICK AND PLACE VARIABLES.
         */
        pnpholders: {
            'PNP Holder V0.1': 'pnp_holder_v0.1'
        },
        // this define the trays, this will later load via ajax 
        // for every tray holder but for the first time we define here the structure
        holderCoordinates: {
            trays: {
                // Trays are numbered and pockets has letters
                // x and y coordinates are realtive to zero point of PNP Holder
                tray_1: { name: 'Tray Nr. 1',   width: 8, x: -106, y: 90 },
                tray_2: { name: 'Tray Nr. 2',   width: 8, x: -96,  y: 90 },
                tray_3: { name: 'Tray Nr. 3',   width: 8, x: -86,  y: 90 },
                tray_4: { name: 'Tray Nr. 4',   width: 8, x: -76,  y: 90 },
                tray_5: { name: 'Tray Nr. 5',   width: 8, x: -66,  y: 90 },
                tray_6: { name: 'Tray Nr. 6',   width: 12, x: -56, y: 90 },
                tray_7: { name: 'Tray Nr. 7',   width: 12, x: -42, y: 90 }
            },
            pockets: {
                Pocket_A: { name: 'Pocket A',   width: 15, x: -23, y: 71 },
                Pocket_B: { name: 'Pocket B',   width: 15, x: -23, y: 52 },
                // ... etc.pp,
            },
        },
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            // '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
            '/com-chilipeppr-widget-eagle/beforeRender':    'Remove PNP Holder in 3d space.',
            '/com-chilipeppr-widget-eagle/afterRender':     'Render PNP Holder in 3d space to inform user which tray are busy.',
            '/com-chilipeppr-widget-eagle/addGcode':        'Produce gcode and add this to main gcode buffer.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();
            //this.btnSetup();
            //this.forkSetup();

            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/beforeRender", this, this.onBeforeRender);
            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/afterRender", this, this.onAfterRender);
            chilipeppr.subscribe("/com-chilipeppr-widget-eagle/addGcode", this, this.onAddGcode);


            console.log("Module this object: ", this);
        },
        onBeforeRender : function(that){
            console.log("Get onBeforeRender:", that);
            /* remove all old drops
            this.renderedDrops.forEach(function(thing) {
                that.sceneRemove(thing);
            }, this);
            */
        },
        onAfterRender : function(that){
            console.log("Get onAfterRender:", that);
            // this.renderDispenserDrops(that);
        },
        onAddGcode : function(that){
            console.log("Get onAddGcode:", that);
            //that.addGcode(this.gcodeOrderNumber , this.exportGcodeDispenser(that) );
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

        

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });
        },
        /** 
         * empty and fill select box 
        */
        selectbox: function(id, hash, outcallback){
            $(id).find('option').remove().end();
            $.each(hash, function(key, value) {
                $(id).append(
                    $('<option></option>').val(key).html(( outcallback ? outcallback(value) : key))
                );
            });
        },
        /** 
         * empty and fill table 
        */
        table: function(id, array){
            $(id + " > tbody").html("");
            $.each(array, function(idx, entry) {
                var content = '<tr>';
                $.each(entry, function(idx, value) {
                    content += '<td>' + value + '</td>';  
                });
                content += '</tr>';
                $(id + ' tr:last').after(content);        
            });
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // init ui 
            this.selectbox('#pnpholders', this.pnpholders);
            this.table('#pnp-component-list', [
                [ 3, 'R220', 'R0805', 'R54.8', 'R1, R2','<select id="trays_R220" class="pnp-select" />' ],
                [ 1, 'R470', 'R0805', 'R90', 'R4, R5',  '<select id="trays_R470" class="pnp-select" />' ],
                [ 1, 'C470', 'C0805', 'R0',  'C1',      '<select id="trays_C470" class="pnp-select" />' ],
            ]);
            var output = function(entry){ return entry.name + ' (' + entry.width + 'mm)' };
            this.selectbox('#trays_R220', this.holderCoordinates['trays'], output );
            this.selectbox('#trays_R470', this.holderCoordinates['trays'], output );
            this.selectbox('#trays_C470', this.holderCoordinates['pockets'], output );

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});