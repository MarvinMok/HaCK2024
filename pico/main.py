import network
import time
from time import sleep
import machine
from machine import Pin, PWM
import utime
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

# Arm control function
def move(value):
    print('move called with value:', value)
    pwm.duty_ns(value)

try:
    from constants import WIFI_USER, WIFI_PWD, MQTT_PASS, MQTT_SERVER, MQTT_USER
except:
    WIFI_USER="IEEE"
    WIFI_PWD="Ilovesolder"
    MQTT_SERVER="378861656db74bd1becac997eb01cb13.s1.eu.hivemq.cloud"
    MQTT_USER="picow"
    MQTT_PWD="Raspberry1"
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
    print("Callback triggered")
    print(f"Topic: {topic}, Message: {msg}")
    if topic == b"direction":
        if msg == b"forward":
            print("Moving forwards")
            move_forward()
        elif msg == b"backward":
            print("Moving backwards")
            move_backward()
        elif msg == b"left":
            print("Moving left")
            move_left()
        elif msg == b"right":
            print("Moving right")
            move_right()
        elif msg == b"stop":
            print("Stopping")
            move_stop()
    elif topic == b"arm":
        print("Moving arm")
        # move(int(msg))

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
    client.subscribe(b"direction")
    client.subscribe(b"arm")
    last_time = time.ticks_ms()
    while True: 
        # cur_time = time.ticks_ms()
        # if (time.ticks_diff(cur_time, last_time) > 1000):
        #     client.publish(b"ultrasonic", str(sensor.distance_cm()).encode('utf-8'))
        #     last_time = cur_time
        client.check_msg()
        sleep(0.1)
        #client.publish(b"test1", b"hello world")
finally:
    # client.disconnect()
    move_stop()
    led.value(0)
    machine.reset()

    
    