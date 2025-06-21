from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from .serializers import MinTemplateSerializer

session_id_query_param = openapi.Parameter(
    name='session_id',
    in_=openapi.IN_QUERY,
    type=openapi.TYPE_STRING,
    required=True,
    description='Session ID passed as a query parameter.'
)
post_template_schema = swagger_auto_schema(
    operation_description="Create a new template. Requires session_id as query param and cookie.",
    manual_parameters=[session_id_query_param],
    request_body=MinTemplateSerializer,
    responses={
        201: openapi.Response("Template created successfully", MinTemplateSerializer),
        400: "Bad Request",
        401: "Unauthorized"
    }
)