from . import admin
from flask import render_template
from flask_login import login_required
from app.decorators.check_role import *
import logging

log = logging.getLogger(__name__)


#  TODO: uncomment decorators below when deploy
@admin.route('/admin', methods=['GET'])
# @login_required
# @admin_only
def admin():
    return render_template('/admin.html')
