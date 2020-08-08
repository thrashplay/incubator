# Pegasus Cluster Bootstrap Instructions

## Prepare the SD Card
After burning the Raspian image, the following files must be added to the `/boot` partition: 

* `/boot/ssh`: the contents of this are irrelevant, it simply has to exist
* `/boot/pegasus/bootstrap`: this file can be found in the `scripts` folder
* `/boot/pegasus/finish-setup`: this file can be found in the `scripts` folder
* `/boot/pegasus/config`: this is the configuration file described in the next section

To configure the bootstrap process for the new cluster node, you must create a `/boot/pegasus/config` file on the SD card after it is burned. This file is a shell environment file, consisting of `NAME=VALUE` pairs, one per line. All of the following values are required:

* `ADMIN_ACCOUNT_NAME`: name of the administrator account to create
* `ADMIN_ACCOUNT_PASSWORD`: password to use when creating the admin account
* `ADMIN_PUBLIC_KEY`: public key to use when authenticating SSH connections for the admin account (contents of an id_rsa.pub file)
* `HOSTNAME`: the hostname to use for this cluster node

In addition to the required files above, you may enable WiFi connectivity by adding a `wpa_supplicant.conf` file as described [in the Rasbperry Pi documentation](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md).

## Bootstrap the Cluster Node

1. Find the new node's IP address, following [these instructions](https://www.raspberrypi.org/documentation/remote-access/ip-address.md).
2. Run the `bootstrap` script on the pi: `ssh -l pi raspberrypi.local 'bash /boot/pegasus/bootstrap'`
