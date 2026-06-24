from typing import Literal

from pydantic import BaseModel, Field
from pydantic.alias_generators import to_camel


class TaxForm(BaseModel):
    model_config = {"alias_generator": to_camel, "populate_by_name": True}

    country: str = Field(min_length=1)
    income: float = Field(ge=0)
    expenses: float = Field(ge=0)
    employment_status: Literal["employee", "self-employed"]
    marital_status: Literal["single", "married"]
    number_of_children: int = Field(ge=0)
