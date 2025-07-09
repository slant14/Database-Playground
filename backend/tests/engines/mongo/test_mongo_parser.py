from collections import OrderedDict as OD
from datetime import datetime

from core.engines.mongo import parsing as parsing
from core.engines.mongo.parsing import MQT

AGGREGATE_RJSON = """
[
   {
      $match: { size: "medium" }
   },
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   }
]
"""

INSERT_RJSON = """
[
  {
    _id: 1,
    customer: "Alice",
    items: [
      { product: "Pen", quantity: 2, price: 1.20 },
      { product: "Notebook", quantity: 1, price: 3.50 }
    ],
    date: ISODate("2024-07-01T10:00:00Z"),
    status: "shipped"
  },
  {
    _id: 2,
    customer: "Bob",
    items: [
      { product: "Pen", quantity: 1, price: 1.20 },
      { product: "Eraser", quantity: 3, price: 0.50 }
    ],
    date: ISODate("2023-07-02T11:30:00Z"),
    status: "pending"
  },
  {
    _id: 3,
    customer: "Alice",
    items: [
      { product: "Pen", quantity: 5, price: 1.10 }
    ],
    date: ISODate("2023-07-03T09:00:00Z"),
    status: "delivered"
  }
]
"""


def test_dict_ordered_dict():
    data = [{
        "key": "value",
        "key_2": "value_2",
    }]
    assert data == [OD(key_2="value_2", key="value")]


def test_parse_aggregate():
    data = parsing.parse_rjson(AGGREGATE_RJSON)
    assert data == [
      {"$match": {"size": "medium"}},
      {"$group": {"_id": "$name", "totalQuantity": {"$sum": "$quantity"}}}
    ]


def test_parse_insert():
    data = parsing.parse_rjson(INSERT_RJSON)
    assert data == [
      {
        "_id": 1,
        "customer": "Alice",
        "items": [
          {"product": "Pen", "quantity": 2, "price": 1.20},
          {"product": "Notebook", "quantity": 1, "price": 3.50}
        ],
        "date": datetime.fromisoformat("2024-07-01T10:00:00Z"),
        "status": "shipped"
      },
      {
        "_id": 2,
        "customer": "Bob",
        "items": [
          {"product": "Pen", "quantity": 1, "price": 1.20},
          {"product": "Eraser", "quantity": 3, "price": 0.50}
        ],
        "date": datetime.fromisoformat("2023-07-02T11:30:00Z"),
        "status": "pending"
      },
      {
        "_id": 3,
        "customer": "Alice",
        "items": [
          {"product": "Pen", "quantity": 5, "price": 1.10}
        ],
        "date": datetime.fromisoformat("2023-07-03T09:00:00Z"),
        "status": "delivered"
      }
    ]


def test_determine_query_type():
    assert parsing._determine_query_type(
        "db.my_collection.drop();") == MQT.DROP_COLLECTION
    assert parsing._determine_query_type(
        "db.my_collection.drop({some bullshit});") == MQT.DROP_COLLECTION
    assert parsing._determine_query_type(
        "db.my_collection.insertOne({some bullshit});") == MQT.INSERT_ONE
    assert parsing._determine_query_type(
        "db.my_collection.insertMany("
        "[{some bullshit}, {some more bullshit}]"
        ");") == MQT.INSERT_MANY
    assert parsing._determine_query_type(
        "db.my_collection.find({some bullshit});") == MQT.FIND


def test_extract_collection_name():
    assert parsing.extract_collection_name(
        "  \t db.my_collection.drop();") == "my_collection"
    assert parsing.extract_collection_name(
        "   \n db.nohypo.insertOne();") == "nohypo"


def test_parse_mql():
    MQL_QUERY = """
    db.new_collection.insertOne({
      key_1: "val_1",
      key_2: 54,
      key_3: ISODate("2023-07-03T09:00:00Z")
    })
    """
    queries = parsing.parse_mql(MQL_QUERY)
    assert len(queries) == 1
    assert queries[0].type == MQT.INSERT_ONE
    assert queries[0].input == {
        "key_1": "val_1",
        "key_2": 54,
        "key_3": datetime.fromisoformat("2023-07-03T09:00:00Z")
    }
