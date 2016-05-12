from . import home
from flask import render_template
from flask_login import login_required
from .forms import AddProjectForm, EditProjectForm
from .dynamic_form import SectionGroup
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


@home.route('/projects/edit', methods=['GET'])
@login_required
def detail_view():
    # TODO: Set file names in config so it's easy to add more tabs later
    _gen_info = SectionGroup.load_from_file('project_general_info')
    _files = SectionGroup.load_from_file('project_files')

    params = dict(
        project_form=EditProjectForm(),
        gen_info=_gen_info,
        files=_files
    )

    return render_template('/partials/modals/_view_project.html', form=params)

