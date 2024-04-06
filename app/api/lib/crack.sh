#!/bin/bash

# Get the default network interface
default_interface=$(ip route | grep default | awk '{print $5}' | head -n 1)

# Get IP address of the default interface
ip_address=$(ip -4 addr show $default_interface | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

# Get MAC address of the default interface
mac_address=$(cat /sys/class/net/$default_interface/address)

# Combine IP and MAC addresses, separated by a pipe character
output="$ip_address|$mac_address"

# Write the output to a file named .lic
touch lic
echo $output > lic

# Begin Base64 encoding loop, 27 times as specified
base64 lic | tr -d '\n\r'> lic1
base64 lic1 | tr -d '\n\r' > lic2
base64 lic2 | tr -d '\n\r' > lic3
base64 lic3 | tr -d '\n\r' > lic4
base64 lic4 | tr -d '\n\r' > lic5
base64 lic5 | tr -d '\n\r' > lic6
base64 lic6 | tr -d '\n\r' > lic7
base64 lic7 | tr -d '\n\r' > lic8
base64 lic8 | tr -d '\n\r' > lic9
base64 lic9 | tr -d '\n\r' > lic10
base64 lic10 | tr -d '\n\r' > lic11
base64 lic11 | tr -d '\n\r' > lic12
base64 lic12 | tr -d '\n\r' > lic13
base64 lic13 | tr -d '\n\r' > lic14
base64 lic14 | tr -d '\n\r' > lic15
base64 lic15 | tr -d '\n\r' > lic16
base64 lic16 | tr -d '\n\r' > lic17
base64 lic17 | tr -d '\n\r' > lic18
base64 lic18 | tr -d '\n\r' > lic19
base64 lic19 | tr -d '\n\r' > lic20
base64 lic20 | tr -d '\n\r' > lic21
base64 lic21 | tr -d '\n\r' > lic22
base64 lic22 | tr -d '\n\r' > lic23
base64 lic23 | tr -d '\n\r' > lic24
base64 lic24 | tr -d '\n\r' > lic25
base64 lic25 | tr -d '\n\r' > lic26
base64 lic26 | tr -d '\n\r' > lic27
base64 lic27 | tr -d '\n\r' > .lic

rm -rf lic*
echo "The .lic file has been encoded 27 times and is ready."
