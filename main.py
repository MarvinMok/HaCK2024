import network
import socket
from time import sleep
import machine
from machine import Pin, PWM

# Yes, these could be in another file. But on the Pico! So no more secure. :)
ssid = ''
password = ''

# Define pins to pin motors!
Mot_A_Forward = PWM(Pin(18, Pin.OUT))
Mot_A_Back = PWM(Pin(19, Pin.OUT))
Mot_B_Forward = PWM(Pin(20, Pin.OUT))
Mot_B_Back = PWM(Pin(21, Pin.OUT))

led = Pin('LED', Pin.OUT)
FREQ = 1000
SPEED = 40000 #0 to 2^16 -1

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


#Stop the robot as soon as possible
move_stop()
    
def connect():
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip
    
def open_socket(ip):
    # Open a socket
    address = (ip, 80)
    connection = socket.socket()
    connection.bind(address)
    connection.listen(1)
    return connection

def webpage():
    #Template HTML
    html = f"""
            <!DOCTYPE html>
            <html>
            <head>
            <title>Zumo Robot Control</title>
            </head>
            <center><b>
            <form action="./forward">
            <input type="submit" value="Forward" style="height:120px; width:120px" />
            </form>
            <table><tr>
            <td><form action="./left">
            <input type="submit" value="Left" style="height:120px; width:120px" />
            </form></td>
            <td><form action="./stop">
            <input type="submit" value="Stop" style="height:120px; width:120px" />
            </form></td>
            <td><form action="./right">
            <input type="submit" value="Right" style="height:120px; width:120px" />
            </form></td>
            </tr></table>
            <form action="./back">
            <input type="submit" value="Back" style="height:120px; width:120px" />
            </form>
            </body>
            </html>
            """
    return str(html)

def serve(connection):
    #Start web server
    while True:
        client = connection.accept()[0]
        request = client.recv(1024)
        request = str(request)
        try:
            request = request.split()[1]
        except IndexError:
            pass
        if request == '/forward?':
            move_forward()
        elif request =='/left?':
            move_left()
        elif request =='/stop?':
            move_stop()
        elif request =='/right?':
            move_right()
        elif request =='/back?':
            move_backward()
        html = webpage()
        client.send(html)
        client.close()

def motor_setup():
    Mot_A_Forward.freq(FREQ)
    Mot_A_Back.freq(FREQ)
    Mot_B_Forward.freq(FREQ)
    Mot_B_Back.freq(FREQ)


try:
    led.value(1)
    motor_setup()
    ip = connect()
    connection = open_socket(ip)
    serve(connection)
    
    # while True:  
    #     move_forward()
    #     sleep(1)
    #     move_stop()
    #     sleep(1)
    #     move_backward()
    #     sleep(1)
    #     move_stop()
    #     sleep(1)
    #     move_right()
    #     sleep(0.5)
    #     move_left()
    #     sleep(0.5)
    #     move_stop()
    #     sleep(1)
        

finally:
    move_stop()
    led.value(0)

    
