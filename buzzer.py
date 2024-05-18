from machine import Pin, PWM, ADC
import time, machine

try:
    pwm = PWM(Pin(15))
    adc = ADC(Pin(26))
    pwm.duty_u16(32000)
    while True:
        freq = adc.read_u16()
        freq = freq * 2000 // 65025
        pwm.freq(freq)

        print(freq)
        time.sleep(0.1)
finally:
    machine.reset()