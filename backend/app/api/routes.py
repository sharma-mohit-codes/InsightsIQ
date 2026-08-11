from fastapi import APIRouter, Response

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


# ------------------------------------------------------------------
# Sales endpoint
# ------------------------------------------------------------------

@router.get("/sales")
def get_sales(
    page: int = 1,
    page_size: int = 20,
    region: str = "All",
    category: str = "All",
    search: str = "",
    date_from: str | None = None,
    date_to: str | None = None,
):
    """Returns paginated sales transaction records with optional region, category, date-range, and search filtering."""
    return _service.get_sales_data(
        page=page,
        page_size=page_size,
        region=region,
        category=category,
        search=search,
        date_from=date_from,
        date_to=date_to,
    )


# ------------------------------------------------------------------
# Products endpoint
# ------------------------------------------------------------------

@router.get("/products/rankings")
def get_product_rankings():
    """Returns the top 10 products ranked by total sales."""
    return _service.get_product_rankings()


# ------------------------------------------------------------------
# Customers endpoint
# ------------------------------------------------------------------

@router.get("/customers/top")
def get_top_customers():
    """Returns the top 10 customers ranked by total sales."""
    return _service.get_top_customers()


# ------------------------------------------------------------------
# Insights endpoint
# ------------------------------------------------------------------

@router.get("/insights")
def get_insights():
    """Returns six high-level executive business insights."""
    return _service.get_business_insights()


# ------------------------------------------------------------------
# Reports endpoint
# ------------------------------------------------------------------

@router.get("/reports/export")
def export_reports(
    region: str = "All",
    category: str = "All",
    date_from: str | None = None,
    date_to: str | None = None,
):
    """Returns the sales report as a downloadable CSV file with optional region, category, and date-range filters."""
    csv_data = _service.export_sales_csv(
        region=region,
        category=category,
        date_from=date_from,
        date_to=date_to,
    )
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=insightiq_sales_report.csv"},
    )



