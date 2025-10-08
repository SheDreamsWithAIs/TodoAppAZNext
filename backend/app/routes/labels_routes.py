from fastapi import APIRouter, HTTPException
from typing import List as TypeList
from beanie import PydanticObjectId

from app.models.label import Label

router = APIRouter(tags=["labels"])


def normalize(name: str) -> str:
    return name.strip().lower()


@router.get("/", response_model=TypeList[Label])
async def list_labels(limit: int = 100):
    labels = await Label.find_all().sort(Label.created_at).limit(limit).to_list()
    return labels


@router.post("/", response_model=Label, status_code=201)
async def create_label(name: str, color: str | None = None):
    name_key = normalize(name)
    # TODO: scope by user_id when auth is present
    exists = await Label.find_one(Label.name_normalized == name_key)
    if exists:
        raise HTTPException(status_code=409, detail="Label name already exists")
    label = Label(name=name, name_normalized=name_key, color=color)
    await label.create()
    return label


@router.patch("/{label_id}", response_model=Label)
async def update_label(label_id: PydanticObjectId, name: str | None = None, color: str | None = None):
    label = await Label.get(label_id)
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")
    update = {}
    if name is not None:
        key = normalize(name)
        dup = await Label.find_one(Label.name_normalized == key, Label.id != label.id)
        if dup:
            raise HTTPException(status_code=409, detail="Label name already exists")
        update["name"] = name
        update["name_normalized"] = key
    if color is not None:
        update["color"] = color
    if update:
        await label.update({"$set": update})
    return await Label.get(label_id)


@router.delete("/{label_id}", status_code=204)
async def delete_label(label_id: PydanticObjectId):
    label = await Label.get(label_id)
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")
    await label.delete()
    return None


