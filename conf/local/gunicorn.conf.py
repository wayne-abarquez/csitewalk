bind = '127.0.0.1:8002'
accesslog = '/var/www/csitewalk/logs/gunicorn-access.log'
errorlog = '/var/www/csitewalk/logs/gunicorn-error.log'
limit_request_line = 0
workers = 2
preload = True
timeout = 120
