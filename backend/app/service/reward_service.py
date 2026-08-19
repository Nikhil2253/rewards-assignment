from sqlalchemy.orm import Session

from app.model.reward import Reward
from app.model.redemption import Redemption
from app.model.user import User


class RewardNotFound(Exception):
    pass


class InsufficientBalance(Exception):
    pass


def get_current_user(db: Session) -> User:
    # No auth in this assignment — single demo user seeded.
    user = db.query(User).first()
    if user is None:
        raise RuntimeError("No user found. Did you run the seed script?")
    return user


def get_balance(db: Session) -> int:
    user = get_current_user(db)
    return user.coin_balance


def get_rewards(db: Session):
    return db.query(Reward).filter(Reward.active.is_(True)).all()


def redeem_reward(db: Session, reward_id: int):
    user = get_current_user(db)

    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.active.is_(True),
    ).first()

    if reward is None:
        raise RewardNotFound(f"Reward {reward_id} not found")

    if user.coin_balance < reward.coin_cost:
        raise InsufficientBalance(
            f"Balance {user.coin_balance} is less than cost {reward.coin_cost}"
        )

    user.coin_balance -= reward.coin_cost

    redemption = Redemption(
        user_id=user.id,
        reward_id=reward.id,
        coins_spent=reward.coin_cost,
    )
    db.add(redemption)

    db.commit()
    db.refresh(user)

    return user.coin_balance, reward.name, reward.coin_cost