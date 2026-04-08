from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.core.db import engine, Base, get_db
from app.api.models import user, event, group, chat, attendance
from app.api.endpoints import auth, events, groups, chat as chat_endpoints, attendance as attendance_endpoints, users, admin, category, maps, seo

app = FastAPI(
    title="EventTogether API",
    description="API для управления событиями и группами",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(chat_endpoints.router, prefix="/chat", tags=["Chat"])
app.include_router(attendance_endpoints.router, prefix="/attendance", tags=["Attendance"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(category.router, prefix="/categories", tags=["Categories"]) 
app.include_router(maps.router, prefix="/maps", tags=["Maps"])
app.include_router(seo.router, tags=["SEO"])

@app.get("/")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)