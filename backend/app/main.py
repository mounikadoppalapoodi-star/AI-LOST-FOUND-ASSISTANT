from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .database import Base, engine, SessionLocal
from .models import User, Item, Match, Claim
from .api import auth, items, matches, claims, admin
from .ai_matcher import calculate_ai_match
from .core import config

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=config.settings.PROJECT_NAME,
    description="AI-Powered Multimodal Lost and Found Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(matches.router, prefix="/api")
app.include_router(claims.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "AI Lost & Found Backend"}

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            print("Seeding demo database...")
            # Demo Users
            user1 = User(email="demo@example.com", hashed_password="password123", full_name="Alex Johnson", phone="+1 555-0192", role="user")
            user2 = User(email="admin@example.com", hashed_password="adminpassword", full_name="Sarah Smith (Admin)", phone="+1 555-0144", role="admin")
            db.add_all([user1, user2])
            db.commit()

            # Demo Lost & Found Items
            demo_items = [
                Item(
                    title="Silver MacBook Pro 14'' M2",
                    description="Left in the Central Library 3rd floor reading space near window desk #14. Has a purple sticker of ReactJS on the lid.",
                    category="Electronics",
                    item_type="lost",
                    location="Central Library, Floor 3",
                    image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
                    tags="silver, laptop, apple, macbook, sticker, Library",
                    reward_amount=150.0,
                    secret_verification_question="What is the lock screen profile picture?",
                    user_id=user1.id,
                    status="open"
                ),
                Item(
                    title="Apple MacBook Pro in Silver",
                    description="Found an Apple laptop left open on a wooden table on the 3rd floor reading room near the south windows.",
                    category="Electronics",
                    item_type="found",
                    location="Library Building Floor 3 Window Section",
                    image_url="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
                    tags="silver, macbook, laptop, apple, Library",
                    reward_amount=0.0,
                    secret_verification_question="Describe the sticker on the back of the laptop lid.",
                    user_id=user2.id,
                    status="open"
                ),
                Item(
                    title="Golden Retriever Dog (named 'Rusty')",
                    description="Slipped leash near Oak Park near the fountain. Wearing a red leather collar with brass hardware.",
                    category="Pets",
                    item_type="lost",
                    location="Oak Park Fountain Trail",
                    image_url="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
                    tags="dog, pet, golden retriever, red collar, rusty, Oak Park",
                    reward_amount=250.0,
                    secret_verification_question="What color is the tag on his collar?",
                    user_id=user1.id,
                    status="open"
                ),
                Item(
                    title="Friendly Golden Retriever Found",
                    description="Friendly male golden retriever wandering near Oak Park entrance. Safe in temporary shelter.",
                    category="Pets",
                    item_type="found",
                    location="Oak Park North Entrance",
                    image_url="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80",
                    tags="dog, golden retriever, pet, red collar, Oak Park",
                    reward_amount=0.0,
                    user_id=user2.id,
                    status="open"
                ),
                Item(
                    title="Black Leather Bi-Fold Wallet",
                    description="Contains student ID, driver license, and black credit card. Lost during evening commute.",
                    category="Wallet",
                    item_type="lost",
                    location="Metro Station Line 2",
                    image_url="https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
                    tags="black, leather, wallet, student id, Metro",
                    reward_amount=50.0,
                    user_id=user1.id,
                    status="open"
                ),
                Item(
                    title="Ray-Ban Wayfarer Sunglasses",
                    description="Found on the bench outside Student Activity Center.",
                    category="Other",
                    item_type="found",
                    location="Student Activity Center Bench",
                    image_url="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
                    tags="sunglasses, black, ray-ban, glasses",
                    reward_amount=0.0,
                    user_id=user2.id,
                    status="open"
                )
            ]
            db.add_all(demo_items)
            db.commit()

            # Pre-calculate AI Matches
            lost_items = db.query(Item).filter(Item.item_type == "lost").all()
            found_items = db.query(Item).filter(Item.item_type == "found").all()
            for lost in lost_items:
                for found in found_items:
                    score, explanation = calculate_ai_match(lost, found)
                    if score >= 45.0:
                        m = Match(
                            lost_item_id=lost.id,
                            found_item_id=found.id,
                            match_score=score,
                            ai_explanation=explanation,
                            status="pending"
                        )
                        db.add(m)
            db.commit()
            print("Demo database seeded successfully!")
    finally:
        db.close()

seed_demo_data()
