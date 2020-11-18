import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:

    try:
        req_body = req.get_json()

    except ValueError:
        pass

    else:
        amount = float(req_body.get('depositAmount'))
        interest_rate = amount * 0.02

        final_amount = amount + interest_rate
        return func.HttpResponse( status_code=200, body=json.dumps({"amount": final_amount}) )

