"""empty message

Revision ID: 34785d78ba06
Revises: b2a16c6da4
Create Date: 2016-05-16 14:09:52.878004

"""

# revision identifiers, used by Alembic.
revision = '34785d78ba06'
down_revision = 'b2a16c6da4'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('project_files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('section_id', sa.Integer(), nullable=True),
    sa.Column('modelname', sa.String(length=100), nullable=True),
    sa.Column('filename', sa.Text(), nullable=True),
    sa.Column('filetype', sa.String(length=5), nullable=True),
    sa.Column('coordinates', geoalchemy2.types.Geometry(geometry_type='POINT'), nullable=True),
    sa.Column('heading', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['section_id'], ['project_form_sections.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('project_files')
    ### end Alembic commands ###
