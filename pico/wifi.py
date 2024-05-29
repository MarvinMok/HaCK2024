from machine import Pin
import network
import time
from time import sleep
import ssl
from simple import MQTTClient
import machine

class sslWrap:
    def __init__(self):
        self.wrap_socket = ssl.wrap_socket

def connectMQTT(ip):
    client  = MQTTClient(
        client_id=b"ISwearToFuckingGod",
        server="378861656db74bd1becac997eb01cb13.s1.eu.hivemq.cloud",
        port=8883,
        user="picow",
        password="Raspberry1",
        keepalive=3000, 
        ssl=sslWrap()     
    )
    client.connect()
    return client

def connectInternet(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip



ssid = 'IEEE'
password = 'Ilovesolder'
ip = connectInternet(ssid, password)

client = connectMQTT(ip)

def publish(topic, value):
    print(topic, ", ", value)
    client.publish(topic, value)
    print("done") 
try:
    publish(b"test1", b"hello world")
    sleep(2)
finally:
    client.disconnect()
