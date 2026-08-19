from sqlalchemy import func, distinct, extract
from sqlalchemy.orm import Session

from app.model.transaction import Transaction
from app.model.user import User


def get_spending_by_category(db: Session):
    results = (
        db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("amount"),
        )
        .group_by(Transaction.category)
        .order_by(func.sum(Transaction.amount).desc())
        .all()
    )

    return [
        {
            "category": category,
            "amount": float(amount),
        }
        for category, amount in results
    ]


def get_categories(db: Session):
    results = (
        db.query(Transaction.category)
        .filter(Transaction.category.isnot(None))
        .distinct()
        .order_by(Transaction.category)
        .all()
    )

    return [category for (category,) in results]

def get_monthly_spending(db: Session):
    results = (
        db.query(
            extract("year", Transaction.timestamp).label("year"),
            extract("month", Transaction.timestamp).label("month"),
            func.sum(Transaction.amount).label("amount"),
        )
        .group_by(
            extract("year", Transaction.timestamp),
            extract("month", Transaction.timestamp),
        )
        .order_by(
            extract("year", Transaction.timestamp),
            extract("month", Transaction.timestamp),
        )
        .all()
    )

    return [
        {
            "month": f"{int(year)}-{int(month):02d}",
            "amount": float(amount),
        }
        for year, month, amount in results
    ]

def get_coin_balance(db: Session) -> int:
    user = db.query(User).first()
    return user.coin_balance if user else 0