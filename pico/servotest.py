from servo import Servo
from machine import Pin, ADC
import time

sg90_servo = Servo(pin=16)  #To be changed according to the pin used
adc = ADC(Pin(26))
deg = 0
sg90_servo.move(0)
time.sleep(0.5)
while True:
    temp = adc.read_u16() * 180 // 65535
    #print(temp, adc.read_u16() * 180)
    if temp != deg:        
        deg = temp
        sg90_servo.move(deg)  # turns the servo to 0°.
    time.sleep(0.1)