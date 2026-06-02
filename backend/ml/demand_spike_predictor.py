def predict_demand_spike(values):
    if not values or len(values) < 5:
        return "Insufficient Data", 50.0

    avg_value = sum(values) / len(values)
    latest_value = values[-1]

    if latest_value > avg_value * 1.5:
        return "High Spike Risk", 85.0

    if latest_value > avg_value * 1.2:
        return "Medium Spike Risk", 70.0

    return "Low Spike Risk", 60.0


def predict_low_stock(demand_values, stock_values):
    if not demand_values or not stock_values:
        return "Unknown Stock Risk", 50.0

    avg_demand = sum(demand_values) / len(demand_values)
    latest_stock = stock_values[-1]

    if latest_stock < avg_demand:
        return "High Low-Stock Risk", 85.0

    if latest_stock < avg_demand * 1.5:
        return "Medium Low-Stock Risk", 70.0

    return "Low Low-Stock Risk", 60.0