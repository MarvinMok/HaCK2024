from machine import Pin
import time, machine


try:
    led = Pin(15, Pin.OUT)
    button = Pin(14, Pin.IN, Pin.PULL_DOWN)
    while True:
        if button.value():
            led.toggle()
            time.sleep(0.5)
finally:
    machine.reset()