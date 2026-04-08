from fastapi import APIRouter, Response
from fastapi.responses import PlainTextResponse
from datetime import datetime
from typing import List

router = APIRouter()

@router.get("/sitemap.xml", response_class=PlainTextResponse)
async def get_sitemap():
    
    routes = [
        {"loc": "/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "/events", "priority": "0.9", "changefreq": "daily"},
        {"loc": "/groups", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "/about", "priority": "0.7", "changefreq": "monthly"},
    ]
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for route in routes:
        xml += '  <url>\n'
        xml += f'    <loc>https://eventtogether.ru{route["loc"]}</loc>\n'
        xml += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
        xml += f'    <changefreq>{route["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{route["priority"]}</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    return Response(content=xml, media_type="application/xml")

@router.get("/robots.txt", response_class=PlainTextResponse)
async def get_robots():
    robots = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /profile/
Disallow: /auth/

Sitemap: https://eventtogether.ru/sitemap.xml
"""
    return robots