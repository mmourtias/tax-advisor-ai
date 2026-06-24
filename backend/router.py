import asyncio

from fastapi import APIRouter

from schemas import TaxForm
from services.llm_services import get_tax_advice

router = APIRouter()


@router.post("/tax-advice")
async def tax_advice(data: TaxForm):
    advice = await asyncio.to_thread(get_tax_advice, data)
    return {"advice": advice}
