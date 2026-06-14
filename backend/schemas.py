from pydantic import BaseModel
from pydantic.alias_generators import to_camel

class TaxForm(BaseModel):
    model_config = {"alias_generator": to_camel, "populate_by_name": True}
    country: str
    income: float
    expenses: float
    employment_status: str
    marital_status: str
    number_of_children: int