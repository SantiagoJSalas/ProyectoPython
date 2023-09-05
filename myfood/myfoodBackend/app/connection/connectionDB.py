from pymongo import MongoClient

client = MongoClient("mongodb+srv://Santivilla23_:Santivilla23_@cluster0.gtuzq8j.mongodb.net/?retryWrites=true&w=majority")
db = client["cupboard"]