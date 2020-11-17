import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:

    try:
        req_body = req.get_json()

    except ValueError:
        pass
    
    else:
        loan = req_body.get('loan')
        account_amount = req_body.get('amount')

        if loan > (account_amount * 0.75):
            return func.HttpResponse("Loan exceeds 75% of the account amount", status_code=403)
        else:
            return func.HttpResponse("Loan accepted", status_code=200)
