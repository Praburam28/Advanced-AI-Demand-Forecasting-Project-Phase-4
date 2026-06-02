import pandas as pd
import numpy as np

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    mean_absolute_percentage_error,
    r2_score
)

from app.ml.model_trainer import (
    train_linear_regression,
    train_random_forest,
    train_decision_tree,
    train_gradient_boosting,
    train_extra_trees,
    train_ridge_regression,
    train_lasso_regression,
    train_svr
)


def extract_demand_column(file_path):
    df = (
        pd.read_csv(file_path)
        if file_path.endswith(".csv")
        else pd.read_excel(file_path)
    )

    possible_columns = [
        "demand",
        "sales",
        "quantity",
        "units_sold",
        "orders"
    ]

    for col in df.columns:
        if col.lower() in possible_columns:
            return (
                df[col]
                .dropna()
                .astype(float)
                .tolist()
            )

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    if len(numeric_columns) == 0:
        raise ValueError(
            "No numeric demand column found"
        )

    return (
        df[numeric_columns[0]]
        .dropna()
        .astype(float)
        .tolist()
    )


def get_model_prediction(
    model_name,
    values
):
    if model_name == "random_forest":
        return train_random_forest(values)

    elif model_name == "decision_tree":
        return train_decision_tree(values)

    elif model_name == "gradient_boosting":
        return train_gradient_boosting(values)

    elif model_name == "extra_trees":
        return train_extra_trees(values)

    elif model_name == "ridge_regression":
        return train_ridge_regression(values)

    elif model_name == "lasso_regression":
        return train_lasso_regression(values)

    elif model_name == "svr":
        return train_svr(values)

    else:
        return train_linear_regression(values)


def calculate_confidence(
    mae,
    rmse,
    r2,
    avg_value
):
    avg_value = max(avg_value, 1)

    mae_score = max(
        0,
        100 - ((mae / avg_value) * 100)
    )

    rmse_score = max(
        0,
        100 - ((rmse / avg_value) * 100)
    )

    r2_percentage = max(
        0,
        min(100, r2 * 100)
    )

    confidence = (
        (mae_score * 0.3) +
        (rmse_score * 0.4) +
        (r2_percentage * 0.3)
    )

    return round(
        min(confidence, 99.5),
        2
    )
def generate_prediction(
    file_path,
    model_name="linear_regression"
):
    values = extract_demand_column(
        file_path
    )

    if len(values) < 5:
        raise ValueError(
            "Dataset must contain at least 5 numeric values"
        )

    prediction, y_true, y_pred = get_model_prediction(
        model_name,
        values
    )

    mae = mean_absolute_error(
        y_true,
        y_pred
    )

    mse = mean_squared_error(
        y_true,
        y_pred
    )

    rmse = np.sqrt(mse)

    mape = (
        mean_absolute_percentage_error(
            y_true,
            y_pred
        ) * 100
    )

    r2 = r2_score(
        y_true,
        y_pred
    )

    avg_value = (
        sum(values) / len(values)
    )

    confidence = calculate_confidence(
    mae,
    rmse,
    r2,
    avg_value
    )

    if prediction > avg_value * 1.1:
        trend = "Increasing Demand"

        recommendation = (
            "Demand is expected to increase significantly. "
            "Increase inventory, optimize procurement planning, "
            "and prepare supply chain operations."
        )

    elif prediction < avg_value * 0.9:
        trend = "Decreasing Demand"

        recommendation = (
            "Demand is expected to decrease. "
            "Reduce overstock risk and optimize warehouse utilization."
        )

    else:
        trend = "Stable Demand"

        recommendation = (
            "Demand appears stable. "
            "Maintain current inventory planning strategy."
        )

    low_stock_prediction = (
        prediction > avg_value * 1.2
    )

    demand_spike_prediction = (
        prediction > avg_value * 1.3
    )

    inventory_suggestion = (
        "Increase stock allocation"
        if prediction > avg_value
        else "Maintain optimized inventory"
    )

    return {
        "predicted_demand": round(
            float(prediction),
            2
        ),

        "confidence_score": confidence,

        "mae": round(
            float(mae),
            2
        ),

        "mse": round(
            float(mse),
            2
        ),

        "rmse": round(
            float(rmse),
            2
        ),

        "mape": round(
            float(mape),
            2
        ),

        "r2_score": round(
            float(r2),
            4
        ),

        "trend": trend,

        "recommendation": recommendation,

        "low_stock_prediction": low_stock_prediction,

        "demand_spike_prediction": demand_spike_prediction,

        "inventory_optimization_suggestion": inventory_suggestion
    }