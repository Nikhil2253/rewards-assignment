from datetime import datetime
from typing import Optional

from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

from app.model.transaction import Transaction


ALLOWED_SORT_FIELDS = {"timestamp", "amount"}


def get_transactions(
    db: Session,
    page: int = 1,
    limit: int = 50,
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    amount_min: Optional[float] = None,
    amount_max: Optional[float] = None,
    sort_by: str = "timestamp",
    sort_order: str = "desc",
):
    query = db.query(Transaction)

    if category:
        query = query.filter(Transaction.category == category)

    if status:
        query = query.filter(Transaction.status == status)

    if search:
        query = query.filter(Transaction.merchant.ilike(f"%{search}%"))

    if date_from:
        query = query.filter(Transaction.timestamp >= date_from)

    if date_to:
        query = query.filter(Transaction.timestamp <= date_to)

    if amount_min is not None:
        query = query.filter(Transaction.amount >= amount_min)

    if amount_max is not None:
        query = query.filter(Transaction.amount <= amount_max)

    total = query.with_entities(func.count(Transaction.id)).scalar()

    sort_field = sort_by if sort_by in ALLOWED_SORT_FIELDS else "timestamp"
    sort_column = getattr(Transaction, sort_field)
    order_func = desc if sort_order == "desc" else asc
    query = query.order_by(order_func(sort_column))

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    total_pages = (total + limit - 1) // limit if total else 0

    return items, total, total_pages