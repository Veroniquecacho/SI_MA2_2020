import logging
import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:

    try:
        req_body = req.get_json()

    except ValueError:
        pass

    else:
        deposit_amount = req_body.get('amount')
        interest_rate = deposit_amount * 0.02

        amount_with_interest = deposit_amount + interest_rate
        return func.HttpResponse( status_code=200, body=json.dumps({"amount_with_interest": amount_with_interest}) )


