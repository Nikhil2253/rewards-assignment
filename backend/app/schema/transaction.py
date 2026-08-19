from datetime import datetime
from typing import List
from pydantic import BaseModel


class TransactionOut(BaseModel):
    id: str
    timestamp: datetime
    merchant: str
    category: str
    amount: float
    currency: str
    status: str
    payment_method: str

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    items: List[TransactionOut]
    total: int
    page: int
    limit: int
    total_pages: int