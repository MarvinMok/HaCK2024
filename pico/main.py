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

sensor = HCSR04(trigger_pin=16, echo_pin=17, echo_timeout_us=10000)

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

# ARM CONTROL

PWM_MIN = 800
PWM_MAX = 2400

MIN = PWM_MIN*10**3
MAX = PWM_MAX*10**3
MID = 1500000

pwm = PWM(Pin(15))

pwm.freq(50)


# Arm control function
def move_arm(pwm_value):
    print('move called with value:', pwm_value)
    if pwm_value >= PWM_MIN and pwm_value <= PWM_MAX:
        pwm.duty_ns(pwm_value*10**3)

try:
    from constants import WIFI_USER, WIFI_PWD, MQTT_PASS, MQTT_SERVER, MQTT_USER
except:
    WIFI_USER="IEEE"
    WIFI_PWD="Ilovesolder"
    MQTT_SERVER="b336487b99734211867870bc957c5a4f.s1.eu.hivemq.cloud"
    MQTT_USER="abcde"
    MQTT_PWD="12345Qaz"
    print("no constants")


class sslWrap:
    def __init__(self):
        self.wrap_socket = ssl.wrap_socket

def connectMQTT():

    client  = MQTTClient(
        client_id=b"pico",
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
       # print(wlan.status(), network.STAT_CONNECTING, network.STAT_CONNECT_FAIL, network.STAT_WRONG_PASSWORD, network.STAT_NO_AP_FOUND)
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
        move_arm(int(msg))

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
        cur_time = time.ticks_ms()
        if time.ticks_diff(cur_time, last_time) > 1000:
            distance = sensor.distance_cm()
            print(f"Ultrasonic Distance: {distance} cm")  # Debug print for sensor data
            client.publish(b"ultrasonic", str(distance).encode('utf-8'))
            last_time = cur_time
        client.check_msg()
        sleep(0.01)
        # client.publish(b"ultrasonic", b"hello world")
finally:
    # client.disconnect()
    move_stop()
    led.value(0)
    # machine.reset()

    
