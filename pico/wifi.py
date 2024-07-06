from machine import Pin
import network
import time
from time import sleep
import ssl
from simple import MQTTClient
import machine

try:
    from constants import *
except:
    WIFI_USER = ""
    WIFI_PWD = ""
    MQTT_SERVER = ""
    MQTT_USER = ""
    MQTT_PWD = ""
    print("no constants")


class sslWrap:
    def __init__(self):
        self.wrap_socket = ssl.wrap_socket

def connectMQTT():
    client  = MQTTClient(
        client_id=b"marvin",
        server=MQTT_SERVER,
        port=8883,
        user=MQTT_USER,
        password=MQTT_PWD,
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
        print(wlan.status(), network.STAT_CONNECTING, network.STAT_CONNECT_FAIL, network.STAT_WRONG_PASSWORD, network.STAT_NO_AP_FOUND)
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip


ssid = WIFI_USER
password = WIFI_PWD
ip = connectInternet(ssid, password)

client = connectMQTT()

def publish(topic, value):
    print(topic, ", ", value)
    client.publish(topic, value) 

def cb(topic, msg):
    print(topic, ", ", msg)

def subscribe(topic):
    client.subscribe(topic)

#currently publishes hello world to the MQTT server,
#then subscribes to test
try:
    publish(b"test1", b"hello world")
    sleep(2)
    client.set_callback(cb)
 
    while True: 
        sleep(0.5)
        subscribe("direction")
    #    publish(b"test1", b"hello world")
finally:
    client.disconnect()
    machine.reset()

