"""empty message

Revision ID: b2a16c6da4
Revises: 26e44b608598
Create Date: 2016-05-11 18:41:44.617104

"""

# revision identifiers, used by Alembic.
revision = 'b2a16c6da4'
down_revision = '26e44b608598'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('projects', sa.Column('utility', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('projects', 'utility')
    ### end Alembic commands ###