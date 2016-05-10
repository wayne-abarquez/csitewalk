from . import home
from flask import render_template
from flask_login import login_required
from .forms import AddProjectForm
import logging

log = logging.getLogger(__name__)


@home.route('/', methods=['GET', 'POST'])
@home.route('/index', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('/index.html')


@home.route('/projects/add', methods=['GET'])
@login_required
def add_view():
    add_form = AddProjectForm()
    return render_template('/partials/modals/_add_project.html', form=add_form)
