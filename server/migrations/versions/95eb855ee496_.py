"""empty message

Revision ID: 95eb855ee496
Revises: 8864a78df5f9
Create Date: 2024-02-01 14:14:46.639228

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '95eb855ee496'
down_revision = '8864a78df5f9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('todo_tag',
    sa.Column('todo_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.Column('assigned_date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], ),
    sa.ForeignKeyConstraint(['todo_id'], ['todo.id'], ),
    sa.PrimaryKeyConstraint('todo_id', 'tag_id')
    )
    op.drop_table('todo_tags')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('todo_tags',
    sa.Column('todo_id', sa.INTEGER(), nullable=False),
    sa.Column('tag_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], ),
    sa.ForeignKeyConstraint(['todo_id'], ['todo.id'], ),
    sa.PrimaryKeyConstraint('todo_id', 'tag_id')
    )
    op.drop_table('todo_tag')
    # ### end Alembic commands ###