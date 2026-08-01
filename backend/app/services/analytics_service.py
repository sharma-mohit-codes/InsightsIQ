from app.data.loader import DatasetLoader, get_dataset_loader


class AnalyticsService:
    """Service layer for computing business analytics from the retail sales dataset.

    All calculations are performed against the pre-loaded DataFrame provided by
    DatasetLoader. The CSV file is never read directly from this layer.
    """

    def __init__(self, loader: DatasetLoader | None = None):
        # Accept an injected loader or fall back to the global singleton.
        self._loader = loader if loader is not None else get_dataset_loader()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _df(self):
        """Returns the validated, cleaned DataFrame. Loaded once on first access."""
        return self._loader.get_data()

    def _round(self, value: float, decimals: int = 2) -> float:
        """Rounds a float to the given number of decimal places."""
        return round(float(value), decimals)

    # ------------------------------------------------------------------
    # Public KPI method
    # ------------------------------------------------------------------

    def get_kpis(self) -> dict:
        """Computes and returns the top-level business KPIs.

        Returns a plain Python dictionary with the following keys:

        - total_revenue       : Sum of the Sales column (float, 2 dp)
        - total_profit        : Sum of the Profit column (float, 2 dp)
        - total_orders        : Count of unique Order IDs (int)
        - average_order_value : total_revenue / total_orders (float, 2 dp)
        - total_customers     : Count of unique Customer IDs (int)
        - profit_margin_pct   : (total_profit / total_revenue) * 100 (float, 2 dp)

        Raises:
            ZeroDivisionError: if total_revenue is zero (edge-case safety guard).
        """
        df = self._df()

        total_revenue = self._round(df["Sales"].sum())
        total_profit = self._round(df["Profit"].sum())
        total_orders = int(df["Order ID"].nunique())
        total_customers = int(df["Customer ID"].nunique())

        average_order_value = (
            self._round(total_revenue / total_orders) if total_orders > 0 else 0.0
        )

        profit_margin_pct = (
            self._round((total_profit / total_revenue) * 100)
            if total_revenue != 0
            else 0.0
        )

        return {
            "total_revenue": total_revenue,
            "total_profit": total_profit,
            "total_orders": total_orders,
            "average_order_value": average_order_value,
            "total_customers": total_customers,
            "profit_margin_pct": profit_margin_pct,
        }
