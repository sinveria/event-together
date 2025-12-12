from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.api.core.db import get_db
from backend.app.api.models.category import Category
from backend.app.api.models.user import User
from backend.app.api.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from backend.app.api.core.security import check_admin_or_moderator

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    db: Session = Depends(get_db)
):
    """Получить все категории (доступно всем)"""
    categories = db.query(Category).order_by(Category.name).all()
    return categories

@router.post("/", response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_moderator)
):
    """Создать новую категорию (только админ/модератор)"""
    existing_category = db.query(Category).filter(Category.name == category_data.name).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    db_category = Category(**category_data.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_moderator)
):
    """Обновить категорию (только админ/модератор)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category_data.name and category_data.name != category.name:
        existing_category = db.query(Category).filter(
            Category.name == category_data.name,
            Category.id != category_id
        ).first()
        if existing_category:
            raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    update_data = category_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_or_moderator)
):
    """Удалить категорию (только админ/модератор)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category.events:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete category with events. Reassign events first."
        )
    
    db.delete(category)
    db.commit()
    return {"message": f"Category {category_id} deleted successfully"}