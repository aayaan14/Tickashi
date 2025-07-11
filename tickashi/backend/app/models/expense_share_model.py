from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ExpenseShare(Base):
    __tablename__ = "expense_shares"

    id         = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id", ondelete="CASCADE"))
    user_id    = Column(String, nullable=False)  # Supabase user ID
    amount     = Column(Float, nullable=False)

    expense = relationship("Expense", back_populates="shares")
