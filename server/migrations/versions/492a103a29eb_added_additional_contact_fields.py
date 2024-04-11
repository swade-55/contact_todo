"""added additional contact fields

Revision ID: 492a103a29eb
Revises: 0b3d6b55b530
Create Date: 2024-04-10 13:32:10.170100

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '492a103a29eb'
down_revision = '0b3d6b55b530'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.add_column(sa.Column('job_title', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('email', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('phone', sa.String(length=20), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.drop_column('phone')
        batch_op.drop_column('email')
        batch_op.drop_column('job_title')

    # ### end Alembic commands ###
