from machine import Pin,PWM
import utime

PWM_MIN = 900
PWM_MAX = 2400


MIN = PWM_MIN*10**3
MAX = PWM_MAX*10**3
MID = 1500000

led = Pin(25,Pin.OUT)
pwm = PWM(Pin(15))

pwm.freq(50)
pwm.duty_ns(MID)

while True:
    pwm.duty_ns(MIN)
    utime.sleep(1)
    pwm.duty_ns(MAX)
    utime.sleep(1)
