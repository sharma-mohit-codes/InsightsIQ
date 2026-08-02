from fastapi import APIRouter

from app.services.analytics_service import AnalyticsService

router = APIRouter()

_service = AnalyticsService()


@router.get("/")
def read_root():
    return {"message": "Welcome to InsightIQ API"}


@router.get("/health")
def health_check():
    return {"status": "healthy"}


# ------------------------------------------------------------------
# Analytics endpoints
# ------------------------------------------------------------------

@router.get("/analytics/kpis")
def get_kpis():
    """Returns top-level business KPIs."""
    return _service.get_kpis()


@router.get("/analytics/trends")
def get_trends():
    """Returns monthly sales and profit trends."""
    return _service.get_monthly_trends()


@router.get("/analytics/categories")
def get_categories():
    """Returns sales breakdown by product category."""
    return _service.get_category_breakdown()


@router.get("/analytics/regions")
def get_regions():
    """Returns sales breakdown by region."""
    return _service.get_region_breakdown()
