import pandas as pd


def load_dataset(file_path):
    if file_path.endswith(".csv"):
        return pd.read_csv(file_path)

    return pd.read_excel(file_path)


def detect_numeric_column(df, possible_names):
    for col in df.columns:
        if col.lower() in possible_names:
            return col

    numeric_columns = df.select_dtypes(include=["number"]).columns

    if len(numeric_columns) > 0:
        return numeric_columns[0]

    return None


def generate_product_recommendation(df):
    product_col = None

    for col in df.columns:
        if col.lower() in ["product", "product_name", "item", "item_name"]:
            product_col = col
            break

    demand_col = detect_numeric_column(
        df,
        ["demand", "sales", "quantity", "units_sold", "orders"]
    )

    if product_col and demand_col:
        top_products = (
            df.groupby(product_col)[demand_col]
            .sum()
            .sort_values(ascending=False)
            .head(3)
        )

        products = ", ".join(top_products.index.astype(str).tolist())

        return f"High-demand products detected: {products}. Focus stock planning and promotions on these products."

    return "Product-level demand pattern could not be identified clearly. Add product and demand columns for better recommendations."


def analyze_buying_behavior(df):
    demand_col = detect_numeric_column(
        df,
        ["demand", "sales", "quantity", "units_sold", "orders"]
    )

    if not demand_col:
        return "Buying behavior could not be analyzed because no demand/sales column was found."

    avg_demand = df[demand_col].mean()
    max_demand = df[demand_col].max()
    min_demand = df[demand_col].min()

    if max_demand > avg_demand * 1.5:
        return "Customer buying behavior shows strong peak demand periods. Consider targeted campaigns and stock preparation."

    if min_demand < avg_demand * 0.5:
        return "Buying behavior shows low-demand periods. Consider discounts or promotional bundles."

    return "Customer buying behavior appears stable with consistent demand patterns."


def generate_inventory_optimization(df):
    demand_col = detect_numeric_column(
        df,
        ["demand", "sales", "quantity", "units_sold", "orders"]
    )

    stock_col = None

    for col in df.columns:
        if col.lower() in ["stock", "inventory", "available_stock", "current_stock"]:
            stock_col = col
            break

    if demand_col and stock_col:
        avg_demand = df[demand_col].mean()
        avg_stock = df[stock_col].mean()

        if avg_stock < avg_demand:
            return "Inventory is lower than average demand. Increase stock levels to prevent shortages."

        if avg_stock > avg_demand * 2:
            return "Inventory appears higher than demand. Reduce overstock and optimize procurement."

        return "Inventory level is balanced with current demand."

    return "Inventory optimization needs both demand and stock columns for accurate suggestions."