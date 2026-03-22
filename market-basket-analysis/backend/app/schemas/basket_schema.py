from pydantic import BaseModel
from typing import List

class Basket(BaseModel):
    items: List[str]