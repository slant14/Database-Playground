from rest_framework.response import Response


class ExceptionWithResponse(Exception):
    def __init__(self, data, status: int):
        self.response = Response(data, status=status)
