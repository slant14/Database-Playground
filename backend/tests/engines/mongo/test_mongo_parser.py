from core.engines import MongoParser
from collections import OrderedDict as OD


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
    data = MongoParser.parse_rjson(AGGREGATE_RJSON)
    assert data == [
      {"$match": {"size": "medium"}},
      {"$group": {"_id": "$name", "totalQuantity": {"$sum": "$quantity"}}}
    ]


def test_parse_insert():
    data = MongoParser.parse_rjson(INSERT_RJSON)
    assert data == [
      {
        "_id": 1,
        "customer": "Alice",
        "items": [
          {"product": "Pen", "quantity": 2, "price": 1.20},
          {"product": "Notebook", "quantity": 1, "price": 3.50}
        ],
        "date": 'ISODate("2024-07-01T10:00:00Z")',
        "status": "shipped"
      },
      {
        "_id": 2,
        "customer": "Bob",
        "items": [
          {"product": "Pen", "quantity": 1, "price": 1.20},
          {"product": "Eraser", "quantity": 3, "price": 0.50}
        ],
        "date": 'ISODate("2023-07-02T11:30:00Z")',
        "status": "pending"
      },
      {
        "_id": 3,
        "customer": "Alice",
        "items": [
          {"product": "Pen", "quantity": 5, "price": 1.10}
        ],
        "date": 'ISODate("2023-07-03T09:00:00Z")',
        "status": "delivered"
      }
    ]
