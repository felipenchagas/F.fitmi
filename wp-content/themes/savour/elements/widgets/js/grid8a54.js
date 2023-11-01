( function( $ ) {
    $.sep_grid_refresh = function (){
        $('.pxl-grid-masonry').each(function () {

            var iso_settings = {
                itemSelector: '.pxl-grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer',
                },
                containerStyle: null,
                stagger: 30,
                sortBy : 'name',
            };
            if( $(this).closest('.pxl-grid').find('.pxl-shop-toolbars select.orderby').length > 0 ){
                iso_settings['getSortData'] = {
                    name: '.sort-name',
                    popularity: '.sort-popularity parseInt',
                    rating: '.sort-rating parseFloat',
                    date: '.sort-date',
                    price: '.sort-price parseFloat',
                    price_desc: '.sort-price parseFloat',
                };
                iso_settings['sortAscending'] = {
                    name: true,
                    popularity: false,
                    rating: false,
                    date: false,
                    price: true,
                    price_desc: false
                };
            }
            var iso = new Isotope(this, iso_settings);

            var filtersElem = $(this).parent().find('.pxl-grid-filter');
            filtersElem.on('click', function (event) {
                var filterValue = event.target.getAttribute('data-filter');
                iso.arrange({filter: filterValue});
            });

            var filterItem = $(this).parent().find('.filter-item');
            filterItem.on('click', function (e) {
                filterItem.removeClass('active');
                $(this).addClass('active');
            });

            var filtersSelect = $(this).parent().find('.pxl-grid-filter');
            filtersSelect.change(function() {
                var filters = $(this).val();
                iso.arrange({filter: filters});
            });

            var orderSelect = $(this).parent().find('.pxl-grid-filter');
            orderSelect.change(function() {
                var e_order = $(this).val();
                if(e_order == 'asc') {
                    iso.arrange({sortAscending: false});
                }
                if(e_order == 'des') {
                    iso.arrange({sortAscending: true});
                }
            });
 
            $('.filter-product-cat').on( 'change', function(e) {
                var filterValue = $( this ).val();  
                var filter_value = (filterValue != '*') ? '.'+filterValue : filterValue;
                iso.arrange({filter: filter_value});
            });

            $('.pxl-shop-toolbars select.orderby').on( 'change', function(e) {
                e.preventDefault();
                var sortValue = $( this ).val(); 
                iso.arrange({sortBy: sortValue}); 
            });
  
            $('.pxl-service-grid1').each(function () {
                $(this).find('.pxl-grid-item-inner').hover(function () {
                    $(this).parents('.elementor-element').find('.pxl-grid-item-inner').removeClass('active');
                    $(this).addClass('active');
                });
            });

        });
    }
    
    
    var widget_post_masonry_handler = function( $scope, $ ) {
        $('.pxl-grid-masonry').imagesLoaded(function(){
            $.sep_grid_refresh($scope);
        });
    };

    $(document).ajaxComplete(function(event, xhr, settings){  
        "use strict";
        $(document).on('click', '.pxl-grid-filter .filter-item', function (e) {
            $(this).siblings('.filter-item').removeClass('active');
            $(this).addClass('active');
        });
    });

    $(document).on('click', '.pxl-load-more', function(){
        var loadmore    = $(this).data('loadmore');
        var perpage     = loadmore.perpage;
        var _this       = $(this).parents(".pxl-grid");
        var layout_type = _this.data('layout');
        var loading_text = $(this).data('loading-text');
        var loadmore_text = $(this).data('loadmore-text');  
        loadmore.paged  = parseInt(_this.data('start-page')) +1;
        $(this).addClass('loading');
        $(this).find('.pxl-btn-icon').addClass('loading');
        $(this).find('.pxl-btn-text').text(loading_text);

        if(loadmore.filter == 'true'){
            $.ajax({
                url: main_data.ajax_url,
                type: 'POST',
                beforeSend: function () {

                },
                data: {
                    action: 'savour_get_filter_html',
                    settings: loadmore,
                    loadmore_filter: 1
                }
            }).done(function (res) { 
                if(res.status == true){
                    _this.find(".pxl-grid-filter .pxl--filter-inner").html(res.data.html); 
                }
                else if(res.status == false){
                }
            }).fail(function (res) {
                return false;
            }).always(function () {
                return false;
            });
        }

        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function () {

            },
            data: {
                action: 'savour_load_more_post_grid',
                settings: loadmore
            }
        })
        .done(function (res) {   
            if(res.status == true) {
                _this.find('.pxl-load-more').removeClass('loading');
                _this.find('.pxl-grid-inner').append(res.data.html);
                _this.data('start-page', res.data.paged);
                $.sep_grid_refresh();
                if(res.data.paged >= res.data.max){
                    _this.find('.pxl-load-more').hide();
                }
                
                $('.pxl-item--inner').each(function () {
                    var item_w = $(this).outerWidth();
                    var item_h = $(this).outerHeight();
                    $(this).find('.pxl-item--imgfilter').css('width', item_w + 'px');
                    $(this).find('.pxl-item--imgfilter').css('height', item_h + 'px');
                });

            } 

        })
        .fail(function (res) {
            _this.find('.btn').hide();
            return false;
        })
        .always(function () {
            return false;
        });
    });

    $(document).on('click', '.pxl-grid-pagination .ajax a.page-numbers', function(){
        var _this = $(this).parents(".pxl-grid");
        var loadmore = _this.find(".pxl-grid-pagination").data('loadmore');
        var query_vars = _this.find(".pxl-grid-pagination").data('query');

        var layout_type = _this.data('layout');
        var paged = $(this).attr('href');
        paged = paged.replace('#', '');
        loadmore.paged = parseInt(paged);
        query_vars.paged = parseInt(paged); 

        var _class = loadmore.pagin_align_cls;

        $('html,body').animate({scrollTop: _this.offset().top - 100}, 750);

        // reload filter
        if(loadmore.filter == 'true'){
            $.ajax({
                url: main_data.ajax_url,
                type: 'POST',
                beforeSend: function () {

                },
                data: {
                    action: 'savour_get_filter_html',
                    settings: loadmore
                }
            }).done(function (res) { 
                if(res.status == true){
                    _this.find(".pxl-grid-filter .pxl--filter-inner").html(res.data.html);
                     
                }
                else if(res.status == false){
                }
            }).fail(function (res) {
                return false;
            }).always(function () {
                return false;
            });
        }

        // reload pagination
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function () {

            },
            data: {
                action: 'savour_get_pagination_html',
                query_vars: query_vars,
                cls: _class 
            }
        }).done(function (res) {
            if(res.status == true){
                _this.find(".pxl-grid-pagination").html(res.data.html);
            }
            else if(res.status == false){
            }
        }).fail(function (res) {
            return false;
        }).always(function () {
            return false;
        });

        // load post
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function () {

            },
            data: {
                action: 'savour_load_more_post_grid',
                settings: loadmore
            }
        }).done(function (res) {
            if(res.status == true){
                _this.find('.pxl-grid-inner .pxl-grid-item').remove();
                _this.find('.pxl-grid-inner').append(res.data.html);
                _this.data('start-page', res.data.paged);
                if(layout_type == 'masonry'){  
                    $.sep_grid_refresh();
                }
                $('.pxl-item--inner').each(function () {
                    var item_w = $(this).outerWidth();
                    var item_h = $(this).outerHeight();
                    $(this).find('.pxl-item--imgfilter').css('width', item_w + 'px');
                    $(this).find('.pxl-item--imgfilter').css('height', item_h + 'px');
                });
 
            }
            else if(res.status == false){
            }
        }).fail(function (res) {
            return false;
        }).always(function () {
            return false;
        });
 
        return false;
    });
    
    

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_post_grid.default', widget_post_masonry_handler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_gallery_grid.default', widget_post_masonry_handler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_testimonial_grid.default', widget_post_masonry_handler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_team_grid.default', widget_post_masonry_handler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_showcase_grid.default', widget_post_masonry_handler );
    } );
} )( jQuery );