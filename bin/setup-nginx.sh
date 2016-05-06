#!/usr/bin/env bash

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/csitewalk
sudo rm /etc/nginx/sites-enabled/csitewalk
sudo cp conf/nginx.conf /etc/nginx/sites-available/csitewalk
sudo ln -s /etc/nginx/sites-available/csitewalk /etc/nginx/sites-enabled/csitewalk
sudo /etc/init.d/nginx reload
