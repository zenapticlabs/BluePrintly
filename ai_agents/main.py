from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Any
import time
import asyncio
from io import StringIO

from model import (
    AnalysisRequest, AnalysisResponse, InputDocument, 
    DocumentType, WorkflowState
)
from workflow import run_analysis_workflow

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Simple AI Agent System",
    description="A simplified version of Blueprintly's AI agent system using LangGraph and PydanticAI",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.post("/analyze-json", response_model=AnalysisResponse)
async def analyze_documents_json(request: AnalysisRequest) -> AnalysisResponse:
    """
    Alternative endpoint that accepts JSON input instead of file uploads
    Useful for testing and when you already have text content
    """
    
    try:
        # Run the LangGraph workflow
        final_state = await run_analysis_workflow(request)
        
        # Return results
        if final_state.proposal_template and not final_state.errors:
            return AnalysisResponse(
                success=True,
                proposal_template=final_state.proposal_template,
                errors=[]
            )
        else:
            return AnalysisResponse(
                success=False,
                proposal_template=final_state.proposal_template,
                errors=final_state.errors or ["Unknown error occurred"]
            )
    
    except Exception as e:
        return AnalysisResponse(
            success=False,
            proposal_template=None,
            errors=[f"Internal error: {str(e)}"]
        )

# ============================================================================
# DEVELOPMENT SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )