from fastapi import Request
from fastapi.responses import JSONResponse


async def value_error_handler(request: Request, error: ValueError):
    return JSONResponse(status_code=400, content={"message": str(error)})
