<<<<<<< HEAD
import logging

import azure.functions as func
=======
import azure.functions as func
import json
>>>>>>> origin


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
<<<<<<< HEAD

# def main(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info('Python HTTP trigger function processed a request.')

#     name = req.params.get('name')
#     if not name:
#         try:
#             req_body = req.get_json()
#         except ValueError:
#             pass
#         else:
#             name = req_body.get('name')

#     if name:
#         return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
#     else:
#         return func.HttpResponse(
#              "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
#              status_code=200
#         )
=======
>>>>>>> origin
