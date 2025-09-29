"""remove egg_production_id from sales

Revision ID: d3868621e506
Revises: eaf5dc3469de
Create Date: 2025-09-29 19:53:29.795386

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd3868621e506'
down_revision = 'eaf5dc3469de'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("sales", schema=None) as batch_op:
        # Only drop the column, don't try to drop a nameless FK
        batch_op.drop_column("egg_production_id")


def downgrade():
    with op.batch_alter_table("sales", schema=None) as batch_op:
        batch_op.add_column(sa.Column("egg_production_id", sa.Integer(), nullable=True))
        # If you want, re-add the foreign key manually here
        # batch_op.create_foreign_key(
        #     "fk_sales_egg_production_id", "egg_production", ["egg_production_id"], ["id"]
        # )
