from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


session_id_query_param = openapi.Parameter(
    name='session_id',
    in_=openapi.IN_QUERY,
    type=openapi.TYPE_STRING,
    required=True,
    description='Session ID passed as a query parameter.'
)

get_db_schema_doc = swagger_auto_schema(
    manual_parameters=[session_id_query_param],
)

put_db_schema_doc = swagger_auto_schema(
    manual_parameters=[session_id_query_param],
)

post_db_query_doc = swagger_auto_schema(
    manual_parameters=[session_id_query_param],
    request_body=openapi.Schema(
        type=openapi.TYPE_STRING,
        description="Raw plain text query"
    ),
)