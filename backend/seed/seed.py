import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.db.database import Base, SessionLocal, engine
from app.model import Redemption, Reward, Transaction, User


JSON_PATH = Path(__file__).parent / "transactions.json"

COINS_PER_RUPEES = 100
MAX_COINS_PER_TRANSACTION = 100


def parse_timestamp(value):
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value / 1000, tz=timezone.utc)

    value = str(value).strip()

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        pass

    for fmt in (
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y",
        "%Y-%m-%d",
    ):
        try:
            return datetime.strptime(value, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue

    raise ValueError(f"Unsupported timestamp format: {value}")


def calculate_coins(amount, status):
    if status != "SUCCESS":
        return 0

    coins = int(amount // COINS_PER_RUPEES)

    return min(coins, MAX_COINS_PER_TRANSACTION)


def load_transactions():
    with open(JSON_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, dict):
        data = data.get("transactions", [])

    return data


def seed():
    Base.metadata.create_all(bind=engine)

    transactions = load_transactions()

    if not transactions:
        raise ValueError("No transactions found in transactions.json")

    db = SessionLocal()

    try:
        db.query(Redemption).delete()
        db.query(Reward).delete()
        db.query(Transaction).delete()
        db.query(User).delete()

        total_coins = 0

        transaction_rows = []
        seen_ids = {}
        
        for item in transactions:
            amount = float(item["amount"])
            status = item["status"].upper()
        
            txn_id = item["id"]
            if txn_id in seen_ids:
                print(f"WARNING: duplicate transaction id {txn_id} in source data, overwriting earlier entry")
        
            transaction = Transaction(
                id=txn_id,
                timestamp=parse_timestamp(item["timestamp"]),
                merchant=item.get("merchant") or "Unknown Merchant",
                category=item.get("category") or "Uncategorized",
                amount=amount,
                currency=item.get("currency") or "INR",
                status=status,
                payment_method=item.get("payment_method") or "UNKNOWN",
            )
        
            seen_ids[txn_id] = transaction
        
        transaction_rows = list(seen_ids.values())
        total_coins = sum(calculate_coins(t.amount, t.status) for t in transaction_rows)

        db.add_all(transaction_rows)

        user = User(
            name="Demo User",
            email="demo@digitalalpha.com",
            coin_balance=total_coins,
        )

        db.add(user)

        rewards = [
            Reward(
                name="₹100 Shopping Voucher",
                description="Redeem for a ₹100 shopping voucher.",
                coin_cost=500,
            ),
            Reward(
                name="₹100 Food Voucher",
                description="Redeem for a ₹100 food voucher.",
                coin_cost=500,
            ),
            Reward(
                name="₹250 Cashback",
                description="Redeem for ₹250 cashback.",
                coin_cost=1000,
            ),
            Reward(
                name="Movie Voucher",
                description="Redeem for a movie voucher.",
                coin_cost=750,
            ),
            Reward(
                name="₹500 Travel Voucher",
                description="Redeem for a ₹500 travel voucher.",
                coin_cost=2000,
            ),
        ]

        db.add_all(rewards)

        db.commit()

        print("Seed completed successfully.")
        print(f"Transactions inserted: {len(transaction_rows)}")
        print(f"Initial coin balance: {total_coins}")
        print(f"Rewards inserted: {len(rewards)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()