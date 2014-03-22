$(document).ready(function() {


    /*************************** Models ******************************************/

    // EVENTUALLY, this should be a collection
    var Printer = Backbone.Model.extend({
        defaults: {
            name: 'DuraLabel 9000 (PS)',
            features: [{
                    id: 0,
                    title: 'Large Labels',
                    description: 'From 4” – 9” width, print signs and large labels at any length. Bold 300 dpi HD print resolution means you can go ahead and print that billboard. '
                }, {
                    id: 1,
                    title: 'Harsh Environments',
                    description: 'Tough tested vinyl supply will withstand the most extreme outdoor environments on the planet. From -300⁰F to 300⁰F degrees, chemical exposures, to wet, dirty or oily surfaces—your signs and labels will hold up. '

                }, {
                    id: 2,
                    title: 'Go Network Free with the PS',
                    description: 'Use the 10” touchscreen, seated in an ergonomically adjustable bracket on the PS model for a standalone workstation. Network independence allows you to print on demand from the plant to the warehouse.'
                }]
        }
    });


    /***************************** Views *****************************************/

    /* PrinterDetailView
     * 
     * 
     *  - a container view containing three separate sections:
     *      1. an SVG Overlay - all SVG animations happen here
     *      2. a product image - the printer
     *      3. a text-box (DescriptionView) - the feature
     * 
     *  - basically, an animated SVG image map
     *  
     * */

    var PrinterDetailView = Backbone.View.extend({
        template: $("#printerDetailViewTemplate").html(),
        initialize: function(options) {
            this.model = options.model;
            this.canvas = Snap('svg');
            this.descriptionView = new DescriptionView({
                el: $('#descriptionView'),
                model: this.model,
                featureId: 0
            });
            this.render();
        },
        events: {
            'click circle': 'animateView',
            'click polygon': 'runAnimation'
        },
        // create diamond-circle icons
        createIcon: function(center) {
            // coordinates for diamond shape
            var polyCoords = [
                (center.x + ',' + (center.y - 10)),
                ((center.x + 10) + ',' + (center.y)),
                (center.x + ',' + (center.y + 10)),
                ((center.x - 10) + ',' + (center.y))
            ];

            // base circle
            this.svg.circle(center.x, center.y, 15).attr({
                fill: '#ffffff',
                stroke: '#fc6315',
                strokeWidth: 1,
                'data-feature-id': center.id
            });

            // diamond shape
            this.svg.polygon(polyCoords).attr({
                fill: '#fc6315',
                'data-feature-id': center.id
            });

        },
        animateView: function(e) {
            // re-render with a different feature object
            var target = $(e.currentTarget).data('feature-id');
            this.descriptionView.featureId = target;
            this.descriptionView.render();
        },
        runAnimation: function(coords) {
            var startcoords = {x: 50,
                y: 50};
            console.log(startcoords)
            path = this.svg.path('M' + startcoords.x + ',' + startcoords.y + ' L150 280 150 50 450 50').attr(lineAttr),
                len = path.getTotalLength(),
                circle = this.svg.circle(350, 87.5, 7).attr({
                fill: '#fc6315'
            }),
            tri = this.svg.g(circle);

            path.attr({
                fill: 'none',
                "stroke-dasharray": len + " " + len,
                "stroke-dashoffset": len
            }).animate({
                "stroke-dashoffset": 0
            },
            400, mina.ease);
            Snap.animate(0, len, function(value) {
                var movePoint = path.getPointAtLength(value);
                tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

            }, 400, mina.ease);
        },
        render: function() {

            var template = _.template(this.template);
            this.$el.html(template);
            this.svg = Snap('svg');
            this.createIcon({x: 35,
                y: 80,
                id: 0});
            this.createIcon({x: 55,
                y: 130,
                id: 1});
            this.createIcon({x: 155,
                y: 30,
                id: 2});

        }
    });

    /* DescriptionView
     * 
     * - the view containing the title and description of the printer feature
     * 
     * */

    var DescriptionView = Backbone.View.extend({
        template: $('#descriptionViewTemplate').html(),
        initialize: function(options) {
            _.extend(this, options);
            this.render();
        },
        render: function() {
            var templateData = this.model.get('features');
            var template = _.template(this.template, {
                text: templateData[this.featureId]
            });
            this.$el.hide().html(template).fadeIn(500);
        }
    });

    /********************* START PROGRAM *****************************/

    // svg stuff
    var canvas = Snap('svg');
    var path;
    var lineAttr = {
        fill: 'none',
        stroke: '#fc6315',
        strokeWidth: 5,
        strokeLinecap: 'round',
        strikeLinejoin: 'round'
    };


    var app = {};

    /* Render views */
    app.printerDetailView = new PrinterDetailView({
        el: $('#printerDetailView'),
        model: new Printer()
    });

    function runAnimation(startcoords) {
        var canvas = Snap('svg');
        path = canvas.path('M' + startcoords.x + ',' + startcoords.y + ' L' + (startcoords.x + 50) + ' ' + (startcoords.y + 0) + ' ' + (startcoords.x + 50) + ' ' +  (startcoords.y + 50) + ' ' + (startcoords.x + 250) + ' ' + (startcoords.y + 50)).attr(lineAttr),
            len = path.getTotalLength(),
            circle = canvas.circle(350, 87.5, 7).attr({
            fill: '#fc6315'
        }),
        tri = canvas.g(circle);

        path.attr({
            fill: 'none',
            "stroke-dasharray": len + " " + len,
            "stroke-dashoffset": len
        }).animate({
            "stroke-dashoffset": 0
        },
        400, mina.ease);
        Snap.animate(0, len, function(value) {
            var movePoint = path.getPointAtLength(value);
            tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

        }, 400, mina.ease);
    }

    $('#item1').on('click', function() {

        if ($('path').length > 0) {
            path.attr({
                fill: 'none',
                "stroke-dasharray": len + " " + len,
                "stroke-dashoffset": 0
            }).animate({
                "stroke-dashoffset": len
            },
            400, mina.ease);
            Snap.animate(len, 0, function(value) {
                var movePoint = path.getPointAtLength(value);
                tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

            }, 400, mina.ease, function() {
                path.remove();
                tri.remove();
            });
        } else {
            runAnimation({x: 20,
                y: 20});
        }
    });


});