from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Claim, Item, User
from ..schemas import ClaimCreate, ClaimResponse

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.get("", response_model=List[ClaimResponse])
def get_claims(db: Session = Depends(get_db)):
    return db.query(Claim).order_by(Claim.id.desc()).all()

@router.post("", response_model=ClaimResponse)
def submit_claim(claim_in: ClaimCreate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    user = db.query(User).first()
    claimant_id = user.id if user else 1
    
    claim = Claim(
        item_id=claim_in.item_id,
        claimant_id=claimant_id,
        proof_description=claim_in.proof_description,
        verification_answer=claim_in.verification_answer,
        status="pending"
    )
    db.add(claim)
    
    # Update item status
    item.status = "claimed"
    db.commit()
    db.refresh(claim)
    return claim

@router.post("/{claim_id}/verify")
def verify_claim(claim_id: int, approve: bool, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    claim.status = "approved" if approve else "rejected"
    if approve:
        claim.item.status = "resolved"
    else:
        claim.item.status = "open"
        
    db.commit()
    return {"message": f"Claim status updated to {claim.status}"}
