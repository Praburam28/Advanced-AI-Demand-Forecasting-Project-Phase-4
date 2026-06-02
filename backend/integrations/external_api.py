import requests


def test_external_connection(api_url: str, api_key: str = None):
    headers = {}

    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    try:
        response = requests.get(
            api_url,
            headers=headers,
            timeout=10
        )

        return {
            "success": response.status_code < 400,
            "status_code": response.status_code,
            "message": response.text[:300]
        }

    except Exception as e:
        return {
            "success": False,
            "status_code": 0,
            "message": str(e)
        }


def fetch_external_inventory(api_url: str, api_key: str = None):
    headers = {}

    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    response = requests.get(
        api_url,
        headers=headers,
        timeout=15
    )

    response.raise_for_status()

    return response.json()