class MessagesController < ApplicationController
  def index
    # Get all messages
    @messages = Message.all

    # Return messages
    render json: @messages
  end

  def create
    # Recieve body from request
    body = request.body.read

    # Parse body as JSON
    body_json = JSON.parse(body)

    # Create new message
    @message = Message.new(body_json)

    # Save message
    @message.save

    # Return message
    render json: @message
  end

end
