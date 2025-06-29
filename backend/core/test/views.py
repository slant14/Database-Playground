from django.http import JsonResponse


# Create your views here.
def main_test(request):
    return JsonResponse({"who_deployed_succesfully": "you!"})
