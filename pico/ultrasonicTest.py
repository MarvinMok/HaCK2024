from hcsr04 import HCSR04
from time import sleep
import machine

# ESP32
sensor = HCSR04(trigger_pin=16, echo_pin=15, echo_timeout_us=10000)

# ESP8266
#sensor = HCSR04(trigger_pin=12, echo_pin=14, echo_timeout_us=10000)
try:
    while True:
        distance = sensor.distance_cm()
        print('Distance:', distance, 'cm')
        sleep(1)
finally:
    machine.reset()