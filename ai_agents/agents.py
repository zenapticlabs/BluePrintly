from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
from typing import List
import json

from model import (
    InputDocument, CapabilityMatrix, ThematicAnalysis, 
    ToneProfile, StyleGuide, ProposalTemplate, TechnicalSkill, ProposalSection
)
from config import OPENAI_API_KEY

# ============================================================================
# SHARED MODEL SETUP
# ============================================================================

# Use GPT-4 for better reasoning capabilities
# OpenAI API key is loaded from environment variables via config.py
model = OpenAIModel('gpt-4o-mini')

# ============================================================================
# AGENT 1: CAPABILITY ANALYZER
# ============================================================================

capability_agent = Agent(
    model,
    result_type=CapabilityMatrix,
    system_prompt="""You are a Capability Analysis Expert. Your job is to analyze documents from a tech agency and extract their technical skills, business domains, and service types.

Look for:
- Programming languages, frameworks, and technologies mentioned
- Industries they've worked in (fintech, healthcare, e-commerce, etc.)
- Types of services (web development, mobile apps, consulting, etc.)
- Specific tools and platforms they use

Be thorough but concise. Focus on capabilities that appear multiple times or are emphasized."""
)

@capability_agent.tool
def analyze_technical_skills(ctx: RunContext[List[InputDocument]], content: str) -> str:
    """Extract technical skills from document content"""
    return f"Analyzing technical skills in: {content[:200]}..."

# ============================================================================
# AGENT 2: THEMATIC ANALYZER  
# ============================================================================

thematic_agent = Agent(
    model,
    result_type=ThematicAnalysis,
    system_prompt="""You are a Strategic Theme Analyst. Your job is to identify recurring patterns in an agency's success stories and value propositions.

Look for:
- Common client problems the agency consistently solves
- Unique advantages or differentiators they emphasize
- Patterns in their successful project outcomes
- Value propositions that appear across multiple documents

Focus on what makes this agency special and what problems they're best at solving."""
)

# ============================================================================
# AGENT 3: TONE & STYLE ANALYZER
# ============================================================================

tone_agent = Agent(
    model,
    result_type=ToneProfile,
    system_prompt="""You are a Communication Style Expert. Your job is to analyze how an agency communicates and define their brand voice.

Analyze:
- Formality level (formal, semi-formal, casual)
- Key adjectives that describe their communication style
- Overall approach (technical vs. business-focused, confident vs. humble, etc.)

Extract the essence of how they present themselves to clients."""
)

style_agent = Agent(
    model,
    result_type=StyleGuide,
    system_prompt="""You are a Visual Style Analyst. Your job is to identify visual and formatting patterns in agency documents.

Since you're working with text content, focus on:
- Layout structure preferences (sections, formatting)
- Writing style patterns
- Document organization approaches
- Any mentioned brand elements

Create a basic style guide for document formatting and structure."""
)

# ============================================================================
# AGENT 4: TEMPLATE SYNTHESIZER (The Master Agent)
# ============================================================================

synthesizer_agent = Agent(
    model,
    result_type=ProposalTemplate,
    system_prompt="""You are the Template Synthesis Master. Your job is to combine all analysis results into a comprehensive, actionable proposal template.

You receive:
- Capability matrix (what they can do)
- Thematic analysis (what they're known for)
- Tone profile (how they communicate)
- Style guide (how they format)

Create a proposal template with specific sections that:
1. Plays to their strengths
2. Addresses common client needs
3. Uses their authentic voice
4. Follows their style preferences

Each section should have clear goals, tone instructions, and key points to include."""
)

# ============================================================================
# AGENT EXECUTION FUNCTIONS
# ============================================================================

async def analyze_capabilities(documents: List[InputDocument]) -> CapabilityMatrix:
    """Analyze technical and business capabilities from documents"""
    
    # Combine all document content for analysis
    combined_content = "\n\n".join([
        f"=== {doc.filename} ({doc.document_type}) ===\n{doc.content}" 
        for doc in documents
    ])
    
    result = await capability_agent.run(
        f"""Analyze these agency documents and extract their capabilities:

{combined_content}

Return a comprehensive capability matrix including technical skills with proficiency levels, business domains, and service types."""
    )
    
    return result.data

async def analyze_themes(documents: List[InputDocument]) -> ThematicAnalysis:
    """Analyze recurring themes and value propositions"""
    
    combined_content = "\n\n".join([
        f"=== {doc.filename} ({doc.document_type}) ===\n{doc.content}" 
        for doc in documents
    ])
    
    result = await thematic_agent.run(
        f"""Analyze these agency documents for recurring themes and value propositions:

{combined_content}

Identify:
1. What client problems they consistently solve
2. Their unique selling propositions
3. Patterns in their successful projects"""
    )
    
    return result.data

async def analyze_tone(documents: List[InputDocument]) -> ToneProfile:
    """Analyze communication style and tone"""
    
    combined_content = "\n\n".join([
        f"=== {doc.filename} ({doc.document_type}) ===\n{doc.content}" 
        for doc in documents
    ])
    
    result = await tone_agent.run(
        f"""Analyze the communication style in these agency documents:

{combined_content}

Determine their tone profile including formality level, key adjectives, and overall communication style."""
    )
    
    return result.data

async def analyze_style(documents: List[InputDocument]) -> StyleGuide:
    """Analyze visual and formatting style"""
    
    combined_content = "\n\n".join([
        f"=== {doc.filename} ({doc.document_type}) ===\n{doc.content}" 
        for doc in documents
    ])
    
    result = await style_agent.run(
        f"""Analyze the formatting and structural style in these documents:

{combined_content}

Create a style guide focusing on document structure, layout preferences, and formatting patterns."""
    )
    
    return result.data

async def synthesize_template(
    agency_name: str,
    target_industry: str,
    capabilities: CapabilityMatrix,
    themes: ThematicAnalysis,
    tone: ToneProfile,
    style: StyleGuide
) -> ProposalTemplate:
    """Synthesize all analyses into a comprehensive proposal template"""
    
    analysis_summary = f"""
AGENCY: {agency_name}
TARGET INDUSTRY: {target_industry or "General"}

CAPABILITIES:
{capabilities.model_dump_json(indent=2)}

THEMES:
{themes.model_dump_json(indent=2)}

TONE PROFILE:
{tone.model_dump_json(indent=2)}

STYLE GUIDE:
{style.model_dump_json(indent=2)}
"""
    
    result = await synthesizer_agent.run(
        f"""Based on this comprehensive analysis, create a proposal template that combines all insights:

{analysis_summary}

Create a template with 5-7 key sections that:
1. Leverages their technical capabilities
2. Emphasizes their unique themes and value props
3. Uses their authentic communication style
4. Follows their formatting preferences
5. Addresses common client needs in their target industry

Each section should have specific instructions for content creation."""
    )
    
    return result.data