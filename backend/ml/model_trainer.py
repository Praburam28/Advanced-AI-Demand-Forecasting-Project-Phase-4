import numpy as np

from sklearn.linear_model import (
    LinearRegression,
    Ridge,
    Lasso
)

from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
    ExtraTreesRegressor
)

from sklearn.tree import DecisionTreeRegressor

from sklearn.svm import SVR

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error
)

from sklearn.model_selection import train_test_split


def prepare_data(values):
    X = np.array(
        range(len(values))
    ).reshape(-1, 1)

    y = np.array(values)

    return train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )


def calculate_metrics(
    y_true,
    y_pred
):
    mae = mean_absolute_error(
        y_true,
        y_pred
    )

    mse = mean_squared_error(
        y_true,
        y_pred
    )

    rmse = np.sqrt(mse)

    return mae, mse, rmse


def calculate_confidence(
    mae,
    avg_value
):
    avg_value = max(avg_value, 1)

    error_percentage = (
        mae / avg_value
    ) * 100

    confidence = max(
        0,
        min(100, 100 - error_percentage)
    )

    return round(confidence, 2)


def train_model(
    model,
    values
):
    X_train, X_test, y_train, y_test = prepare_data(
        values
    )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    future_index = np.array(
        [[len(values)]]
    )

    future_prediction = model.predict(
        future_index
    )[0]

    return (
        future_prediction,
        y_test,
        predictions
    )


def train_linear_regression(values):
    model = LinearRegression()

    return train_model(
        model,
        values
    )


def train_random_forest(values):
    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    return train_model(
        model,
        values
    )


def train_decision_tree(values):
    model = DecisionTreeRegressor(
        random_state=42
    )

    return train_model(
        model,
        values
    )


def train_gradient_boosting(values):
    model = GradientBoostingRegressor(
        random_state=42
    )

    return train_model(
        model,
        values
    )


def train_extra_trees(values):
    model = ExtraTreesRegressor(
        n_estimators=100,
        random_state=42
    )

    return train_model(
        model,
        values
    )


def train_ridge_regression(values):
    model = Ridge()

    return train_model(
        model,
        values
    )


def train_lasso_regression(values):
    model = Lasso()

    return train_model(
        model,
        values
    )


def train_svr(values):
    model = SVR()

    return train_model(
        model,
        values
    )