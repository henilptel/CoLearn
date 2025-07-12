#!/usr/bin/env python3
"""
CoLearn Recommendation System
============================

Two-Layer Recommendation Model:
Layer 1: FAISS-based skill matching (Want to teach ↔ Want to learn)
Layer 2: Random Forest re-ranking (Location, Experience, Reviews, Sessions)

Usage:
    python recommendation_model.py <user_id> [--limit=10]
"""

import sys
import json
import numpy as np
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import faiss
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings('ignore')

# Load environment variables
load_dotenv()

class SkillRecommendationSystem:
    def __init__(self):
        self.db_connection = None
        self.mlb = MultiLabelBinarizer()  # For skill encoding
        self.faiss_index = None
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.all_skills = []
        self.user_profiles = {}
        
    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            connection_string = os.getenv('DATABASE_URL')
            if not connection_string:
                raise ValueError("DATABASE_URL not found in environment variables")
            
            self.db_connection = psycopg2.connect(connection_string)
            return True
        except Exception as e:
            print(f"Database connection error: {e}", file=sys.stderr)
            return False
    
    def fetch_data(self):
        """Fetch all necessary data from database"""
        if not self.db_connection:
            return False
            
        try:
            cursor = self.db_connection.cursor(cursor_factory=RealDictCursor)
            
            # Fetch users with their skills, ratings, and other data
            query = """
            SELECT 
                u.id,
                u.name,
                u.location,
                u.experience_years,
                u."createdAt" as created_at,
                
                -- Skills offered (what they can teach)
                array_agg(DISTINCT so.name) FILTER (WHERE so.name IS NOT NULL) as skills_offered,
                array_agg(DISTINCT so.description) FILTER (WHERE so.description IS NOT NULL) as skills_offered_desc,
                
                -- Skills wanted (what they want to learn)
                array_agg(DISTINCT sw.name) FILTER (WHERE sw.name IS NOT NULL) as skills_wanted,
                array_agg(DISTINCT sw.description) FILTER (WHERE sw.description IS NOT NULL) as skills_wanted_desc,
                
                -- Average rating received
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(DISTINCT r.id) as total_ratings,
                
                -- Number of completed sessions
                COUNT(DISTINCT CASE WHEN sr.status = 'COMPLETED' THEN sr.id END) as completed_sessions
                
            FROM "CoLearn".users u
            LEFT JOIN "CoLearn"."_SkillsOffered" uso ON u.id = uso."B"
            LEFT JOIN "CoLearn".skills so ON uso."A" = so.id
            LEFT JOIN "CoLearn"."_SkillsWanted" usw ON u.id = usw."B"  
            LEFT JOIN "CoLearn".skills sw ON usw."A" = sw.id
            LEFT JOIN "CoLearn".ratings r ON u.id = r."receiverId"
            LEFT JOIN "CoLearn".swap_requests sr ON (u.id = sr."requesterId" OR u.id = sr."receiverId")
            WHERE u."isActive" = true AND u."isPublic" = true
            GROUP BY u.id, u.name, u.location, u.experience_years, u."createdAt"
            ORDER BY u.name
            """
            
            cursor.execute(query)
            users_data = cursor.fetchall()
            
            # Convert to list of dictionaries for easier processing
            self.users_data = [dict(row) for row in users_data]
            
            cursor.close()
            return len(self.users_data) > 0
            
        except Exception as e:
            print(f"Data fetch error: {e}", file=sys.stderr)
            return False
    
    def create_skill_encodings(self):
        """Create binary encodings for all skills using MultiLabelBinarizer"""
        try:
            all_skills = set()
            
            # Collect all unique skills
            for user in self.users_data:
                if user['skills_offered']:
                    all_skills.update(user['skills_offered'])
                if user['skills_wanted']:
                    all_skills.update(user['skills_wanted'])
            
            self.all_skills = list(all_skills)
            
            # Fit the MultiLabelBinarizer
            if self.all_skills:
                all_user_skills = []
                for user in self.users_data:
                    user_skills = []
                    if user['skills_offered']:
                        user_skills.extend(user['skills_offered'])
                    if user['skills_wanted']:
                        user_skills.extend(user['skills_wanted'])
                    all_user_skills.append(user_skills)
                
                self.mlb.fit(all_user_skills)
            
            return True
            
        except Exception as e:
            print(f"Skill encoding error: {e}", file=sys.stderr)
            return False
    
    def create_user_skill_vectors(self):
        """Create binary skill vectors for each user (offered and wanted skills)"""
        try:
            self.user_profiles = {}
            
            for user in self.users_data:
                user_id = user['id']
                
                # Create binary vectors for offered and wanted skills
                offered_skills = user['skills_offered'] if user['skills_offered'] else []
                wanted_skills = user['skills_wanted'] if user['skills_wanted'] else []
                
                # Transform to binary vectors
                offered_vector = self.mlb.transform([offered_skills]).astype(np.float32)
                wanted_vector = self.mlb.transform([wanted_skills]).astype(np.float32)
                
                self.user_profiles[user_id] = {
                    'offered_vector': offered_vector.flatten(),
                    'wanted_vector': wanted_vector.flatten(),
                    'user_data': user
                }
            
            return True
            
        except Exception as e:
            print(f"User vector creation error: {e}", file=sys.stderr)
            return False
    
    def build_faiss_index(self):
        """Build FAISS index for fast similarity search"""
        try:
            if not self.user_profiles:
                return False
            
            # Create matrix of all offered skill vectors
            user_ids = list(self.user_profiles.keys())
            offered_vectors = np.array([
                self.user_profiles[uid]['offered_vector'] 
                for uid in user_ids
            ], dtype=np.float32)
            
            # Build FAISS index
            dimension = offered_vectors.shape[1]
            self.faiss_index = faiss.IndexFlatIP(dimension)  # Inner Product for binary vectors
            
            # Normalize vectors for cosine similarity (L2 normalization)
            def safe_normalize(matrix):
                norms = np.linalg.norm(matrix, axis=1, keepdims=True)
                norms[norms == 0] = 1  # Avoid division by zero
                return matrix / norms
            
            offered_vectors_norm = safe_normalize(offered_vectors)
            self.faiss_index.add(offered_vectors_norm)
            
            # Store mapping from index to user_id
            self.index_to_user_id = user_ids
            
            return True
            
        except Exception as e:
            print(f"FAISS index error: {e}", file=sys.stderr)
            return False
    
    def layer1_skill_matching(self, target_user_id, k=50):
        """
        Layer 1: FAISS-based skill matching
        Find users whose offered skills match target user's wanted skills
        """
        try:
            if target_user_id not in self.user_profiles:
                return []
            
            target_wanted = self.user_profiles[target_user_id]['wanted_vector']
            
            # Normalize target vector
            target_wanted = target_wanted.astype(np.float32).reshape(1, -1)
            target_wanted_norm = target_wanted / np.linalg.norm(target_wanted) if np.linalg.norm(target_wanted) > 0 else target_wanted
            
            # Search for similar offered skills
            scores, indices = self.faiss_index.search(target_wanted_norm, min(k, len(self.index_to_user_id)))
            
            candidates = []
            for score, idx in zip(scores[0], indices[0]):
                if idx < len(self.index_to_user_id):
                    candidate_id = self.index_to_user_id[idx]
                    if candidate_id != target_user_id and score > 0:  # Don't recommend self and must have some skill match
                        candidates.append({
                            'user_id': candidate_id,
                            'skill_match_score': float(score),
                            'user_data': self.user_profiles[candidate_id]['user_data']
                        })
            
            return candidates
            
        except Exception as e:
            print(f"Layer 1 matching error: {e}", file=sys.stderr)
            return []
    
    def calculate_location_similarity(self, location1, location2):
        """Calculate location similarity (city/state level)"""
        if not location1 or not location2:
            return 0.0
        
        # Simple city/state matching
        loc1_parts = location1.lower().split(',')
        loc2_parts = location2.lower().split(',')
        
        if len(loc1_parts) >= 2 and len(loc2_parts) >= 2:
            # Same city and state
            if loc1_parts[0].strip() == loc2_parts[0].strip() and loc1_parts[1].strip() == loc2_parts[1].strip():
                return 1.0
            # Same state
            elif loc1_parts[1].strip() == loc2_parts[1].strip():
                return 0.6
        
        return 0.0
    
    def create_layer2_features(self, target_user_id, candidates):
        """Create features for Random Forest re-ranking"""
        try:
            target_user = self.user_profiles[target_user_id]['user_data']
            features = []
            
            for candidate in candidates:
                candidate_data = candidate['user_data']
                
                # Feature 1: Skill match score from Layer 1
                skill_score = candidate['skill_match_score']
                
                # Feature 2: Location similarity
                location_sim = self.calculate_location_similarity(
                    target_user['location'], 
                    candidate_data['location']
                )
                
                # Feature 3: Experience difference (normalized)
                exp_diff = abs(target_user['experience_years'] - candidate_data['experience_years'])
                exp_similarity = 1.0 / (1.0 + exp_diff * 0.1)  # Decay function
                
                # Feature 4: Average rating of candidate
                avg_rating = float(candidate_data['avg_rating']) / 5.0  # Normalize to 0-1
                
                # Feature 5: Number of ratings (reputation indicator)
                rating_count = min(int(candidate_data['total_ratings']), 20) / 20.0  # Cap at 20
                
                # Feature 6: Number of completed sessions
                session_count = min(int(candidate_data['completed_sessions']), 10) / 10.0  # Cap at 10
                
                # Feature 7: Bidirectional skill match (bonus for mutual learning)
                target_offered = set(target_user['skills_offered'] or [])
                candidate_wanted = set(candidate_data['skills_wanted'] or [])
                bidirectional_bonus = len(target_offered.intersection(candidate_wanted)) / max(len(target_offered), 1)
                
                features.append([
                    skill_score,
                    location_sim,
                    exp_similarity,
                    avg_rating,
                    rating_count,
                    session_count,
                    bidirectional_bonus
                ])
            
            return np.array(features)
            
        except Exception as e:
            print(f"Feature creation error: {e}", file=sys.stderr)
            return np.array([])
    
    def train_rf_model(self):
        """Train Random Forest model on existing user interactions"""
        try:
            # For now, use a simple heuristic-based training
            # In production, you'd use actual user interaction data
            
            # Generate synthetic training data based on successful matches
            training_features = []
            training_targets = []
            
            # Create positive examples from successful interactions
            for user in self.users_data:
                if user['completed_sessions'] > 0:
                    # High-quality match example
                    features = [
                        0.8,  # Good skill match
                        0.7,  # Same location preference
                        0.9,  # Similar experience
                        0.8,  # Good rating
                        0.6,  # Some reputation
                        0.7,  # Some sessions
                        0.6   # Some bidirectional potential
                    ]
                    training_features.append(features)
                    training_targets.append(5.0)  # High score
                
                # Add negative examples (random combinations)
                negative_features = [
                    0.2,  # Poor skill match
                    0.0,  # Different location
                    0.3,  # Very different experience
                    0.0,  # No ratings
                    0.0,  # No reputation
                    0.0,  # No sessions
                    0.0   # No bidirectional potential
                ]
                training_features.append(negative_features)
                training_targets.append(1.0)  # Low score
            
            if len(training_features) > 0:
                X = np.array(training_features)
                y = np.array(training_targets)
                
                # Fit scaler and model
                X_scaled = self.scaler.fit_transform(X)
                self.rf_model.fit(X_scaled, y)
                
                return True
            
            return False
            
        except Exception as e:
            print(f"RF training error: {e}", file=sys.stderr)
            return False
    
    def layer2_reranking(self, target_user_id, candidates):
        """
        Layer 2: Random Forest re-ranking
        Re-rank candidates based on multiple factors
        """
        try:
            if not candidates:
                return []
            
            # Create features for all candidates
            features = self.create_layer2_features(target_user_id, candidates)
            
            if features.size == 0:
                return candidates
            
            # Scale features and predict scores
            features_scaled = self.scaler.transform(features)
            rf_scores = self.rf_model.predict(features_scaled)
            
            # Add RF scores to candidates and sort
            for i, candidate in enumerate(candidates):
                candidate['final_score'] = float(rf_scores[i])
                # Ensure layer1_score exists (it should from layer1_skill_matching)
                if 'skill_match_score' in candidate:
                    candidate['layer1_score'] = candidate['skill_match_score']
                else:
                    candidate['layer1_score'] = 0.0
            
            # Sort by final score (descending)
            candidates_ranked = sorted(candidates, key=lambda x: x['final_score'], reverse=True)
            
            return candidates_ranked
            
        except Exception as e:
            print(f"Layer 2 reranking error: {e}", file=sys.stderr)
            return candidates
    
    def get_recommendations(self, target_user_id, limit=10):
        """Main recommendation pipeline"""
        try:
            # Layer 1: Skill-based candidate retrieval
            candidates = self.layer1_skill_matching(target_user_id, k=50)
            
            if not candidates:
                return []
            
            # Layer 2: Multi-factor re-ranking
            ranked_candidates = self.layer2_reranking(target_user_id, candidates)
            
            # Format final results
            recommendations = []
            for candidate in ranked_candidates[:limit]:
                user_data = candidate['user_data']
                recommendations.append({
                    'user_id': candidate['user_id'],
                    'name': user_data['name'],
                    'location': user_data['location'],
                    'experience_years': user_data['experience_years'],
                    'skills_offered': user_data['skills_offered'],
                    'skills_wanted': user_data['skills_wanted'],
                    'avg_rating': float(user_data['avg_rating']),
                    'total_ratings': int(user_data['total_ratings']),
                    'completed_sessions': int(user_data['completed_sessions']),
                    'skill_match_score': candidate.get('layer1_score', candidate.get('skill_match_score', 0.0)),
                    'final_score': candidate.get('final_score', candidate.get('skill_match_score', 0.0)),
                    'match_reasons': self.generate_match_reasons(target_user_id, candidate)
                })
            
            return recommendations
            
        except Exception as e:
            print(f"Recommendation error: {e}", file=sys.stderr)
            return []
    
    def generate_match_reasons(self, target_user_id, candidate):
        """Generate human-readable reasons for the match"""
        reasons = []
        target_user = self.user_profiles[target_user_id]['user_data']
        candidate_data = candidate['user_data']
        
        # Skill matching reasons
        target_wanted = set(target_user['skills_wanted'] or [])
        candidate_offered = set(candidate_data['skills_offered'] or [])
        skill_overlap = target_wanted.intersection(candidate_offered)
        
        if skill_overlap:
            reasons.append(f"Can teach: {', '.join(list(skill_overlap)[:3])}")
        
        # Bidirectional matching
        target_offered = set(target_user['skills_offered'] or [])
        candidate_wanted = set(candidate_data['skills_wanted'] or [])
        bidirectional_overlap = target_offered.intersection(candidate_wanted)
        
        if bidirectional_overlap:
            reasons.append(f"Mutual learning opportunity: {', '.join(list(bidirectional_overlap)[:2])}")
        
        # Location
        if target_user['location'] and candidate_data['location']:
            if target_user['location'].lower() == candidate_data['location'].lower():
                reasons.append("Same location")
            elif self.calculate_location_similarity(target_user['location'], candidate_data['location']) > 0.5:
                reasons.append("Same area")
        
        # Experience
        exp_diff = abs(target_user['experience_years'] - candidate_data['experience_years'])
        if exp_diff <= 2:
            reasons.append("Similar experience level")
        elif candidate_data['experience_years'] > target_user['experience_years']:
            reasons.append("More experienced mentor")
        
        # Reputation
        if candidate_data['avg_rating'] >= 4.0 and candidate_data['total_ratings'] >= 3:
            reasons.append("Highly rated teacher")
        
        return reasons[:4]  # Limit to top 4 reasons
    
    def initialize(self):
        """Initialize the recommendation system"""
        print("🚀 Initializing recommendation system...", file=sys.stderr)
        
        if not self.connect_db():
            return False
        
        print("📊 Fetching user data...", file=sys.stderr)
        if not self.fetch_data():
            return False
        
        print("🔧 Creating skill encodings...", file=sys.stderr)
        if not self.create_skill_encodings():
            return False
        
        print("👤 Creating user profiles...", file=sys.stderr)
        if not self.create_user_skill_vectors():
            return False
        
        print("🔍 Building FAISS index...", file=sys.stderr)
        if not self.build_faiss_index():
            return False
        
        print("🌲 Training Random Forest model...", file=sys.stderr)
        if not self.train_rf_model():
            return False
        
        print("✅ Recommendation system ready!", file=sys.stderr)
        return True
    
    def close(self):
        """Clean up resources"""
        if self.db_connection:
            self.db_connection.close()

def main():
    if len(sys.argv) < 2:
        print("Usage: python recommendation_model.py <user_id> [--limit=10]")
        sys.exit(1)
    
    user_id = sys.argv[1]
    limit = 10
    
    # Parse limit parameter
    for arg in sys.argv[2:]:
        if arg.startswith('--limit='):
            try:
                limit = int(arg.split('=')[1])
            except ValueError:
                pass
    
    # Initialize recommendation system
    recommender = SkillRecommendationSystem()
    
    try:
        if not recommender.initialize():
            print(json.dumps({"error": "Failed to initialize recommendation system"}))
            sys.exit(1)
        
        # Get recommendations
        recommendations = recommender.get_recommendations(user_id, limit)
        
        # Output results as JSON
        result = {
            "user_id": user_id,
            "recommendations": recommendations,
            "total_found": len(recommendations),
            "algorithm": "FAISS + Random Forest"
        }
        
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
    
    finally:
        recommender.close()

if __name__ == "__main__":
    main()
