#!/usr/bin/env python3


import socket
import network
import ssl
from time import sleep
# import libclient

ssid = 'UCLA_WEB'
password = ''

def connect():
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if password:
        wlan.connect(ssid, password)
    else:
        wlan.connect(ssid)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip

def create_request(action, value):
    if action == "search":
        return dict(
            type="text/json",
            encoding="utf-8",
            content=dict(action=action, value=value),
        )
    else:
        string = action + value
        return dict(
            type="binary/custom-client-binary-type",
            encoding="binary",
            content=bytes(string, "utf-8"),
        )


# def start_connection(host, port, request):
#     addr = (host, port)
#     print(f"Starting connection to {addr}")
#     sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#     sock.setblocking(False)
#     sock.connect_ex((host,port))
#     events = selectors.EVENT_READ | selectors.EVENT_WRITE
#     message = libclient.Message(sel, sock, addr, request)
#     sel.register(sock, events, data=message)


# host = "378861656db74bd1becac997eb01cb13.s1.eu.hivemq.cloud"  # The server's hostname or IP address
# port = 8883
# action = "topic1"   # action, value
# value = "morpheus"
# request = create_request(action, value)
# start_connection(host, port, request)


def create_request(action, value):
    # Example request creation, modify as needed
    return f"{action} {value}"

def start_connection(host, port, request):
    addr = (host, port)
    print(f"Starting connection to {addr}")
    
    # Create a socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Set timeout for the socket
    sock.settimeout(10)
    
    try:
        # Connect to the server
        sock.connect(addr)
    except socket.error as e:
        print(f"Error connecting to {addr}: {e}")
        return
    
    # Wrap socket with SSL
    context = ssl.create_default_context()
    try:
        sock = context.wrap_socket(sock, server_hostname=host)
    except ssl.SSLError as e:
        print(f"SSL error: {e}")
        return
    
    print("Connection established!")
    
    # Send the request
    try:
        sock.sendall(request.encode())
        print("Request sent successfully!")
    except socket.error as e:
        print(f"Error sending request: {e}")
    finally:
        sock.close()

# Connection parameters
host = "378861656db74bd1becac997eb01cb13.s1.eu.hivemq.cloud"
port = 8883
action = "topic1"
value = "morpheus"
request = create_request(action, value)

# Start connection
start_connection(host, port, request)




try:
    while True:
        events = sel.select(timeout=1)
        for key, mask in events:
            message = key.data
            try:
                message.process_events(mask)
            except Exception:
                print("ERR")
                message.close()
        # Check for a socket being monitored to continue.
        if not sel.get_map():
            break
except KeyboardInterrupt:
    print("Caught keyboard interrupt, exiting")
finally:
    sel.close()
