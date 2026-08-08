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

    # ------------------------------------------------------------------
    # Region breakdown method
    # ------------------------------------------------------------------

    def get_region_breakdown(self) -> list[dict]:
        """Groups sales data by Region and returns per-region aggregates.

        Returns a list of dictionaries sorted by sales descending (highest first),
        each containing:

        - region  : str   — region name
        - sales   : float — total sales (2 dp)
        - profit  : float — total profit (2 dp)
        - orders  : int   — count of unique Order IDs
        """
        df = self._df()

        grouped = (
            df.groupby("Region", sort=False)
            .agg(
                sales=("Sales", "sum"),
                profit=("Profit", "sum"),
                orders=("Order ID", "nunique"),
            )
            .reset_index()
            .sort_values("sales", ascending=False)
        )

        return [
            {
                "region": str(row.Region),
                "sales": self._round(row.sales),
                "profit": self._round(row.profit),
                "orders": int(row.orders),
            }
            for row in grouped.itertuples(index=False)
        ]

    # ------------------------------------------------------------------
    # Sales transaction method
    # ------------------------------------------------------------------

    def get_sales_data(
        self,
        page: int = 1,
        page_size: int = 20,
        region: str = "All",
        category: str = "All",
        search: str = "",
    ) -> dict:
        """Returns paginated sales transaction records with optional region, category, and search filtering.

        Args:
            page: 1-indexed page number (default 1)
            page_size: number of records per page (default 20)
            region: region filter, or "All" for no filter
            category: category filter, or "All" for no filter
            search: search string to filter across Order ID, Customer Name, Category, and Region

        Returns:
            dict containing total_records, filtered_records, total_pages, current_page, page_size, and data.
        """
        df = self._df()
        total_records = len(df)

        filtered_df = df

        if region and region.strip() and region.strip().lower() != "all":
            filtered_df = filtered_df[
                filtered_df["Region"].str.lower() == region.strip().lower()
            ]

        if category and category.strip() and category.strip().lower() != "all":
            filtered_df = filtered_df[
                filtered_df["Category"].str.lower() == category.strip().lower()
            ]

        if search and search.strip():
            search_term = search.strip().lower()
            filtered_df = filtered_df[
                filtered_df["Order ID"].astype(str).str.lower().str.contains(search_term, regex=False)
                | filtered_df["Customer Name"].astype(str).str.lower().str.contains(search_term, regex=False)
                | filtered_df["Category"].astype(str).str.lower().str.contains(search_term, regex=False)
                | filtered_df["Region"].astype(str).str.lower().str.contains(search_term, regex=False)
            ]

        filtered_records = len(filtered_df)

        page = max(1, page)
        page_size = max(1, page_size)

        total_pages = (
            (filtered_records + page_size - 1) // page_size if filtered_records > 0 else 0
        )

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        page_df = filtered_df.iloc[start_idx:end_idx]

        records = []
        for _, row in page_df.iterrows():
            order_date = row["Order Date"]
            date_str = (
                order_date.strftime("%Y-%m-%d")
                if hasattr(order_date, "strftime")
                else str(order_date)
            )
            records.append(
                {
                    "order_id": str(row["Order ID"]),
                    "order_date": date_str,
                    "customer_name": str(row["Customer Name"]),
                    "region": str(row["Region"]),
                    "category": str(row["Category"]),
                    "sales": self._round(row["Sales"]),
                    "profit": self._round(row["Profit"]),
                }
            )

        return {
            "total_records": total_records,
            "filtered_records": filtered_records,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
            "data": records,
        }

    # ------------------------------------------------------------------
    # Product rankings method
    # ------------------------------------------------------------------

    def get_product_rankings(self) -> list[dict]:
        """Groups sales data by Product Name and returns the top 10 products by total sales.

        Returns a list of up to 10 dictionaries sorted by total sales descending,
        each containing:

        - product_name : str   — product name
        - sales        : float — total sales (2 dp)
        - profit       : float — total profit (2 dp)
        - quantity     : int   — total units sold
        """
        df = self._df()

        grouped = (
            df.groupby("Product Name", sort=False)
            .agg(
                total_sales=("Sales", "sum"),
                total_profit=("Profit", "sum"),
                total_quantity=("Quantity", "sum"),
            )
            .reset_index()
            .sort_values("total_sales", ascending=False)
            .head(10)
        )

        return [
            {
                "product_name": str(row["Product Name"]),
                "sales": self._round(row["total_sales"]),
                "profit": self._round(row["total_profit"]),
                "quantity": int(row["total_quantity"]),
            }
            for _, row in grouped.iterrows()
        ]

    # ------------------------------------------------------------------
    # Top customers method
    # ------------------------------------------------------------------

    def get_top_customers(self) -> list[dict]:
        """Groups sales data by Customer Name and returns the top 10 customers by total sales.

        Returns a list of up to 10 dictionaries sorted by total sales descending,
        each containing:

        - customer_name : str   — customer name
        - sales         : float — total sales (2 dp)
        - profit        : float — total profit (2 dp)
        - orders        : int   — count of unique Order IDs
        """
        df = self._df()

        grouped = (
            df.groupby("Customer Name", sort=False)
            .agg(
                total_sales=("Sales", "sum"),
                total_profit=("Profit", "sum"),
                total_orders=("Order ID", "nunique"),
            )
            .reset_index()
            .sort_values("total_sales", ascending=False)
            .head(10)
        )

        return [
            {
                "customer_name": str(row["Customer Name"]),
                "sales": self._round(row["total_sales"]),
                "profit": self._round(row["total_profit"]),
                "orders": int(row["total_orders"]),
            }
            for _, row in grouped.iterrows()
        ]

    # ------------------------------------------------------------------
    # Business insights method
    # ------------------------------------------------------------------

    def get_business_insights(self) -> dict:
        """Computes six high-level executive insights from the dataset.

        Returns a plain dictionary with the following keys:

        - best_category         : str — category with highest total sales
        - lowest_profit_category: str — category with lowest total profit
        - best_region           : str — region with highest total sales
        - top_customer          : str — customer with highest total sales
        - best_product          : str — product with highest total sales
        - best_sales_month      : str — "Month YYYY" with highest total sales
        """
        df = self._df()

        best_category = str(
            df.groupby("Category")["Sales"].sum().idxmax()
        )

        lowest_profit_category = str(
            df.groupby("Category")["Profit"].sum().idxmin()
        )

        best_region = str(
            df.groupby("Region")["Sales"].sum().idxmax()
        )

        top_customer = str(
            df.groupby("Customer Name")["Sales"].sum().idxmax()
        )

        best_product = str(
            df.groupby("Product Name")["Sales"].sum().idxmax()
        )

        month_sales = (
            df.assign(
                _year=df["Order Date"].dt.year,
                _month=df["Order Date"].dt.month,
            )
            .groupby(["_year", "_month"])["Sales"]
            .sum()
        )
        best_year, best_month = month_sales.idxmax()
        best_sales_month = f"{calendar.month_name[int(best_month)]} {int(best_year)}"

        return {
            "best_category": best_category,
            "lowest_profit_category": lowest_profit_category,
            "best_region": best_region,
            "top_customer": top_customer,
            "best_product": best_product,
            "best_sales_month": best_sales_month,
        }

    # ------------------------------------------------------------------
    # CSV Export method
    # ------------------------------------------------------------------

    def export_sales_csv(self) -> str:
        """Exports the cleaned sales DataFrame as a CSV string."""
        return self._df().to_csv(index=False)

