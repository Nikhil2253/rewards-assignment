from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schema.transaction import TransactionListResponse
from app.service import transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=TransactionListResponse)
def list_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    amount_min: Optional[float] = None,
    amount_max: Optional[float] = None,
    sort_by: str = "timestamp",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
):
    items, total, total_pages = transaction_service.get_transactions(
        db,
        page=page,
        limit=limit,
        category=category,
        status=status,
        search=search,
        date_from=date_from,
        date_to=date_to,
        amount_min=amount_min,
        amount_max=amount_max,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    return TransactionListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )