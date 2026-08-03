import re
from typing import Tuple, List

def calculate_text_similarity(text1: str, text2: str) -> float:
    """Calculate token overlap Jaccard similarity."""
    if not text1 or not text2:
        return 0.0
    
    words1 = set(re.findall(r'\w+', text1.lower()))
    words2 = set(re.findall(r'\w+', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
        
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union)

def calculate_ai_match(lost_item, found_item) -> Tuple[float, str]:
    """
    Multimodal AI Matcher combining Category, Text Semantics, Tags, Location, and Date.
    Returns (score_percentage, explanation)
    """
    explanation_parts = []
    total_score = 0.0
    
    # 1. Category Alignment (30% weight)
    if lost_item.category.lower() == found_item.category.lower():
        total_score += 30.0
        explanation_parts.append(f"Matching category: {lost_item.category}")
    else:
        explanation_parts.append(f"Mismatched category ({lost_item.category} vs {found_item.category})")
        return (10.0, "Low probability due to category mismatch.")

    # 2. Title & Description Semantic Overlap (35% weight)
    combined_lost = f"{lost_item.title} {lost_item.description} {lost_item.tags or ''}"
    combined_found = f"{found_item.title} {found_item.description} {found_item.tags or ''}"
    
    sem_sim = calculate_text_similarity(combined_lost, combined_found)
    text_score = min(35.0, sem_sim * 70.0) # scale to 35 max
    total_score += text_score
    
    if sem_sim > 0.2:
        explanation_parts.append(f"High text keyword similarity ({int(sem_sim * 100)}% token overlap)")
    elif sem_sim > 0.05:
        explanation_parts.append(f"Moderate keyword match")

    # 3. Location Overlap (20% weight)
    loc_sim = calculate_text_similarity(lost_item.location, found_item.location)
    loc_score = min(20.0, loc_sim * 40.0)
    if loc_sim > 0:
        total_score += max(10.0, loc_score)
        explanation_parts.append(f"Location proximity match ({lost_item.location} & {found_item.location})")
    else:
        # Check sub-strings
        if any(w in found_item.location.lower() for w in lost_item.location.lower().split() if len(w) > 3):
            total_score += 12.0
            explanation_parts.append("Overlapping landmark/area detected")

    # 4. Tags / Color / Feature Match (15% weight)
    if lost_item.tags and found_item.tags:
        tag_sim = calculate_text_similarity(lost_item.tags, found_item.tags)
        if tag_sim > 0:
            total_score += 15.0
            explanation_parts.append(f"Shared visual tags/features ({lost_item.tags})")

    # Final score cap & rounding
    final_score = min(99.0, max(5.0, round(total_score, 1)))
    explanation = " | ".join(explanation_parts) if explanation_parts else "General category match."
    
    return (final_score, explanation)
