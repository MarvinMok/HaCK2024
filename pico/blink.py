from machine import Pin
from time import sleep
import machine

led = Pin('LED', Pin.OUT)
print('Blinking LED Example')
try:
    while True:
        led.value(not led.value())
        sleep(0.5)
finally:
    led.value(0)