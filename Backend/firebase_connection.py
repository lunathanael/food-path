import firebase_admin
from firebase_admin import db
import os

class FirebaseConnection:

    def __init__(self):
        self.app = self.__setup_connection()
        self.ref = db.reference()
        # self.__init_dining_halls()
    
    def __setup_connection(self) -> firebase_admin.App:
        # Return an app connected to the parking database
        auth_certification = firebase_admin.credentials.Certificate(os.path.dirname(__file__)+"/food-path-24322-firebase-adminsdk-b8zhl-2b9c4db741.json")
        real_time_db_app = firebase_admin.initialize_app(auth_certification, {
            'databaseURL': 'https://food-path-24322-default-rtdb.firebaseio.com/'})
        return real_time_db_app


    def __add_dining_hall(self, name: str, location: [int, int], hours: list, menu: dict) -> None:
        self.ref.child(f"dining_halls/{name}").set({"location": {"lat": location[0], "long": location[1]},
                                            "hours": hours,
                                            "menu": menu})
    def __create_menu(self, breakfast: list, lunch: list, dinner: list) -> dict:
        return {"breakfast": {food["name"]: {"weight": food["weight"], 
                                            "calories": food["calories"], 
                                            "description": food["description"]} for food in breakfast}, 
                "lunch": {food["name"]: {"weight": food["weight"], 
                                            "calories": food["calories"], 
                                            "description": food["description"]} for food in lunch}, 
                "dinner": {food["name"]: {"weight": food["weight"], 
                                            "calories": food["calories"], 
                                            "description": food["description"]} for food in dinner}}
        
    def __create_food(self, name: str, weight: float, calories: int, description: str) -> dict:
        return {"name": name, "weight": weight, "calories": calories, "description": description}

    def __init_dining_halls(self) -> None:
        breakfast = [self.__create_food("Eggs", 0.2, 150, "Eggs"), self.__create_food("Bacon", 0.6, 200, "Bacon")]
        lunch = [self.__create_food("Pizza", 0.5, 400, "Cheese"), self.__create_food("Cheese Burger", 0.4, 450, "Bread, Meat, Cheese")]
        dinner = [self.__create_food("Chicken Sandwich", 0.6, 480, "Chicken, Bread"), self.__create_food("Tacos", 0.7, 600, "Steak, Tortilla, Cheese, Lettuce")]
        case_menu = self.__create_menu(breakfast, lunch, dinner)
        self.__add_dining_hall("Case", [42.7244946181507, -84.48848047008471], [700, 1500, 1630, 2100], case_menu)
    
        breakfast = [self.__reate_food("Eggs", 0.2, 150, "Eggs"), self.__create_food("Bacon", 0.6, 200, "Bacon")]
        lunch = [self.__create_food("Pizza", 0.5, 400, "Cheese"), self.__create_food("Cheese Burger", 0.4, 450, "Bread, Meat, Cheese")]
        dinner = [self.__create_food("Chicken Sandwich", 0.6, 480, "Chicken, Bread"), self.__create_food("Tacos", 0.7, 600, "Steak, Tortilla, Cheese, Lettuce")]
        akers_menu = self.__create_menu(breakfast, lunch, dinner)
        self.__add_dining_hall("Akers", [42.724511319457186, -84.4648138643711], [700, 1500, 1630, 2100], akers_menu)

    def __create_class(self, name: str, location: [int, int], time: [int, int], days: list) -> dict:
        return {name: {"location": {"lat": location[0], "long": location[1]}, 
                       "time": {"start": time[0], "end": time[1]}, "days": days}}

    def __add_user(self, username: str,  password: str, classes: dict) -> None:
        self.app.child(f'users/{username}').set({"password": password, "classes": classes})

    def __init_users(self) -> None:
        classes = self.__create_class("CSE 231", [42.7244946181507, -84.48848047008471], [700, 1500], [1, 3, 5])
        self.__add_user("Aidan", "12345", classes)

    def get_user_data(self, username: str) -> dict:
        return self.ref.child(f"users/{username}").get()