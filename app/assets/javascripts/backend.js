//= require jquery
//= require jquery_ujs
//= require angular
//= require bootstrap

$(document).ready(function(){
    $(document)
        .on('click', 'a[data-preview]', function(e){
            var self = $(this),
                target = $(self.data('target'));
            target.find(".modal-title").text(self.data('title'));
            if (self.data('preview')) {
                target.find('.modal-body > iframe').attr('src', self.data('preview'));
            }
            target.on('click', '.open-file', function(e){
                $.post('open', {path: self.data('uri'), mime: self.data('mime')});
            });
            e.preventDefault();
        })
        .find('[data-toggle=popover]').popover('hide');
});