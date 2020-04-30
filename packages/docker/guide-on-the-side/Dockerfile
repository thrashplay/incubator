FROM arm32v7/php:5.6.40-apache

# add needed extensions
ADD https://raw.githubusercontent.com/mlocati/docker-php-extension-installer/master/install-php-extensions /usr/local/bin/
RUN chmod uga+x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions gd pdo_mysql tidy

# enable needed apache modules
RUN ln -s /etc/apache2/mods-available/rewrite.load  /etc/apache2/mods-enabled/rewrite.load

# guide on the side installation
RUN apt-get update && apt-get install unzip && \
    cd /tmp && \
    rmdir /var/www/html && \
    curl -L -O https://github.com/ualibraries/Guide-on-the-Side/releases/download/1.0-beta4/guide_on_the_side-1.0-beta4.zip && \
    unzip guide_on_the_side-1.0-beta4.zip && \
    mv guide_on_the_side /var/www/html && \
    rm guide_on_the_side-1.0-beta4.zip && \
    cd /var/www/html

# setup our entrypoint
COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]
