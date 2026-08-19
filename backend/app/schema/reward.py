from pydantic import BaseModel


class RewardOut(BaseModel):
    id: int
    name: str
    description: str | None
    coin_cost: int

    class Config:
        from_attributes = True


class BalanceResponse(BaseModel):
    coin_balance: int


class RedeemRequest(BaseModel):
    reward_id: int


class RedeemResponse(BaseModel):
    success: bool
    new_balance: int
    reward_name: str
    coins_spent: int