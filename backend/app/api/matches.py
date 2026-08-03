from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Match, Item
from ..schemas import MatchResponse
from ..ai_matcher import calculate_ai_match

router = APIRouter(prefix="/matches", tags=["AI Matches"])

@router.get("", response_model=List[MatchResponse])
def get_all_matches(db: Session = Depends(get_db)):
    matches = db.query(Match).order_by(Match.match_score.desc()).all()
    return matches

@router.post("/recalculate")
def recalculate_matches(db: Session = Depends(get_db)):
    """Run full AI matching pass across all Lost and Found items."""
    db.query(Match).delete()
    db.commit()
    
    lost_items = db.query(Item).filter(Item.item_type == "lost").all()
    found_items = db.query(Item).filter(Item.item_type == "found").all()
    
    created_count = 0
    for lost in lost_items:
        for found in found_items:
            score, explanation = calculate_ai_match(lost, found)
            if score >= 40.0: # threshold for AI match
                match = Match(
                    lost_item_id=lost.id,
                    found_item_id=found.id,
                    match_score=score,
                    ai_explanation=explanation,
                    status="pending"
                )
                db.add(match)
                created_count += 1
                
    db.commit()
    return {"message": "AI match calculation completed", "matches_found": created_count}
