from pydantic import BaseModel

class ContentDTO(BaseModel):
    email : str
    id : int