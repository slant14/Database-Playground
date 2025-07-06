## Description

<!--
A brief, one or two-sentence summary of the purpose of this PR.
What is the goal? Why is this change being made?

Example:

This PR introduces a new "like" feature for videos, allowing authenticated users to like and unlike a video.
-->

## Related Issue

<!-- Link the type `Task` issue that this PR resolves. -->

- Closes #

## Subtasks Checklist

<!--
Copy the `Subtasks` list from the issue and update it here to match the work done (you can add, remove, or rephrase items).
Check off items completed in this pull request.
For each unchecked or modified item, add a brief, indented explanation below it.

Example:

- [x] Create the POST /api/v1/video/{id}/toggle-like route and its controller function.
  - Modified the route from /like to /toggle-like to better reflect its function after implementation changes.
- [x] Implement the LikeService logic to handle a toggle for like/unlike operations.
  - This was updated from the original plan. A single endpoint that handles both liking and unliking is more efficient than separate endpoints.
- [x] Add database migration for the new `video_likes` table.
  - This step was added as it was discovered during implementation that a new join table was required to track likes per user.
- [x] Apply JWT authentication middleware to the new like route to ensure it's protected.
- [x] Write unit tests for LikeService covering all scenarios.
- [ ] Document the new endpoint in the OpenAPI/Swagger spec.
  - This will be handled in a separate PR (#135) dedicated to updating all API documentation for the v1.2 release.
-->

## Verification of Acceptance Criteria

<!--
For each acceptance criterion from the related issue, describe how that criterion has been met and how the reviewer can verify it.

Example:

- [x] A `POST` route is created at `/api/v1/video/{id}/like`.
  - Check the routes/api.js file for the new route definition.
- [x] The route is protected and requires a valid JWT.
  - Send a POST request to http://localhost:3000/api/v1/video/1/like.
  - Do not include an Authorization header.
  - Assert that the response is a `401 Unauthorized`.
-->

### PR Checklist

- [ ] I have linked the related issue.
- [ ] My code follows the project's style guidelines.
- [ ] I have added or updated tests to cover my changes.
- [ ] All new and existing tests pass.
