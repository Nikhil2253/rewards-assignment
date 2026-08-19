from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schema.reward import (
    BalanceResponse,
    RedeemRequest,
    RedeemResponse,
    RewardOut,
)
from app.service import reward_service

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/balance", response_model=BalanceResponse)
def get_balance(db: Session = Depends(get_db)):
    balance = reward_service.get_balance(db)
    return BalanceResponse(coin_balance=balance)


@router.get("", response_model=list[RewardOut])
def list_rewards(db: Session = Depends(get_db)):
    return reward_service.get_rewards(db)


@router.post("/redeem", response_model=RedeemResponse)
def redeem(payload: RedeemRequest, db: Session = Depends(get_db)):
    try:
        new_balance, reward_name, coins_spent = reward_service.redeem_reward(
            db, payload.reward_id
        )
    except reward_service.RewardNotFound:
        raise HTTPException(status_code=404, detail="Reward not found")
    except reward_service.InsufficientBalance:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")

    return RedeemResponse(
        success=True,
        new_balance=new_balance,
        reward_name=reward_name,
        coins_spent=coins_spent,
    )

@router.get("/balance")
def get_balance(db: Session = Depends(get_db)):
    balance = reward_service.get_coin_balance(db)
    return {"balance": balance}