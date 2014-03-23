$(document).ready(function() {


    /*************************** Models ******************************************/

    // EVENTUALLY, this should be a collection
    var Printer = Backbone.Model.extend({
        defaults: {
            name: 'DuraLabel 9000 (PS)',
            features: [{
                    id: 0,
                    title: 'Large Labels',
                    description: 'From 4” – 9” width, print signs and large labels at any length. Bold 300 dpi HD print resolution means you can go ahead and print that billboard. ',
                    icon: {
                        x: 25,
                        y: 30
                    }
                }, {
                    id: 1,
                    title: 'Harsh Environments',
                    description: 'Tough tested vinyl supply will withstand the most extreme outdoor environments on the planet. From -300⁰F to 300⁰F degrees, chemical exposures, to wet, dirty or oily surfaces—your signs and labels will hold up. ',
                    icon: {
                        x: 125,
                        y: 90
                    }                    

                }, {
                    id: 2,
                    title: 'Go Network Free with the PS',
                    description: 'Use the 10” touchscreen, seated in an ergonomically adjustable bracket on the PS model for a standalone workstation. Network independence allows you to print on demand from the plant to the warehouse.',
                    icon: {
                        x: 25,
                        y: 100
                    }                    
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
        render: function() {
            var that = this;
            var template = _.template(this.template);
            this.$el.html(template);
            this.svg = Snap('svg');
/*            this.createIcon({x: 35,
                y: 80,
                id: 0});
            this.createIcon({x: 55,
                y: 130,
                id: 1});
            this.createIcon({x: 155,
                y: 30,
                id: 2});
            this.createIcon({x: 25,
                y: 30,
                id: 2});
  */          
            console.log(this.model.get('features'))
            _.each(this.model.get('features'), function(feature) {
                    that.createIcon(feature)
        });

        },
        events: {
            //   'click circle': 'animateView',
            //  'click polygon': 'runAnimation'
        },
        // create diamond-circle icons
        createIcon: function(feature) {
            var that = this;
            console.log(this)
            // coordinates for diamond shape
            var polyCoords = [
                (feature.icon.x + ',' + (feature.icon.y - 10)),
                ((feature.icon.x + 10) + ',' + (feature.icon.y)),
                (feature.icon.x + ',' + (feature.icon.y + 10)),
                ((feature.icon.x - 10) + ',' + (feature.icon.y))
            ];

            // base circle
            var x = this.svg.circle(feature.icon.x, feature.icon.y, 15).attr({
                fill: '#ffffff',
                stroke: '#fc6315',
                strokeWidth: 1
            });

            // diamond shape
            var y = this.svg.polygon(polyCoords).attr({
                fill: '#fc6315'
            });
            var circleDiamond = this.svg.g(x, y).attr({
                'data-feature-id': feature.id

            });
            circleDiamond.click(function() {
                $.when(that.runAnimation(feature.icon)).then(function() {
                    that.animateView(circleDiamond.attr('data-feature-id'))
                });
            });
        },
        animateView: function(featureId) {

            // re-render with a different feature object
            //var target = $(e.currentTarget).data('feature-id');
            var target = featureId;
            console.log(target)
            this.descriptionView.featureId = target;
            this.descriptionView.render();
        },
        runAnimation: function(coords) {
        
            // this is a kludge fix, do better next time!
            $('path').next().add('path').fadeOut(200).remove();
            
            
            // using a deferred object to coordinate animation sequence/view rendering
            var def = new $.Deferred();
            var lineAttr = {
                fill: 'none',
                stroke: '#fc6315',
                strokeWidth: 5,
                strokeLinecap: 'round',
                strikeLinejoin: 'round'
            };


            // a simple grid function for path values
            function grid(input, multiplier) {
                return input + (gridUnit * multiplier);
            }

            var x = coords.x;
            var y = coords.y;
            var gridUnit = 4;
            var pathData = 'M' + grid(x, 0) + ',' + grid(y, 0) + ' L' + grid(x, 5) + ' ' + grid(y, 0) + ' ' + grid(x, 5) + ' ' + grid(y, 5) + ' ' + 250 + ' ' + grid(y, 5)
            console.log(pathData);
            var path = this.svg.path(pathData).attr(lineAttr),
                len = path.getTotalLength(),
                circle = this.svg.circle(350, 87.5, 7).attr({
                fill: '#000'
            }),
            tri = this.svg.g(circle);

            path.attr({
                fill: 'none',
                "stroke-dasharray": len + " " + len,
                "stroke-dashoffset": len
            }).animate({
                "stroke-dashoffset": 0
            },
            200, mina.ease);
            Snap.animate(0, len, function(value) {
                var movePoint = path.getPointAtLength(value);
                tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

            }, 200, mina.ease, function() {
                def.resolve();

            });
            return def.promise();
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

    var app = {};

    /* Render views */
    app.printerDetailView = new PrinterDetailView({
        el: $('#printerDetailView'),
        model: new Printer()
    });



    /*  Refactor this code to use in the PrinterDetailView, mostly just the path retraction */
    function runAnimation(startcoords) {
        var lineAttr = {
            fill: 'none',
            stroke: '#fc6315',
            strokeWidth: 5,
            strokeLinecap: 'round',
            strikeLinejoin: 'round'
        };
        var canvas = Snap('svg');
        var path = canvas.path('M' + startcoords.x + ',' + startcoords.y + ' L' + (startcoords.x + 50) + ' ' + (startcoords.y + 0) + ' ' + (startcoords.x + 50) + ' ' + (startcoords.y + 50) + ' ' + (startcoords.x + 250) + ' ' + (startcoords.y + 50)).attr(lineAttr),
            len = path.getTotalLength(),
            circle = canvas.circle(350, 87.5, 7).attr({
            fill: '#000'
        }),
        tri = canvas.g(circle);

        path.attr({
            fill: 'none',
            "stroke-dasharray": len + " " + len,
            "stroke-dashoffset": len,
            'data-vis': true
        }).animate({
            "stroke-dashoffset": 0
        },
        400, mina.easeinout);
        Snap.animate(0, len, function(value) {
            var movePoint = path.getPointAtLength(value);
            tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

        }, 400, mina.easeinout, function() {
            path.attr({'data-vis': false})
        });
    }

    $('#item1').on('click', function() {

        var len = 10;
        console.log($('path').attr('vis'))
        if ($('path').attr('data-vis') == true) {
            path.attr({
                fill: 'none',
                "stroke-dasharray": len + " " + len,
                "stroke-dashoffset": 0
            }).animate({
                "stroke-dashoffset": len
            },
            1400, mina.easeinout);
            Snap.animate(len, 0, function(value) {
                var movePoint = path.getPointAtLength(value);
                tri.transform('t' + parseInt(movePoint.x - 350.4, 10) + ',' + parseInt(movePoint.y - 87, 10) + 'r ' + parseInt(195 + movePoint.alpha, 10));

            }, 1400, mina.easein, function() {
                path.remove();
                tri.remove();
            });
        } else {
            runAnimation({x: 0,
                y: 0});
        }
    });


});