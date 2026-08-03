from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Item, Match, User
from ..schemas import ItemCreate, ItemResponse
from ..ai_matcher import calculate_ai_match

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("", response_model=List[ItemResponse])
def get_items(
    item_type: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Item)
    if item_type:
        query = query.filter(Item.item_type == item_type)
    if category and category != "All":
        query = query.filter(Item.category == category)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Item.title.ilike(search_pattern)) | 
            (Item.description.ilike(search_pattern)) |
            (Item.location.ilike(search_pattern)) |
            (Item.tags.ilike(search_pattern))
        )
    return query.order_by(Item.id.desc()).all()

@router.post("", response_model=ItemResponse)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    user_id = user.id if user else None
    
    item = Item(
        title=item_in.title,
        description=item_in.description,
        category=item_in.category,
        item_type=item_in.item_type,
        location=item_in.location,
        image_url=item_in.image_url or "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60",
        tags=item_in.tags,
        reward_amount=item_in.reward_amount or 0.0,
        secret_verification_question=item_in.secret_verification_question,
        user_id=user_id,
        status="open"
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Automatically trigger AI match check against opposite items
    opposite_type = "found" if item.item_type == "lost" else "lost"
    opposite_items = db.query(Item).filter(Item.item_type == opposite_type, Item.status == "open").all()
    
    for opp in opposite_items:
        lost_obj = item if item.item_type == "lost" else opp
        found_obj = opp if item.item_type == "lost" else item
        
        score, explanation = calculate_ai_match(lost_obj, found_obj)
        if score >= 50.0:
            match = Match(
                lost_item_id=lost_obj.id,
                found_item_id=found_obj.id,
                match_score=score,
                ai_explanation=explanation,
                status="pending"
            )
            db.add(match)
    
    db.commit()
    return item

@router.get("/{item_id}", response_model=ItemResponse)
def get_item_detail(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
