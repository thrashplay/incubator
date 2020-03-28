#!/usr/bin/env sh

certbot --redirect --nginx \
  -d dashboard.the-pegasus.net \
  -d gots.the-pegasus.net \
  -d www.dashboard.the-pegasus.net \
  -d www.gots.the-pegasus.net
  
tail -f /dev/null