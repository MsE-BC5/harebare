"""Initial migration

Revision ID: 4cba66db4e3c
Revises:
Create Date: 2023-12-22 06:01:47.740728

"""
from typing import Sequence, Union
import uuid
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4cba66db4e3c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # gender テーブルの作成
    op.create_table(
        'genders',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('gender_type', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )

    # AgeRange テーブルの作成
    op.create_table(
        'age_ranges',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('range', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )

    # Address テーブルの作成
    op.create_table(
        'addresses',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('prefecture', sa.String(length=10), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )

    # TalkMode テーブルの作成
    op.create_table(
        'talk_modes',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('mode', sa.String(length=10), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )
    # user テーブルの作成
    op.create_table(
        'users',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(length=30), nullable=False),
        sa.Column('nick_name', sa.String(length=30), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('gender_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('genders.id'), nullable=True),
        sa.Column('age_range_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('age_ranges.id'), nullable=True),
        sa.Column('address_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('addresses.id'), nullable=True),
        sa.Column('talk_mode_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('talk_modes.id'), nullable=True),
        sa.Column('firebase_uid', sa.String(length=50), nullable=True),
        sa.Column('OAuth_provider', sa.String(length=30), nullable=True),
        sa.Column('OAuth_provider_id', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )
    # Query テーブルの作成
    op.create_table(
        'queries',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id'), nullable=True),
        sa.Column('query_text', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )

    # Response テーブルの作成
    op.create_table(
        'responses',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id'), nullable=True),
        sa.Column('query_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('queries.id'), nullable=True),
        sa.Column('response_text', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )

    # Payment テーブルの作成
    op.create_table(
        'payments',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True),
                  primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id'), nullable=True),
        sa.Column('stripe_customer_id', sa.String(length=50), nullable=True),
        sa.Column('price', sa.BigInteger, nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('payment_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True),
                  nullable=True, onupdate=sa.func.now()),
    )


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
