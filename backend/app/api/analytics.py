from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/spending-by-category")
def spending_by_category(
    db: Session = Depends(get_db),
):
    return analytics_service.get_spending_by_category(db)

@router.get("/categories")
def categories(
    db: Session = Depends(get_db),
):
    return analytics_service.get_categories(db)

@router.get("/monthly-spending")
def monthly_spending(
    db: Session = Depends(get_db),
):
    return analytics_service.get_monthly_spending(db)