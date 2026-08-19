from sqlalchemy import String, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    timestamp: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    merchant: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)