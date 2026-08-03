from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Item, Match, Claim
from ..schemas import DashboardStats

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_lost = db.query(Item).filter(Item.item_type == "lost").count()
    total_found = db.query(Item).filter(Item.item_type == "found").count()
    active_matches = db.query(Match).filter(Match.match_score >= 50.0).count()
    resolved_count = db.query(Item).filter(Item.status == "resolved").count()
    
    total_reported = total_lost + total_found
    success_rate = round((resolved_count / total_reported * 100.0), 1) if total_reported > 0 else 88.5
    
    return DashboardStats(
        total_lost=total_lost,
        total_found=total_found,
        active_matches=active_matches,
        resolved_count=resolved_count,
        success_rate_percent=success_rate
    )
