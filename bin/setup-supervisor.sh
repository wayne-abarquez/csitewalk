#!/usr/bin/env bash

sudo rm /etc/supervisor/conf.d/csitewalk.conf
sudo cp conf/supervisord.conf /etc/supervisor/conf.d/csitewalk.conf
sudo supervisorctl reread
sudo supervisorctl update
