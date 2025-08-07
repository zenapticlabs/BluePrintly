from langgraph.graph import StateGraph, END
from typing import Dict, Any
import asyncio
import time

from model import WorkflowState, AnalysisRequest
from agents import (
    analyze_capabilities, analyze_themes, analyze_tone, 
    analyze_style, synthesize_template
)

# ============================================================================
# WORKFLOW NODE FUNCTIONS
# ============================================================================

async def start_analysis(state: WorkflowState) -> WorkflowState:
    """Initialize the analysis workflow"""
    
    state.current_step = "started"
    return state

async def analyze_capabilities_node(state: WorkflowState) -> WorkflowState:
    """Analyze agency capabilities using PydanticAI agent"""
    try:
        
        capability_matrix = await analyze_capabilities(state.analysis_request.documents)
        state.capability_matrix = capability_matrix
        state.current_step = "capabilities_analyzed"
        
    except Exception as e:
        error_msg = f"Error analyzing capabilities: {str(e)}"
        state.errors.append(error_msg)
    
    return state

async def analyze_themes_node(state: WorkflowState) -> WorkflowState:
    """Analyze recurring themes using PydanticAI agent"""
    try:
        
        thematic_analysis = await analyze_themes(state.analysis_request.documents)
        state.thematic_analysis = thematic_analysis
        state.current_step = "themes_analyzed"
        
    except Exception as e:
        error_msg = f"Error analyzing themes: {str(e)}"
        state.errors.append(error_msg)
    
    return state

async def analyze_tone_node(state: WorkflowState) -> WorkflowState:
    """Analyze communication tone using PydanticAI agent"""
    try:
        
        tone_profile = await analyze_tone(state.analysis_request.documents)
        state.tone_profile = tone_profile
        state.current_step = "tone_analyzed"
        
    except Exception as e:
        error_msg = f"Error analyzing tone: {str(e)}"
        state.errors.append(error_msg)
    
    return state

async def analyze_style_node(state: WorkflowState) -> WorkflowState:
    """Analyze visual style using PydanticAI agent"""
    try:
        
        style_guide = await analyze_style(state.analysis_request.documents)
        state.style_guide = style_guide
        state.current_step = "style_analyzed"
        
    except Exception as e:
        error_msg = f"Error analyzing style: {str(e)}"
        state.errors.append(error_msg)
    
    return state

async def check_parallel_completion(state: WorkflowState) -> WorkflowState:
    """Check if all parallel analyses are complete"""
    if state.capability_matrix and state.thematic_analysis and state.tone_profile and state.style_guide:
        if not state.errors:
            state.current_step = "ready_for_synthesis"
        else:
            state.current_step = "completed_with_errors"
    else:
        state.current_step = "analyzing"
    
    return state

async def synthesize_template_node(state: WorkflowState) -> WorkflowState:
    """Synthesize all analyses into final proposal template"""
    try:
        
        # Check if we have all required components
        if not all([state.capability_matrix, state.thematic_analysis, 
                   state.tone_profile, state.style_guide]):
            error_msg = "Missing required analysis components for synthesis"
            state.errors.append(error_msg)
            return state
        
        proposal_template = await synthesize_template(
            agency_name=state.analysis_request.agency_name,
            target_industry=state.analysis_request.target_industry,
            capabilities=state.capability_matrix,
            themes=state.thematic_analysis,
            tone=state.tone_profile,
            style=state.style_guide
        )
        
        state.proposal_template = proposal_template
        state.current_step = "completed"
        
    except Exception as e:
        error_msg = f"Error synthesizing template: {str(e)}"
        state.errors.append(error_msg)
        state.current_step = "failed"
    
    return state

# ============================================================================
# ROUTING FUNCTIONS
# ============================================================================

def should_continue_to_synthesis(state: WorkflowState) -> str:
    """Determine if we should proceed to synthesis or end with errors"""
    if state.current_step == "ready_for_synthesis":
        return "synthesize"
    elif state.current_step == "completed_with_errors":
        return END
    else:
        return "check_completion"

# ============================================================================
# WORKFLOW GRAPH CONSTRUCTION
# ============================================================================

def create_workflow_graph():
    """Create the LangGraph workflow"""
    
    # Create the graph
    workflow = StateGraph(WorkflowState)
    
    # Add nodes
    workflow.add_node("start", start_analysis)
    workflow.add_node("analyze_capabilities", analyze_capabilities_node)
    workflow.add_node("analyze_themes", analyze_themes_node)
    workflow.add_node("analyze_tone", analyze_tone_node)
    workflow.add_node("analyze_style", analyze_style_node)
    workflow.add_node("check_completion", check_parallel_completion)
    workflow.add_node("synthesize", synthesize_template_node)
    
    # Set entry point
    workflow.set_entry_point("start")
    
    # Run analyses sequentially to avoid concurrent state updates
    workflow.add_edge("start", "analyze_capabilities")
    workflow.add_edge("analyze_capabilities", "analyze_themes")
    workflow.add_edge("analyze_themes", "analyze_tone")
    workflow.add_edge("analyze_tone", "analyze_style")
    workflow.add_edge("analyze_style", "check_completion")
    
    # Conditional routing from completion check
    workflow.add_conditional_edges(
        "check_completion",
        should_continue_to_synthesis,
        {
            "synthesize": "synthesize",
            "check_completion": "check_completion",
            END: END
        }
    )
    
    # Synthesis leads to end
    workflow.add_edge("synthesize", END)
    
    return workflow.compile()

# ============================================================================
# MAIN EXECUTION FUNCTION
# ============================================================================

async def run_analysis_workflow(analysis_request: AnalysisRequest) -> WorkflowState:
    """Execute the complete analysis workflow"""
    
    start_time = time.time()
    
    # Initialize state
    initial_state = WorkflowState(
        analysis_request=analysis_request,
        current_step="starting"
    )
    
    # Create and run workflow
    app = create_workflow_graph()
    
    
    # Execute the workflow
    final_state_dict = await app.ainvoke(initial_state)
    
    # Convert back to WorkflowState
    final_state = WorkflowState(**final_state_dict)
    
    processing_time = time.time() - start_time
    
    return final_state

# ============================================================================
# SIMPLE SYNCHRONOUS WRAPPER FOR TESTING
# ============================================================================

def run_analysis_sync(analysis_request: AnalysisRequest) -> WorkflowState:
    """Synchronous wrapper for the async workflow (for testing)"""
    return asyncio.run(run_analysis_workflow(analysis_request))