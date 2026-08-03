from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

# Item Schemas
class ItemBase(BaseModel):
    title: str
    description: str
    category: str
    item_type: str # "lost" or "found"
    location: str
    image_url: Optional[str] = None
    tags: Optional[str] = None
    reward_amount: Optional[float] = 0.0
    secret_verification_question: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    date_event: datetime
    status: str
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

# Match Schemas
class MatchResponse(BaseModel):
    id: int
    lost_item: ItemResponse
    found_item: ItemResponse
    match_score: float
    status: str
    ai_explanation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Claim Schemas
class ClaimCreate(BaseModel):
    item_id: int
    proof_description: str
    verification_answer: Optional[str] = None

class ClaimResponse(BaseModel):
    id: int
    item_id: int
    claimant_id: int
    proof_description: str
    verification_answer: Optional[str] = None
    status: str
    created_at: datetime
    item: Optional[ItemResponse] = None

    class Config:
        from_attributes = True

# Analytics / Admin Schemas
class DashboardStats(BaseModel):
    total_lost: int
    total_found: int
    active_matches: int
    resolved_count: int
    success_rate_percent: float
