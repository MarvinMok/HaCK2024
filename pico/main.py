import network
import time
from time import sleep
import machine
from machine import Pin, PWM
import ssl
from simple import MQTTClient
from hcsr04 import HCSR04



# Yes, these could be in another file. But on the Pico! So no more secure. :)

# Define pins to pin motors!
Mot_A_Forward = PWM(Pin(18, Pin.OUT))
Mot_A_Back = PWM(Pin(19, Pin.OUT))
Mot_B_Forward = PWM(Pin(20, Pin.OUT))
Mot_B_Back = PWM(Pin(21, Pin.OUT))

sensor = HCSR04(trigger_pin=16, echo_pin=15, echo_timeout_us=10000)

led = Pin('LED', Pin.OUT)
FREQ = 1000
SPEED = 65500 #0 to 2^16 -1

def move_forward():
    Mot_A_Forward.duty_u16(SPEED)
    Mot_B_Forward.duty_u16(SPEED)
    Mot_A_Back.duty_u16(0)
    Mot_B_Back.duty_u16(0)

    
def move_backward():
    Mot_A_Forward.duty_u16(0)
    Mot_B_Forward.duty_u16(0)
    Mot_A_Back.duty_u16(SPEED)
    Mot_B_Back.duty_u16(SPEED)


def move_stop():
    Mot_A_Forward.duty_u16(0)
    Mot_B_Forward.duty_u16(0)
    Mot_A_Back.duty_u16(0)
    Mot_B_Back.duty_u16(0)


def move_left():
    Mot_A_Forward.duty_u16(SPEED)
    Mot_B_Forward.duty_u16(0)
    Mot_A_Back.duty_u16(0)
    Mot_B_Back.duty_u16(SPEED)


def move_right():
    Mot_A_Forward.duty_u16(0)
    Mot_B_Forward.duty_u16(SPEED)
    Mot_A_Back.duty_u16(SPEED)
    Mot_B_Back.duty_u16(0)

def motor_setup():
    Mot_A_Forward.freq(FREQ)
    Mot_A_Back.freq(FREQ)
    Mot_B_Forward.freq(FREQ)
    Mot_B_Back.freq(FREQ)

#Stop the robot as soon as possible    

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
    print("connected to MQTT")
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

def cb(topic, msg):
    if msg == b"forward":
        print("moving forwards")
        move_forward()
    elif msg == b"backward": 
        move_backward()
    elif msg == b"left":
        move_left()
    elif msg == b"right": #right
        move_right()
    elif msg == b"stop":
        move_stop()
    print(topic, ", ", msg)

# try:
#     motor_setup()
#     led.value(1)
#     while True:
#         move_stop()
#         sleep(1)
#         move_forward()
#         sleep(1)
#         move_backward()
#         sleep(1)
#         move_left()
#         sleep(1)
#         move_right()
#         sleep(1)
# finally:
#     move_stop()
#     led.value(0)
#     #machine.reset()

try:
    led.value(1)
    ssid = WIFI_USER
    password = WIFI_PWD
    move_stop()
    connectInternet(ssid, password)
    client = connectMQTT()
    client.set_callback(cb)
    last_time = time.ticks_ms()
    while True: 
        cur_time = time.ticks_ms()
        if (time.ticks_diff(cur_time, last_time) > 1000):
            client.publish(b"ultrasonic", str(sensor.distance_cm()).encode('utf-8'))
            last_time = cur_time
        client.subscribe("direction")
        sleep(0.001)
        #client.publish(b"test1", b"hello world")
finally:
    client.disconnect()
    move_stop()
    led.value(0)
    machine.reset()

    
    