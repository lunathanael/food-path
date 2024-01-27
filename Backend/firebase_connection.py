from __future__ import annotations
import firebase_admin
from firebase_admin import db
import os, math

RESET_USERS = False
RESET_DINING_HALLS = False
STAY_IN_DINING_HALL_AFTER_CLOSE = False

class Location:
    def __init__(self, lat: float, long: float):
        self.lat: float = lat
        self.long: float = long
    
    def __init__(self, location: dict):
        self.lat: float = location["lat"]
        self.long: float = location["long"]
        
    def __lat_long_to_miles(self, degrees: float, lat: bool) -> float:
        return degrees * (69 if lat else 54.6)

    def get_distance(self, other: Location) -> float:
        return math.hypot(self.__lat_long_to_miles(self.lat, True)-self.__lat_long_to_miles(other.lat, True),
                          self.__lat_long_to_miles(self.long, False)-self.__lat_long_to_miles(other.long, False))
        
    def get_time_to_walk(self, other: Location) -> int:
        # TODO use google maps api to get time to walk
        return self.get_path_distance(other) * 15 # 15 minutes per mile
        
    def get_path_distance(self, other: Location) -> float:
        # TODO use google maps api to get distance
        return self.get_distance(other)

class Class:
    def __init__(self, name: str, location: dict[str, int], time: dict[str, int], days: list):
        self.name: str = name
        self.location: Location = Location(location)
        self.start: int = time["start"]
        self.end: int = time["end"]
        self.days: list[int] = days
class User:
    def __init__(self, username: str, password: str, classes: dict, location: dict[str, int]):
        self.username: str = username
        self.password: str = password
        self.classes: list[Class] = [Class(name, **class_data) for name, class_data in classes.items()]
        self.location: Location = Location(location)       
class Food:
    def __init__(self, name: str, weight: float, calories: int, description: str):
        self.name: str = name
        self.weight: float = weight
        self.calories: int = calories
        self.description: str = description
class Menu:
    def __init__(self, breakfast: dict, lunch: dict, dinner: dict):
        self.breakfast: list[Food] = [Food(name, **food) for name, food in breakfast.items()]
        self.lunch: list[Food] = [Food(name, **food) for name, food in lunch.items()]
        self.dinner: list[Food] = [Food(name, **food) for name, food in dinner.items()]
class DiningHall:
    def __init__(self, name: str, location: dict[str, int], hours: list, menu: dict):
        self.name: str = name
        self.location: Location = Location(location)
        self.__hours: list[int] = hours
        self.menu: Menu = Menu(**menu)
        
    def is_open_at_time(self, start_time: int | None, duration: int) -> bool:
        return start_time and any(start_time > start and start_time+duration < end \
                                for start, end in zip(self.__hours[::2], self.__hours[1::2]))
    
    def find_best_time(self, start_time: int, end_time: int, duration: int) -> int:
        for start, end in zip(self.__hours[:-1], self.__hours[1:]):
            if end_time > end and start_time < start:
                if end_time + duration > end and not STAY_IN_DINING_HALL_AFTER_CLOSE:
                    return end - duration
                else:
                    return start_time
            elif end_time > end and start_time > start:
                ...
                    
        return None
        
class FirebaseConnection:
    def __init__(self):
        self.app = self.__setup_connection()
        self.ref = db.reference()
        RESET_DINING_HALLS and self.__init_dining_halls()
        RESET_USERS and self.__init_users()
    
    def __setup_connection(self) -> firebase_admin.App:
        # Return an app connected to the parking database
        auth_certification = firebase_admin.credentials.Certificate(os.path.dirname(__file__)+ \
                                        "/food-path-24322-firebase-adminsdk-b8zhl-2b9c4db741.json")
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

    def __create_class(self, location: [int, int], time: [int, int], days: list) -> dict:
        return {"location": {"lat": location[0], "long": location[1]}, 
                       "time": {"start": time[0], "end": time[1]}, "days": days}

    def __add_user(self, username: str,  password: str, classes: dict, location: [int, int]) -> None:
        self.ref.child(f'users/{username}').set({"password": password, 
                                                 "classes": classes, 
                                                 "location": {"lat": location[0], "long": location[1]}})

    def __init_users(self) -> None:
        classes = {"CSE 232": self.__create_class([42.72667482223444, -84.4831625150824], [1020, 1240], [5]),
                    "CSE 260": self.__create_class([42.73057305428702, -84.48175181501252], [1500, 1620], [1, 3, 5])}
        self.__add_user("Aidan", "12345", classes, [42.72258662612383, -84.48989148173476])

    def get_user_data(self, username: str) -> User:
        return User(username, **self.ref.child(f"users/{username}").get())

    def get_dining_halls(self) -> list[DiningHall]:
        return [DiningHall(name, **dining_hall) for name, dining_hall in self.ref.child("dining_halls").get().items()]
    
if __name__ == "__main__":
    firebase_connection = FirebaseConnection()