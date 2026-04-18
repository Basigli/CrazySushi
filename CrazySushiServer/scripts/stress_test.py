#!/usr/bin/env python3
"""Stress test the CrazySushi backend with concurrent HTTP requests.

The script creates or targets an order, fans out concurrent add/remove/
visualize/toggle-arrived requests, and prints a compact summary at the end.
It only depends on the Python standard library.
"""

from __future__ import annotations

import argparse
import json
import random
import threading
import time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib import error, request


DEFAULT_BASE_URL = "http://localhost:3001"


def post_json(base_url: str, path: str, payload: Dict[str, Any], timeout: float) -> Dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(
        f"{base_url.rstrip('/')}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with request.urlopen(req, timeout=timeout) as response:
        raw = response.read().decode("utf-8")
        return json.loads(raw)


@dataclass
class WorkloadState:
    order_id: str
    users: List[str]
    dishes: List[str]
    ledger: Dict[Tuple[str, str], int]
    lock: threading.Lock


def fetch_menu(base_url: str, timeout: float) -> List[str]:
    data = post_json(base_url, "/get-menu", {"user": "stress-test"}, timeout)
    menu = data.get("message", [])
    if not isinstance(menu, list) or not menu:
        raise RuntimeError("Backend returned an empty menu")

    dish_codes = []
    for item in menu:
        if isinstance(item, dict) and item.get("code"):
            dish_codes.append(str(item["code"]))
        elif isinstance(item, str):
            dish_codes.append(item)

    if not dish_codes:
        raise RuntimeError("Backend menu payload does not include dish codes")

    return dish_codes


def create_order(base_url: str, timeout: float, creator: str) -> str:
    data = post_json(base_url, "/create", {"user": creator}, timeout)
    order_id = str(data.get("message", "")).strip()
    if not order_id or order_id == "-1":
        raise RuntimeError("Failed to create an order")
    return order_id


def join_users(base_url: str, timeout: float, order_id: str, users: Iterable[str]) -> None:
    for user in users:
        data = post_json(base_url, "/join", {"user": user, "orderId": order_id}, timeout)
        if str(data.get("message", "")) == "-1":
            raise RuntimeError(f"Failed to join user {user!r} to order {order_id}")


def perform_add(base_url: str, timeout: float, state: WorkloadState, rng: random.Random) -> None:
    user = rng.choice(state.users)
    dish = rng.choice(state.dishes)
    quantity = rng.randint(1, 3)
    data = post_json(
        base_url,
        "/add",
        {"encryptedUid": user, "idOrdine": state.order_id, "idPiatto": dish, "qta": quantity},
        timeout,
    )
    if str(data.get("message", "")) == "-1":
        raise RuntimeError("Add request was rejected")

    with state.lock:
        state.ledger[(user, dish)] += quantity


def perform_remove(base_url: str, timeout: float, state: WorkloadState, rng: random.Random) -> None:
    with state.lock:
        candidates = [(user, dish, qty) for (user, dish), qty in state.ledger.items() if qty > 0]

    if not candidates:
        perform_add(base_url, timeout, state, rng)
        return

    user, dish, qty = rng.choice(candidates)
    quantity = rng.randint(1, min(3, qty))
    data = post_json(
        base_url,
        "/remove",
        {"encryptedUid": user, "idOrdine": state.order_id, "idPiatto": dish, "qta": quantity},
        timeout,
    )
    if str(data.get("message", "")) == "-1":
        raise RuntimeError("Remove request was rejected")

    with state.lock:
        current = state.ledger[(user, dish)]
        state.ledger[(user, dish)] = max(0, current - quantity)


def perform_toggle_arrived(base_url: str, timeout: float, state: WorkloadState, rng: random.Random) -> None:
    dish = rng.choice(state.dishes)
    signed = bool(rng.getrandbits(1))
    data = post_json(
        base_url,
        "/toggle-arrived",
        {"user": rng.choice(state.users), "orderId": state.order_id, "idPiatto": dish, "signed": signed},
        timeout,
    )
    if str(data.get("message", "")) == "-1":
        raise RuntimeError("Toggle-arrived request was rejected")


def perform_visualize(base_url: str, timeout: float, state: WorkloadState, rng: random.Random) -> None:
    data = post_json(base_url, "/visualize", {"user": rng.choice(state.users), "orderId": state.order_id}, timeout)
    result = data.get("message", [])
    if not isinstance(result, list):
        raise RuntimeError("Visualize returned an invalid payload")


def perform_get_meals(base_url: str, timeout: float, state: WorkloadState, rng: random.Random) -> None:
    data = post_json(base_url, "/get-meals", {"user": rng.choice(state.users), "orderId": state.order_id}, timeout)
    result = data.get("message", [])
    if not isinstance(result, list):
        raise RuntimeError("Get-meals returned an invalid payload")


def run_worker(
    worker_id: int,
    base_url: str,
    timeout: float,
    iterations: int,
    state: WorkloadState,
    seed: Optional[int],
) -> Counter:
    rng = random.Random((seed or int(time.time())) + worker_id)
    counts: Counter = Counter()

    for _ in range(iterations):
        roll = rng.random()

        try:
            if roll < 0.48:
                perform_add(base_url, timeout, state, rng)
                counts["add"] += 1
            elif roll < 0.72:
                perform_remove(base_url, timeout, state, rng)
                counts["remove"] += 1
            elif roll < 0.84:
                perform_toggle_arrived(base_url, timeout, state, rng)
                counts["toggle-arrived"] += 1
            elif roll < 0.94:
                perform_visualize(base_url, timeout, state, rng)
                counts["visualize"] += 1
            else:
                perform_get_meals(base_url, timeout, state, rng)
                counts["get-meals"] += 1
        except Exception as exc:  # noqa: BLE001
            counts["errors"] += 1
            counts[f"error:{type(exc).__name__}"] += 1

    return counts


def main() -> int:
    parser = argparse.ArgumentParser(description="Stress test the CrazySushi backend.")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help="Backend base URL")
    parser.add_argument("--timeout", type=float, default=5.0, help="Per-request timeout in seconds")
    parser.add_argument("--workers", type=int, default=12, help="Number of concurrent workers")
    parser.add_argument("--operations", type=int, default=400, help="Total number of requests to send")
    parser.add_argument("--users", type=int, default=8, help="Number of synthetic users to join")
    parser.add_argument("--dishes", type=int, default=12, help="Number of menu items to target")
    parser.add_argument("--order-id", help="Target an existing order instead of creating a new one")
    parser.add_argument("--seed", type=int, help="Random seed for reproducible runs")
    args = parser.parse_args()

    start = time.perf_counter()

    try:
        menu = fetch_menu(args.base_url, args.timeout)
    except error.URLError as exc:
        print(f"Could not reach backend at {args.base_url}: {exc}")
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"Failed to fetch menu: {exc}")
        return 1

    target_dishes = menu[: max(1, min(args.dishes, len(menu)))]
    users = [f"stress-user-{index + 1}" for index in range(max(1, args.users))]

    try:
        order_id = args.order_id or create_order(args.base_url, args.timeout, users[0])
        join_users(args.base_url, args.timeout, order_id, users[1:])
    except Exception as exc:  # noqa: BLE001
        print(f"Failed to prepare the order: {exc}")
        return 1

    state = WorkloadState(
        order_id=order_id,
        users=users,
        dishes=target_dishes,
        ledger=defaultdict(int),
        lock=threading.Lock(),
    )

    iterations_per_worker = max(1, args.operations // max(1, args.workers))
    remaining = args.operations - (iterations_per_worker * args.workers)

    counts: Counter = Counter()
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = []
        for worker_id in range(max(1, args.workers)):
            extra = 1 if worker_id < remaining else 0
            futures.append(
                executor.submit(
                    run_worker,
                    worker_id,
                    args.base_url,
                    args.timeout,
                    iterations_per_worker + extra,
                    state,
                    args.seed,
                )
            )

        for future in as_completed(futures):
            counts.update(future.result())

    elapsed = time.perf_counter() - start

    try:
        final_payload = post_json(args.base_url, "/visualize", {"user": users[0], "orderId": order_id}, args.timeout)
        final_meals = final_payload.get("message", [])
        final_total = sum(int(item.get("total", 0)) for item in final_meals if isinstance(item, dict))
    except Exception:  # noqa: BLE001
        final_total = -1

    summary = {
        "baseUrl": args.base_url,
        "orderId": order_id,
        "workers": max(1, args.workers),
        "operationsRequested": args.operations,
        "operationsExecuted": sum(value for key, value in counts.items() if key in {"add", "remove", "toggle-arrived", "visualize", "get-meals"}),
        "elapsedSeconds": round(elapsed, 3),
        "throughputOpsPerSecond": round(args.operations / elapsed, 2) if elapsed > 0 else None,
        "finalTotalReportedByVisualize": final_total,
        "counts": dict(counts),
    }

    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0 if counts.get("errors", 0) == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())