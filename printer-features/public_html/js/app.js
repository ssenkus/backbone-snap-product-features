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
            this.render()

        },
        events: {
            'click circle': 'animateView'
        },
        createIcon: function(a,b,c,d) {
            console.log(this)
            var canvas = Snap('svg');
            var diamondCircle = canvas.circle(35, 80, 15).attr({
                fill: '#ffffff',
                stroke: '#fc6315',
                strokeWidth: 1
            });
            var diamond = canvas.polygon([a, b,c,d]).attr({
                fill: '#fc6315'
            });
        },
        animateView: function(e) {
            var target = $(e.currentTarget).data('feature-id');
            this.descriptionView.featureId = target;
            
            

            this.descriptionView.render()
        },
        render: function() {

            var template = _.template(this.template, {
            });
            this.$el.html(template);
            this.createIcon('35,70','45,80', '35,90', '25,80');
            //this.createIcon('25,10','45,80', '35,90', '25,80');
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

    /* Render views */
    var printerDetailView = new PrinterDetailView({
        el: $('#printerDetailView'),
        model: new Printer()
    });

    function runAnimation(startcoords) {
        
        
        var canvas = Snap('svg');
        var path = canvas.path('M' + startcoords.x + ',' + startcoords.y + ' L150 280 150 50 450 50').attr(lineAttr),
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
            console.log(value);
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
                console.log(value);
            }, 400, mina.ease, function() {
                path.remove();
                tri.remove();
            });
        } else {
            runAnimation({x: 0,
                y: 0});
        }
    });


});