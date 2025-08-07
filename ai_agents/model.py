from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum

# ============================================================================
# INPUT MODELS - What the user sends to our system
# ============================================================================

class DocumentType(str, Enum):
    PROPOSAL = "proposal"
    CASE_STUDY = "case_study"
    TEMPLATE = "template"

class InputDocument(BaseModel):
    """Represents an uploaded document for analysis"""
    content: str = Field()
    document_type: DocumentType = Field()
    filename: str = Field()

class AnalysisRequest(BaseModel):
    """Request to analyze documents and generate proposal template"""
    documents: List[InputDocument] = Field()
    agency_name: str = Field()
    target_industry: Optional[str] = Field(default=None)

# ============================================================================
# ANALYSIS OUTPUTS - What our agents produce
# ============================================================================

class TechnicalSkill(BaseModel):
    """A technical skill with proficiency level"""
    skill: str = Field()
    proficiency: str = Field()
    examples: List[str] = Field(default=[])

class CapabilityMatrix(BaseModel):
    """Agency's technical and business capabilities"""
    technical_skills: List[TechnicalSkill] = Field()
    business_domains: List[str] = Field()
    service_types: List[str] = Field()

class ThematicAnalysis(BaseModel):
    """Analysis of recurring themes and value propositions"""
    recurring_problems_solved: List[str] = Field()
    unique_selling_propositions: List[str] = Field()
    success_patterns: List[str] = Field()

class ToneProfile(BaseModel):
    """Agency's communication style and tone"""
    formality_level: str = Field()
    key_adjectives: List[str] = Field()
    communication_style: str = Field()

class StyleGuide(BaseModel):
    """Basic style guide for proposals"""
    layout_style: str = Field()

# ============================================================================
# PROPOSAL TEMPLATE - Final output
# ============================================================================

class ProposalSection(BaseModel):
    """Individual section of a proposal template"""
    section_name: str = Field()
    goal: str = Field()
    tone_and_style_prompt: str = Field()
    key_points_to_include: List[str] = Field()
    word_count_target: Optional[int] = Field(default=None)

class ProposalTemplate(BaseModel):
    """Complete proposal template with all components"""
    template_name: str = Field()
    description: str = Field()
    target_audience: str = Field()
    
    # Core intelligence
    capability_matrix: CapabilityMatrix = Field()
    thematic_analysis: ThematicAnalysis = Field()
    tone_profile: ToneProfile = Field()
    style_guide: StyleGuide = Field()
    
    # Template sections
    sections: List[ProposalSection] = Field()

# ============================================================================
# WORKFLOW STATE - Used by LangGraph
# ============================================================================

class WorkflowState(BaseModel):
    """State that flows through our LangGraph workflow"""
    # Input
    analysis_request: AnalysisRequest
    
    # Intermediate results
    capability_matrix: Optional[CapabilityMatrix] = None
    thematic_analysis: Optional[ThematicAnalysis] = None
    tone_profile: Optional[ToneProfile] = None
    style_guide: Optional[StyleGuide] = None
    
    # Final result
    proposal_template: Optional[ProposalTemplate] = None
    
    # Workflow tracking
    current_step: str = "starting"
    errors: List[str] = Field(default=[])

# ============================================================================
# API RESPONSE MODELS
# ============================================================================

class AnalysisResponse(BaseModel):
    """Response from the analysis API"""
    success: bool = Field()
    proposal_template: Optional[ProposalTemplate] = Field(default=None)
    errors: List[str] = Field(default=[])