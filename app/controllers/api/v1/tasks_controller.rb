module Api::V1
  class TasksController < ::TasksController
    include Pagable

    private
      def query_params
        params.permit(:importance, :urgency, :duration)
      end
  end
end