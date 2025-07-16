# Error Handling Test Documentation

## Changes Made

### 1. Backend Changes

#### ChromaEngine.py
- **QueryParser.parse()** now checks for error responses from Haskell parser
- If response is `{"error": "error message"}`, it raises `ValueError` with the error message
- If response is not a list, it raises a parse error

#### chroma_api.py
- **query_parser()** now catches `ValueError` from parser
- Returns error in format: `{"results": [{"command": "PARSE_ERROR", "error": "error message"}]}`
- This prevents HTTP 400 errors and allows frontend to handle errors gracefully

#### views.py
- **ChromaQueryParser** now handles `PARSE_ERROR` command type
- Formats parse errors as single command responses for frontend

### 2. Frontend Changes

#### chromaResult.js
- **renderSingleResult()** now handles `PARSE_ERROR` command type
- Displays parse errors in red text: "Parse Error: {error message}"
- Passes full response object to response components (with execution_time, db_state, etc.)

## How It Works

### Error Flow
1. User enters invalid command: `ADD file name` (missing semicolon)
2. Haskell parser returns: `{"error": "unexpected end of input -> expecting ';' or white space"}`
3. QueryParser.parse() raises ValueError with the error message
4. chroma_api.py catches ValueError and returns: `{"results": [{"command": "PARSE_ERROR", "error": "unexpected end of input -> expecting ';' or white space"}]}`
5. Frontend displays: "Parse Error: unexpected end of input -> expecting ';' or white space"

### Test Cases

#### Valid Commands
- `ADD file name;` → Success
- `ADD file name 2 metadata:a=b;` → Success

#### Invalid Commands
- `ADD file name` → Parse Error: unexpected end of input -> expecting ';' or white space
- `ADD` → Parse Error: [appropriate error message]
- `INVALID COMMAND;` → Parse Error: [appropriate error message]

## Expected Behavior

1. **Parse errors** are now displayed clearly in red text
2. **Command errors** (like document not found) are handled by individual response components
3. **Network errors** still result in the generic "Please try once again" message
4. **Multiple command errors** are shown for each command individually
