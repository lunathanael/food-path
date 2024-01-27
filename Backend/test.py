import urllib.request
from bs4 import BeautifulSoup
from datetime import date

# dining hall: name(str), location, hours, menu(dict)
# menu: breakfast(list), lunch(list), dinner(list)
# food: name(str), float(weight), calories(int), description(str)

# Halls(dict) (halls -> meal list)
#   Meals (list of dict) (meal -> info)

def food_find(dining_hall: str, dt: date, dining_time: str) -> list:
    dt = str(dt)
    meals = {}
    wbst = 'https://eatatstate.msu.edu/menu/'+dining_hall+'/all/'+dt
    webUrl = urllib.request.urlopen(wbst)
    data  = webUrl.read()
    soup = BeautifulSoup(data, "html.parser")
    # name = soup.find('option', attrs={'selected': 'selected'}).text.lower()
    for tag in soup.find_all('li', attrs={'class': 'menu-item'}):
        try: 
            meal_name = tag.find('div', attrs={'class': 'meal-title '+dining_time}).text
            allergens = tag.find('div', attrs={'class': 'allergens'}).text.replace('\n', '')
            meals[meal_name] = allergens
        except:
            continue
    return meals
        
halls = ['South%20Pointe%20at%20Case', 'Sparty%27s%20market', 'The%20Edge%20at%20Akers', 'Brody%20Square', 'Holden%20Dining%20Hall', 'Holmes%20Dining%20Hall', 'The%20State%20Room%20at%20Kellogg', 'Heritage%20Commons%20at%20Landon', 'Thrive%20at%20Owen', 'The%20Vista%20at%20Shaw', 'The%20Gallery%20at%20Snyder%20Phillips']
opt = {}
for hall in halls:
    opt[hall] = food_find(hall, dt = date.today())
for key, value in opt.items():
    print(key+'\n')
    for meal, info in value.items():
        print('\t'+meal+'\n')
        print('\t\t'+info+'\n')


# class FirebaseConnection:
#     def __init__(self):
#         self.app = self.__setup_connection()
#         self.ref = db.reference()
#     def __setup_connection(self) -> firebase_admin.App:
#         # Return an app connected to the parking database
#         auth_certification = firebase_admin.credentials.Certificate(os.path.dirname(__file__)+"/food-path-24322-firebase-adminsdk-b8zhl-2b9c4db741.json")
#         real_time_db_app = firebase_admin.initialize_app(auth_certification, {
#             'databaseURL': 'https://food-path-24322-default-rtdb.firebaseio.com/'})
#         return real_time_db_app
#     def __add_dining_hall(self, name: str, location: [int, int], hours: list, menu: dict) -> None:
#         self.ref.child(f"dining_halls/{name}").set({"location": {"lat": location[0], "long": location[1]},
#                                         "hours": hours,
#                                         "menu": menu})
#     def __create_menu(self, breakfast: list, lunch: list, dinner: list) -> dict:
#         return {"breakfast": {food["name"]: {"weight": food["weight"], 
#                                             "calories": food["calories"], 
#                                             "description": food["description"]} for food in breakfast}, 
#                 "lunch": {food["name"]: {"weight": food["weight"], 
#                                             "calories": food["calories"], 
#                                             "description": food["description"]} for food in lunch}, 
#                 "dinner": {food["name"]: {"weight": food["weight"], 
#                                             "calories": food["calories"], 
#                                             "description": food["description"]} for food in dinner}}
#     def __create_food(self, name: str, weight: float, calories: int, description: str) -> dict:
#         return {"name": name, "weight": weight, "calories": calories, "description": description}
  


# from bs4 import BeautifulSoup
# import urllib.request
# # dining hall: name(str), location, hours, menu(dict)
# # menu: breakfast(list), lunch(list), dinner(list)
# # food: name(str), float(weight), calories(int), description(str)
# def food_find(dining_hall: str, which_food: str, date: str) -> list:
#     dining_hall.replace(' ', '%20')
#     wbst = 'https://eatatstate.msu.edu/menu/'+dining_hall+'/all/'+date
#     webUrl = urllib.request.urlopen(wbst)
#     data  = webUrl.read()
#     name = soup.find('option', attrs={'selected': 'selected'}).text.lower()
#     foods = []
#     foods.append()
#     soup = BeatifulSoup(data, "html.parser")
#     for tag in soup.find_all('div', attrs={'class': 'allergens'})




# webUrl = urllib.request.urlopen('https://eatatstate.msu.edu/menu/South%20Pointe%20at%20Case/all/2024-01-27')

# data = webUrl.read()

# soup = BeautifulSoup(data, "html.parser")
# class_name = 
# name = soup.find('div', attrs={'class': 'meal-title-'}).text
# print(soup.find('div', attrs={'class': 'allergens'}).text)

# # for child in soup.descendants:
# #     if child.name:
# #         print(child.name)