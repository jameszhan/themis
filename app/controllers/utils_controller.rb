class UtilsController < ApplicationController
  def markdown
    renderer = Markdown::Render::HTML.new(hard_wrap: true, filter_html: true)
    options = {
        autolink: true,
        no_intra_emphasis: true,
        fenced_code_blocks: true,
        lax_html_blocks: true,
        strikethrough: true,
        superscript: true
    }
    @content = Redcarpet::Markdown.new(renderer, options).render(params[:content]).html_safe
    render 'shared/_markdown', layout: false
  end
end