<<<<<<< HEAD
import logging
=======
>>>>>>> origin
import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:
<<<<<<< HEAD

    try:
        req_body = req.get_json()

    except ValueError:
        pass

    else:
        deposit_amount = req_body.get('amount')
        interest_rate = deposit_amount * 0.02

        amount_with_interest = deposit_amount + interest_rate
        return func.HttpResponse( status_code=200, body=json.dumps({"amount_with_interest": amount_with_interest}) )
=======
    try:
        req_body = req.get_json()
    except ValueError:
        pass
    else:
        amount = float(req_body.get('depositAmount'))
        interest_rate = amount * 0.02
        final_amount = amount + interest_rate
        return func.HttpResponse(status_code=200, body=json.dumps({"amount": final_amount}))
>>>>>>> origin


