from __future__ import annotations
from bs4 import BeautifulSoup
from firebase_admin import db
from datetime import date
import os, math, urllib.request, firebase_admin

DINING_HALLS_TO_HTML = {'South Pointe at Case': 'South%20Pointe%20at%20Case', 'Sparty\'s Market': 'Sparty%27s%20market', 'The Edge at Akers': 'The%20Edge%20at%20Akers', 'Brody Square': 'Brody%20Square', 'Holden Dining Hall': 'Holden%20Dining%20Hall', 'Holmes Dining Hall': 'Holmes%20Dining%20Hall', 'The State Room at Kellogg': 'The%20State%20Room%20at%20Kellogg', 'Heritage Commons at Landon': 'Heritage%20Commons%20at%20Landon', 'Thrive at Owen': 'Thrive%20at%20Owen', 'The Vista at Shaw': 'The%20Vista%20at%20Shaw', 'The Gallery at Snyder Phillips': 'The%20Gallery%20at%20Snyder%20Phillips'}
MEAL_TIMES = ['breakfast', 'lunch', 'dinner']
RESET_USERS = False
RESET_DINING_HALLS = False
STAY_IN_DINING_HALL_AFTER_CLOSE = False
MINUTES_PER_MILE = 15

class Location:
    def __init__(self, lat: float, long: float):
        self.lat: float = lat
        self.long: float = long
    
    def __init__(self, location: dict):
        self.lat: float = location["lat"]
        self.long: float = location["long"]
        
    def __lat_long_to_miles(self, degrees: float, lat: bool) -> float:
        return degrees * (69 if lat else 54.6)

    def get_distance_miles(self, other: Location) -> float:
        return math.hypot(self.__lat_long_to_miles(self.lat, True)-self.__lat_long_to_miles(other.lat, True),
                          self.__lat_long_to_miles(self.long, False)-self.__lat_long_to_miles(other.long, False))
        
    def get_time_to_walk_hours(self, other: Location) -> int:
        # TODO use google maps api to get time to walk
        return self.get_path_distance_miles(other) * MINUTES_PER_MILE # 15 minutes per mile
        
    def get_path_distance_miles(self, other: Location) -> float:
        # TODO use google maps api to get distance
        return self.get_distance_miles(other)

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
        self.name: str = name.replace('w/', 'with')
        self.weight: float = weight
        self.calories: int = calories
        self.description: str = description
        
    def to_dict(self) -> dict:
        return {"weight": self.weight, "calories": self.calories, "description": self.description}
class Menu:
    def __init__(self, breakfast: dict = {}, lunch: dict = {}, dinner: dict = {}):
        self.breakfast: list[Food] = [Food(name, **food) for name, food in breakfast.items()]
        self.lunch: list[Food] = [Food(name, **food) for name, food in lunch.items()]
        self.dinner: list[Food] = [Food(name, **food) for name, food in dinner.items()]
        
    def menu_weight(self) -> float:
        return (sum(sorted(self.breakfast, key=lambda food: food.weight)[:5]) / 5 +
                sum(sorted(self.lunch, key=lambda food: food.weight)[:5]) / 5 +
                sum(sorted(self.dinner, key=lambda food: food.weight)[:5]) / 5
                ) / 3

    def to_dict(self) -> dict:
        return {"breakfast": {food.name: food.to_dict() for food in self.breakfast}, 
                "lunch": {food.name: food.to_dict() for food in self.lunch}, 
                "dinner": {food.name: food.to_dict() for food in self.dinner}}

    def add_food(self, meal_time: str, foods: list[Food]) -> None:
        if meal_time == "breakfast":
            self.breakfast.extend(foods)
        elif meal_time == "lunch":
            self.lunch.extend(foods)
        elif meal_time == "dinner":
            self.dinner.extend(foods)
            
class DiningHall:
    def __init__(self, name: str, location: dict[str, int], hours: list, menu: dict):
        self.name: str = name
        self.location: Location = Location(location)
        self.__hours: list[int] = hours
        self.menu: Menu = Menu(**menu)
        
    def is_open_at_time(self, start_time: int | None, duration: int) -> bool:
        return start_time and any(start_time > start and start_time+duration < end \
                                for start, end in zip(self.__hours[::2], self.__hours[1::2]))
    
    def find_best_time(self, start_time: int, end_time: int, duration: int) -> int | None:
        for start, end in zip(self.__hours[:-1], self.__hours[1:]):
            if end_time > end and start_time < start:
                return end_time - duration
            elif end_time > end and start_time > start:
                if end_time - duration < start:
                    return end_time - duration
            elif end_time < end and start_time < start:
                if start_time + duration < end:
                    return end - duration
                    
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


    def __add_dining_hall(self, name: str, location: [int, int], hours: list, menu: dict | Menu) -> None:
        if isinstance(menu, Menu):
            menu = menu.to_dict()
        if not menu:
            return
        self.ref.child(f"dining_halls/{name}").set({"location": {"lat": location[0], "long": location[1]},
                                            "hours": hours,
                                            "menu": menu})

    def __get_food_info(self, dining_hall: str, current_date: date, dining_time: str) -> list[Food]:
        foods: list[Food] = []
        website_url: str = f'https://eatatstate.msu.edu/menu/{dining_hall}/all/{str(current_date)}'
        website_data: str = urllib.request.urlopen(website_url).read()
        soup: BeautifulSoup = BeautifulSoup(website_data, "html.parser")

        for tag in soup.find_all('li', attrs={'class': 'menu-item'}):
            try: 
                meal_name: str = tag.find('div', attrs={'class': f'meal-title {dining_time}'}).text
                description: str = tag.find('div', attrs={'class': 'allergens'}).text.replace('\n', '')
                foods.append(Food(meal_name, 0.5, 0, description))
            except:
                continue
        return foods

    def __get_dining_hall_meals(self, dining_hall) -> Menu:
        dining_hall_menu: Menu = Menu()
        for meal_time in MEAL_TIMES:
            foods: list[Food] = self.__get_food_info(DINING_HALLS_TO_HTML[dining_hall], date.today(), meal_time)
            dining_hall_menu.add_food(meal_time, foods)
        return dining_hall_menu

    def __init_dining_halls(self) -> None:
        for dining_hall in DINING_HALLS_TO_HTML.keys():
            # TODO get location and hours
            self.__add_dining_hall(dining_hall, 
                                   [42.724511319457186, -84.4648138643711], 
                                   [700, 1500, 1630, 2100], 
                                   self.__get_dining_hall_meals(dining_hall))

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