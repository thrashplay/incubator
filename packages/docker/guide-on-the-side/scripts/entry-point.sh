#!/usr/bin/env sh

# copy template to runtime location
cp /var/www/html/config.yml.tmpl /var/www/html/config.yml

# update our config file with secrets, if a secret file is specified
if [ ! -z $CONFIG_SECRETS_FILE ]; then
  awk 1 $CONFIG_SECRETS_FILE | while IFS== read -r name value
  do
    sed -i "s/\${$name}/$value/g" /var/www/html/config.yml
  done
fi

# tighten these up eventually
chmod -R 777 /var/www/html/app/tmp
chmod -R 777 /var/www/html/app/webroot/uploads

# run the base guide on the side app
apache2-foreground