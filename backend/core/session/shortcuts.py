from rest_framework.request import Request
from rest_framework.response import Response

from .exceptions import ExceptionWithResponse


def resolve_session_id(request: Request) -> tuple[str, None] | tuple[None, Response]:
    query_session_id = request.query_params.get("session_id")
    cookie_session_id = request.COOKIES.get("session_id")

    try:
        if not query_session_id:
            raise ExceptionWithResponse({"detail": "Missing query session_id."}, status=400)
        if not cookie_session_id:
            raise ExceptionWithResponse({"detail": "Missing cookie session_id."}, status=401)
        if query_session_id != cookie_session_id:
            raise ExceptionWithResponse({"detail": "Session ID mismatch."}, status=401)

    except ExceptionWithResponse as e:
        return None, e.response
        
    return query_session_id, None
