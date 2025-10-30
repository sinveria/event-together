from fastapi import FastAPI
from backend.app.api.endpoints import auth, events, groups, chat, attendance, users

app = FastAPI(
    title="EventTogether API",
    description="API для управления событиями и группами",
    version="0.1.0"
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/health")
def health_check():
    return {"status": "ok"}