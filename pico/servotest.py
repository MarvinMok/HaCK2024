from servo import Servo
from machine import Pin, ADC
import machine
import time

s1 = Servo(pin=16)  #To be changed according to the pin used
s2 = Servo(pin=17)
adc = ADC(Pin(26))
d1 = d2 = 0
s1.move(0)
s2.move(0)
time.sleep(0.5)
try:
    while True:
        temp = adc.read_u16() * 180 // 65535
        print(temp)
        if temp != d1:        
            d1 = temp
            s1.move(d1)  # turns the servo to 0°.
            s2.move(d1)
        time.sleep(0.5)
finally:
    pass
    machine.reset()