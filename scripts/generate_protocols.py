#!/usr/bin/env python3
"""
Generate the 6 Ascend60 addiction-recovery protocol JSON files.

Each file conforms to the runtime `ProtocolDefinition` type
(src/types/protocol.ts): a 60-day program split into 3 neuroscience-based
phases that the existing protocolLoader / Index.tsx already know how to render.

Phase mapping (phaseBoundaries = [14, 28]):
  • Phase 0  — Days 1-14  — Detox & Foundation  ("Breaking the Cycle")
  • Phase 1  — Days 15-28 — Rewiring the Brain
  • Phase 2  — Days 29-60 — Building a New Identity

Task categories used: physical | mindfulness | cbt | social | reflection | faith
Task shape: { id, emoji, title, note, xp, cat, hour }
"""
import json
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "protocols")
os.makedirs(OUT_DIR, exist_ok=True)


# Standard unlock set — ids "phase2"/"phase3"/"alarm" are required by Index.tsx.
def make_unlocks(identity_name):
    return [
        {"id": "study", "name": "Recovery Library", "emoji": "📚",
         "blurb": "Daily neuroscience lessons on habit change & the brain.", "requireDay": 1},
        {"id": "faith", "name": "Reflection Vault", "emoji": "🕯️",
         "blurb": "Affirmations, prayers & grounding practices for any moment.", "requireDay": 1},
        {"id": "cravings", "name": "Urge Toolkit", "emoji": "🌊",
         "blurb": "SOBER breathing + 10 tools to surf any craving in 5 minutes.", "requireStreak": 2},
        {"id": "identity", "name": identity_name, "emoji": "🧭",
         "blurb": "Your new-identity blueprint unlocks after two weeks of proof.", "requireDay": 14},
        {"id": "phase2", "name": "Rewiring Protocol", "emoji": "🔁",
         "blurb": "Phase 2 unlocks at Day 15 — new routines replace old loops.", "requireDay": 15},
        {"id": "phase3", "name": "New Identity Protocol", "emoji": "👑",
         "blurb": "The final phase. Day 29+ — you become the person, not the streak.", "requireDay": 29},
        {"id": "alarm", "name": "Alarm Mode", "emoji": "🚨",
         "blurb": "Loud alarm + check-in dialog for high-risk moments.", "requireStreak": 3},
    ]


def make_phases(track):
    """Build the 3 Phase objects. Macro fields are repurposed as recovery
    'vitals' strings (they only render on the looksmax Plan tab, so for recovery
    tracks they act as concise self-documenting guidance)."""
    p = track["phases"]
    common_vitals = {
        "kcal": track.get("vital1", "Sleep 7-9 hrs"),
        "protein": track.get("vital2", "Hydrate 2-3 L/day"),
        "carbs": track.get("vital3", "Move 20+ min/day"),
        "fat": track.get("vital4", "Connect daily"),
        "split": track.get("vital5", "Breathe before you act"),
    }
    ranks = ["Day One", "Rewiring", "New Self"]
    weeks = [("Weeks 1-2", [1, 2]), ("Weeks 3-4", [3, 4]), ("Weeks 5-8", [5, 8])]
    phases = []
    for i in range(3):
        phases.append({
            "id": i, "label": f"P{i+1}", "weeks": weeks[i][0], "weekRange": weeks[i][1],
            "title": p[i]["title"], "tag": p[i]["tag"], "vibe": p[i]["vibe"],
            "rank": ranks[i], **common_vitals,
        })
    return phases


def build_protocol(track):
    return {
        "id": track["id"],
        "addictionType": track["addictionType"],
        "name": track["name"],
        "tagline": track["tagline"],
        "description": track["description"],
        "icon": track["icon"],
        "color": track["color"],
        "durationDays": 60,
        "phases": make_phases(track),
        "dailyTasks": {
            "0": track["tasks0"],
            "1": track["tasks1"],
            "2": track["tasks2"],
        },
        "quotes": track["quotes"],
        "unlocks": make_unlocks(track["identityName"]),
        "phaseBoundaries": [14, 28],
    }


from tracks_content import TRACKS  # noqa: E402


def main():
    written = []
    for track in TRACKS:
        proto = build_protocol(track)
        path = os.path.join(OUT_DIR, f"{track['id']}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(proto, f, indent=2, ensure_ascii=False)
        written.append(os.path.abspath(path))
    print("Wrote:")
    for w in written:
        print("  " + w)


if __name__ == "__main__":
    main()
