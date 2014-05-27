// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
// require jquery_ujs
//= require angular
// require angular-animate
//= require angular-resource
//= require bootstrap
//= require moment
// require jquery.ui.all

//= require angular-ui/ui-bootstrap-tpls
// require_tree .

String.format = function(formatter){
    var _args = [].slice.apply(arguments, [1]);
    return formatter.replace(/\{(\d+)\}/g, function(match, g1, position, str){
        return (_args[g1] || match);
    });
};

jQuery(document).ready(function($){
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': $("meta[name='csrf-token']").attr("content")}
    });

    $(document)
        .on("click", "a[data-post-url][data-target]", function(e){
            var _self = $(this);
            $.post(_self.data('post-url'), {content: _self.data('post-body')})
                .done(function(data){
                    $(_self.data('target')).find('.modal-content').html(data);
                });
        });
});


