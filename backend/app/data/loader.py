import os
from pathlib import Path
from typing import Optional, List
import pandas as pd


REQUIRED_COLUMNS: List[str] = [
    "Order ID",
    "Order Date",
    "Ship Date",
    "Customer ID",
    "Customer Name",
    "Segment",
    "Region",
    "Category",
    "Sub-Category",
    "Product Name",
    "Sales",
    "Quantity",
    "Discount",
    "Profit",
]


class DatasetValidationError(Exception):
    """Raised when the dataset fails required validation criteria."""

    pass


class DatasetFileNotFoundError(FileNotFoundError):
    """Raised when the dataset file is missing from the designated folder."""

    pass


class DatasetLoader:
    """Reusable dataset loader responsible for loading, validating, parsing, and

    storing the retail sales DataFrame once during application lifecycle.
    """

    def __init__(self, file_path: Optional[str] = None):
        if file_path is None:
            # Look for dataset in project_root/dataset/
            base_dir = Path(__file__).resolve().parents[3]
            dataset_dir = base_dir / "dataset"
            
            # Check for standard file names
            possible_files = [
                dataset_dir / "Superstore sales dataset.csv",
                dataset_dir / "Sample - Superstore.csv",
                dataset_dir / "superstore.csv",
            ]
            
            file_path = None
            for p in possible_files:
                if p.exists():
                    file_path = str(p)
                    break
            
            if file_path is None:
                # Default fallback path for error message
                file_path = str(dataset_dir / "Superstore sales dataset.csv")

        self.file_path = file_path
        self._df: Optional[pd.DataFrame] = None

    def validate_columns(self, df: pd.DataFrame) -> None:
        """Validates that all required columns exist in the DataFrame."""
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_columns:
            raise DatasetValidationError(
                f"Dataset validation failed. Missing required columns: {', '.join(missing_columns)}"
            )

    def load(self) -> pd.DataFrame:
        """Loads CSV, validates columns, parses dates, and cleans text columns."""
        if self._df is not None:
            return self._df

        if not os.path.exists(self.file_path):
            raise DatasetFileNotFoundError(
                f"Dataset file not found at '{self.file_path}'. "
                "Please place the Sample Superstore CSV dataset inside the 'dataset/' folder at project root."
            )

        # 1. Load CSV
        df = pd.read_csv(self.file_path)

        # 2. Validate required columns
        self.validate_columns(df)

        # 3. Parse dates into pandas datetime without derived columns
        df["Order Date"] = pd.to_datetime(df["Order Date"], format="mixed", dayfirst=True)
        df["Ship Date"] = pd.to_datetime(df["Ship Date"], format="mixed", dayfirst=True)

        # 4. Clean text columns by stripping whitespace (numerical values untouched)
        for col in df.columns:
            if pd.api.types.is_string_dtype(df[col]) or df[col].dtype == "object":
                df[col] = df[col].astype(str).str.strip()

        self._df = df
        return self._df

    def get_data(self) -> pd.DataFrame:
        """Exposes the loaded DataFrame. Loads dataset on demand if not already loaded."""
        if self._df is None:
            return self.load()
        return self._df


# Global singleton instance to ensure single loading on application startup
_loader_instance: Optional[DatasetLoader] = None


def get_dataset_loader(file_path: Optional[str] = None) -> DatasetLoader:
    """Returns the singleton instance of DatasetLoader."""
    global _loader_instance
    if _loader_instance is None:
        _loader_instance = DatasetLoader(file_path=file_path)
    return _loader_instance
