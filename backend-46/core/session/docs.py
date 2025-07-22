from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

session_id_query_param = openapi.Parameter(
    name="session_id",
    in_=openapi.IN_QUERY,
    type=openapi.TYPE_STRING,
    required=True,
    description="Session ID passed as a query parameter.",
)

get_db_schema_info_doc = swagger_auto_schema(
    manual_parameters=[session_id_query_param],
)

get_db_schema_valid_doc = swagger_auto_schema(
    manual_parameters=[session_id_query_param],
)


def patch_session_info_doc(view_method):
    return swagger_auto_schema(
        operation_description="Partially update SessionInfo for a given session.",
        manual_parameters=[
            openapi.Parameter(
                name="session_id",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description="Session ID passed as a query parameter.",
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "session": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format="uuid",
                    description="Session ID (UUID) as a hex string",
                ),
                "template": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the associated Template (nullable)",
                ),
                "db_name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Database name (max length: 20 characters)",
                ),
            },
            required=["session"],
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successful update of SessionInfo",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "session": openapi.Schema(
                            type=openapi.TYPE_STRING, format="uuid"
                        ),
                        "template": openapi.Schema(
                            type=openapi.TYPE_INTEGER, nullable=True
                        ),
                        "db_name": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid request data or missing query session_id",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(
                description="Missing cookie session_id or session ID mismatch",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(
                description="Session or SessionInfo not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
        },
    )(view_method)
