from firebase_connection import FirebaseConnection

firebase_connection = FirebaseConnection()

def plan_route(user: dict) -> list:
    user_data = firebase_connection.get_user_data(user)