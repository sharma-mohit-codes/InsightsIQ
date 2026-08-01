import calendar

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

    # ------------------------------------------------------------------
    # Monthly trend method
    # ------------------------------------------------------------------

    def get_monthly_trends(self) -> list[dict]:
        """Groups sales data by year and month and returns chronological trend data.

        Uses the already-parsed Order Date column from DatasetLoader.
        Each row in the result represents one calendar month.

        Returns a list of dictionaries sorted chronologically (oldest first),
        each containing:

        - year       : int  — calendar year (e.g. 2015)
        - month      : int  — calendar month number 1-12
        - month_name : str  — full English month name (e.g. "November")
        - sales      : float — total sales for that month (2 dp)
        - profit     : float — total profit for that month (2 dp)
        - orders     : int  — count of unique Order IDs placed that month
        """
        df = self._df()

        # Derive temporary grouping columns from the pre-parsed datetime column.
        # These are local variables — no mutations to the shared DataFrame.
        year_col = df["Order Date"].dt.year
        month_col = df["Order Date"].dt.month

        grouped = (
            df.assign(year_grp=year_col, month_grp=month_col)
            .groupby(["year_grp", "month_grp"], sort=True)
            .agg(
                sales=("Sales", "sum"),
                profit=("Profit", "sum"),
                orders=("Order ID", "nunique"),
            )
            .reset_index()
        )

        result = []
        for row in grouped.itertuples(index=False):
            result.append(
                {
                    "year": int(row.year_grp),
                    "month": int(row.month_grp),
                    "month_name": calendar.month_name[int(row.month_grp)],
                    "sales": self._round(row.sales),
                    "profit": self._round(row.profit),
                    "orders": int(row.orders),
                }
            )

        return result

    # ------------------------------------------------------------------
    # Category breakdown method
    # ------------------------------------------------------------------

    def get_category_breakdown(self) -> list[dict]:
        """Groups sales data by Category and returns per-category aggregates.

        Returns a list of dictionaries sorted by sales descending (highest first),
        each containing:

        - category : str   — category name
        - sales    : float — total sales (2 dp)
        - profit   : float — total profit (2 dp)
        - quantity : int   — total units sold
        """
        df = self._df()

        grouped = (
            df.groupby("Category", sort=False)
            .agg(
                sales=("Sales", "sum"),
                profit=("Profit", "sum"),
                quantity=("Quantity", "sum"),
            )
            .reset_index()
            .sort_values("sales", ascending=False)
        )

        return [
            {
                "category": str(row.Category),
                "sales": self._round(row.sales),
                "profit": self._round(row.profit),
                "quantity": int(row.quantity),
            }
            for row in grouped.itertuples(index=False)
        ]
