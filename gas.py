from machine import Pin, ADC
import time
adc = ADC(Pin(26))
button = Pin(14, Pin.IN, Pin.PULL_DOWN)
while True:
	val = adc.read_u16()
	print("Value: ", val)
	time.sleep(0.5)