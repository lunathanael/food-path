from __future__ import annotations
from firebase_admin import db
from requests import Response
from bs4 import BeautifulSoup
from typing import Callable
from datetime import date
import os, math, urllib.request, firebase_admin, requests

DINING_HALLS = {'South Pointe at Case': {'html': 'South%20Pointe%20at%20Case', 'location': [42.72453932922057, -84.48844707117367], 'times': [700, 1500, 1630, 2100]}, 
                        'Sparty\'s Market': {'html': 'Sparty%27s%20market', 'location': [42.72867352001793, -84.49440369630766], 'times': [730, 1900]},
                        'The Edge at Akers': {'html': 'The%20Edge%20at%20Akers', 'location': [42.72426284934323, -84.46473942700027], 'times': [900, 1500, 1630, 2100]},
                        'Brody Square': {'html': 'Brody%20Square', 'location': [42.731472990618464, -84.49519192699452], 'times': [900, 1500, 1630, 2100]},
                        'Holden Dining Hall': {'html': 'Holden%20Dining%20Hall', 'location': [42.721120608388475, -84.48858822885974], 'times': [700, 2000]},
                        'Holmes Dining Hall': {'html': 'Holmes%20Dining%20Hall', 'location': [42.72679464281192, -84.4645800270007], 'times': [700, 2000]},
                        'The State Room at Kellogg': {'html': 'The%20State%20Room%20at%20Kellogg', 'location': [42.73191102029839, -84.49316017118278], 'times': [1100, 1400, 1600, 2200]},
                        'Heritage Commons at Landon': {'html': 'Heritage%20Commons%20at%20Landon', 'location': [42.733953903515385, -84.48511974233824], 'times': [900, 1500, 1630, 2300]},
                        'Thrive at Owen': {'html': 'Thrive%20at%20Owen', 'location': [42.726750094109065, -84.47062737303804], 'times': [1100, 1500, 1630, 1900]},
                        'The Vista at Shaw': {'html': 'The%20Vista%20at%20Shaw', 'location': [42.72702766286321, -84.47526964233279], 'times': [700, 1500, 1630, 1900]},
                        'The Gallery at Snyder Phillips': {'html': 'The%20Gallery%20at%20Snyder%20Phillips', 'location': [42.73019974531501, -84.47278836932867], 'times': [900, 1500, 1630, 2100]}}
BUILDINGS = {'CENTRAL SERVICES BUILDING': [42.72794997093423, -84.48338229275835], 
             'STEM TEACHING & LEARNING FACILITY': [42.72669428508474, -84.48318592159418], 
             'WELLS HALL': [42.72748896537191, -84.48238172159411], 
             'BUSINESS COLLEGE': [42.726583250822706, -84.47336646476118],
             'ENGINEERING BUILDING': [42.7249909424121, -84.48131374858022],
             'URBAN PLANNING LANDSCAPE ARCHITECTURE BUILDING': [42.72371644310584, -84.48298833323756],
             'MSU COLLEGE OF LAW':[42.72619246250173, -84.47383743065859],
             'COMMUNICATION ARTS AND SCIENCE BUILDING': [42.72207338442412, -84.48161318833674],
             'COOLING TOWER': [42.71919793517019, -84.48427199811861],
             'WHARTON CENTER': [42.72400221869561, -84.47040968728611],
             'PLANT AND SOIL SCIENCES BUILDING': [42.72234679311312, -84.47303571716958],
             'PUBLIC SAFETY BUILDING': [42.721594122938754, -84.4831578711368],
             'OYER SPEECH AND HEARING BUILDING': [42.722899328153886, -84.48338637112914],
             'FARRALL HALL': [42.72494401401082, -84.4772738153293],
            'PLANT SCIENCE GREENHOUSES': [42.722413083246245, -84.4771997269522],
            'ANTHONY HALL': [42.72452227850685, -84.47965397111874],
            'ERICKSON HALL': [42.7270633947951, -84.4794500269558],
            'BIOMEDICAL AND PHYSICAL SCIENCES BUILDING': [42.72448751521756, -84.47575612695337],
             'DEPARTMENT OF CHEMISTRY': [42.72520772375242, -84.47552672879105],
             'ABRAMS PLANETARIUM': [42.725731422757775, -84.47593608648815],
             'INFRASTRUCTURE PLANNING AND FACILITIES': [42.7215625845436, -84.48617235579667],
             'BIOCHEMISTRY BUILDING': [42.723715508030914, -84.47600741530572],
             'INTERNATIONAL CENTER': [42.726821327603915, -84.48073221716633],
             'VETERINARY MEDICAL CENTER': [42.722965779858406, -84.4707253576418],
             'PLANT BIOLOGY LABORATORIES': [42.72287965500636, -84.47432371532165],
             'FOOD SCIENCE AND HUMAN NUTRITION': [42.7238463439154, -84.4790466469391],
             'NATURAL RESOURCES BUILDING': [42.722642310560026, -84.47829085577668],
             'FOOD SAFETY TOXICOLOGY': [42.721293634248624, -84.47492589996422],
             'SHAW HALL': [42.72680939515986, -84.47529287111747],
             'COMMUNITY MUSIC SCHOOL': [42.72525241575518, -84.46140016319792],
             'HOLDEN HALL': [42.72138867684568, -84.4886883613156],
             'WILSON HALL': [42.722671091730064, -84.48999105120718],
             'WONDERS HALL': [42.724418145045256, -84.49006546185247],
             'CLARA BELL SMITH CENTER': [42.72499523327304, -84.48630380062932],
             'EMMONS HALL': [42.73051801528847, -84.4944312321704],
             'BAILEY HALL': [42.73031459945482, -84.4964927782774],
             'BRYAN HALL': [42.73212856601612, -84.4971076143391],
             'RATHER HALL': [42.7329133765712, -84.49648587746957],
             'BUTTERFIELD HALL': [42.73283280288204, -84.49438152412273],
             'BRODY SQUARE': [42.73143437375416, -84.49524095633717],
             'COLLEGE OF MUSIC': [42.732403361663614, -84.48445740830238],
             'IM CIRCLE': [42.73189516628836, -84.48573369846115],
             'WILLIAMS HALL': [42.73442505988796, -84.48858330455538],
             'GILCHRIST HALL': [42.73385848193732, -84.48732368953989],
             'YAKELEY HALL': [42.7338111358299, -84.48655877491028],
             'MARY MAYO HALL': [42.73484642915388, -84.48612904760836],
             'CAMPBELL HALL': [42.73458129470486, -84.48441013830359],
             'LANDON HALL': [42.734099663106, -84.48515193153783],
             'MSU UNION': [42.73392476642876, -84.48514926930463],
             'HUMAN ECOLOGY BUILDING': [42.73404396197006, -84.48144637329908],
             'SHAW HALL': [42.72681062956525, -84.47528974244385],
             'OWEN HALL': [42.72619614134022, -84.4708216315382],
             'MCDONEL HALL': [42.72684281745214, -84.46785179472857],
             'HOLMES HALL': [42.7267462537145, -84.46460933164596],
             'AKERS HALL': [42.72446086868382, -84.46479555419553],
             'HUBBARD HALL': [42.72446086868382, -84.46479555419553]
            }
MEAL_TIMES = ['breakfast', 'lunch', 'dinner']
RESET_USERS = False
RESET_DINING_HALLS = False
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
        
    def get_distance_and_time(self, other: Location, mode: str="walking") -> tuple[float, float]:
        response: Response = requests.get("https://maps.googleapis.com/maps/api/distancematrix/json", params={
            "origins": f"{self.lat},{self.long}",
            "destinations": f"{other.lat},{other.long}",
            "mode": mode,
            "units": "imperial",
            "key": "AIzaSyAKTdNuoPDpeBHQsAOv5MNnJEhS8lirgxk",
        })
        result: dict = response.json()

        if response.status_code == 200 and result["status"] == "OK":
            distance = result["rows"][0]["elements"][0]["distance"]["text"].split()[0]
            duration = result["rows"][0]["elements"][0]["duration"]["text"].split()[0]
            return float(distance), float(duration)
        else:
            return self.get_path_distance_miles(other), self.get_time_to_walk_minutes(other)
        
    def get_time_to_walk_minutes(self, other: Location) -> int:
        return self.get_path_distance_miles(other) * MINUTES_PER_MILE # 15 minutes per mile
        
    def get_path_distance_miles(self, other: Location) -> float:
        return self.get_distance_miles(other) * 1.5

class Class:
    def __init__(self, name: str, location: dict[str, int], time: dict[str, int], days: list):
        self.name: str = name
        self.location: Location = Location(location)
        self.start: int = time["start"]
        self.end: int = time["end"]
        self.days: list[int] = days
class User:
    def __init__(self, username: str, password: str, classes: dict, location: dict[str, int], food_plan: dict = None, reviews: dict = None):
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
        return (sum(food.weight for food in sorted(self.breakfast, key=lambda food: food.weight)[:5]) / 5 +
                sum(food.weight for food in sorted(self.lunch, key=lambda food: food.weight)[:5]) / 5 +
                sum(food.weight for food in sorted(self.dinner, key=lambda food: food.weight)[:5]) / 5
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
            if end_time <= end and start_time >= start:
                return end_time - duration
            elif end_time <= end and start_time <= start:
                if end_time - duration < start:
                    return end_time - duration
            elif end_time >= end and start_time >= start:
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
        if 'Holden' in name:
            name = 'Holden Dining Hall'
        if not menu['breakfast'] and not menu['lunch'] and not menu['dinner']:
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
            foods: list[Food] = self.__get_food_info(DINING_HALLS[dining_hall]['html'], date.today(), meal_time)
            dining_hall_menu.add_food(meal_time, foods)
        return dining_hall_menu

    def __init_dining_halls(self) -> None:
        for dining_hall in DINING_HALLS.keys():
            self.__add_dining_hall(dining_hall, 
                                   DINING_HALLS[dining_hall]['location'], 
                                   DINING_HALLS[dining_hall]['times'], 
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
                    "CSE 260": self.__create_class([42.7284703908709, -84.47829548101657], [1500, 1620], [1, 3, 5]),
                    "IAH 207": self.__create_class([42.72459681870728, -84.46473911567855], [1240, 1430], [2, 4]),
                    "ISB 202": self.__create_class([42.73057305428702, -84.48175181501252], [1240, 1400], [1, 3]),}
        self.__add_user("Aidan", "12345", classes, [42.72258662612383, -84.48989148173476])

    def get_user_data(self, username: str) -> tuple[User, Callable[[dict], None]]:
        return User(username, **self.ref.child(f"users/{username}").get()), lambda data: self.ref.child(f"users/{username}/food_plan").set(data)

    def get_dining_halls(self) -> list[DiningHall]:
        return [DiningHall(name, **dining_hall) for name, dining_hall in self.ref.child("dining_halls").get().items()]
    
    def register_review_listener(self) -> None:
        self.ref.child('users').listen(self.__on_user_change)
    
    def __on_user_change(self, event: db.Event) -> None:
        if event.event_type == 'put':
            return
        dining_hall_name = list(event.data['users']['reviews'].keys())[0]
        dining_hall: db.Reference = self.ref.child(f'dining_halls/{dining_hall_name}').get()
        for food, liked in event.data['users']['reviews'][dining_hall_name].items():
            time = None
            if food in dining_hall['menu']['breakfast']:
                time = 'breakfast'
            if food in dining_hall['menu']['lunch']:
                time = 'lunch'
            if food in dining_hall['menu']['dinner']:
                time = 'dinner'
            if time:
                dining_hall['menu'][time][food]['weight'] = min(1, dining_hall['menu'][time][food]['weight']+0.1) \
                    if liked else max(0, dining_hall['menu'][time][food]['weight']-0.1)
                    
        self.ref.child(f'users/{event.path.split('/')[1]}/reviews').remove()

    #     # Use firebase admin to add listener to users
    #     # Add listener to user reviews
    #     # When listener is called, update food reviews
    #     # Loop through dining hall and if the food has been reviewed update its rating
    #     ...
        

        

if __name__ == "__main__":
    firebase_connection = FirebaseConnection()