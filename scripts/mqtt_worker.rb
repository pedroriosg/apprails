require 'mqtt'
require 'httparty'

# Connect to broker

client = MQTT::Client.connect(
    :host => 'broker.legit.capital',
    :port => 9000,
    :username => 'students',
    :password => 'iic2173-2023-2-students'
)


client.subscribe('stocks/info')

client.get do |topic,message|
    # Block is executed for every message received
    puts "#{topic}: #{message}"
    puts 'hola'

    data_final = 'el_mensaje'

    # Hacer un post a la api
    response = HTTParty.post('http://localhost:3000/messages', body: data_final)
    puts response.body, response.code, response.message, response.headers.inspect

  end

client.disconnect()
