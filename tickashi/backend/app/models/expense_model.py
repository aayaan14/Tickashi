from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id          = Column(Integer, primary_key=True, index=True)
    created_by  = Column(String, nullable=False)  # Supabase user ID
    description = Column(String, nullable=False)
    amount      = Column(Float, nullable=False)
    date        = Column(Date, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    shares = relationship("ExpenseShare", back_populates="expense", cascade="all, delete")
