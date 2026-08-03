from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="user") # "user" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="reporter")
    claims = relationship("Claim", back_populates="claimant")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, index=True, nullable=False) # Electronics, Pets, Jewelry, Bags, Documents, Keys, Wallet, Other
    item_type = Column(String, index=True, nullable=False) # "lost" or "found"
    location = Column(String, nullable=False)
    date_event = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="open") # "open", "matched", "claimed", "resolved"
    image_url = Column(String, nullable=True)
    tags = Column(String, nullable=True) # comma separated tags e.g. "silver, apple, scratch on back"
    reward_amount = Column(Float, default=0.0)
    secret_verification_question = Column(String, nullable=True) # e.g. "What is written on the inside of the ring?"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    reporter = relationship("User", back_populates="items")

    claims = relationship("Claim", back_populates="item")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    match_score = Column(Float, nullable=False) # 0 to 100
    status = Column(String, default="pending") # "pending", "confirmed", "rejected"
    ai_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lost_item = relationship("Item", foreign_keys=[lost_item_id])
    found_item = relationship("Item", foreign_keys=[found_item_id])

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    claimant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    proof_description = Column(Text, nullable=False)
    verification_answer = Column(Text, nullable=True)
    status = Column(String, default="pending") # "pending", "approved", "rejected"
    created_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="claims")
    claimant = relationship("User", back_populates="claims")
