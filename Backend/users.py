from __future__ import annotations
from firebase_connection import FirebaseConnection, User, DiningHall, Class, Menu, Food, Location

MAX_WALKING_DISTANCE = 1.5 # miles
TIME_TO_EAT = 30 # minutes
BUFFER_TIME = 10 # minutes
MAX_WAIT_FOR_CLASS_TO_START = 15 # minutes

FOOD_WEIGHT = 0.5

firebase_connection: FirebaseConnection = FirebaseConnection()
dining_halls: list[DiningHall] = firebase_connection.get_dining_halls()

class PossibleFoodTime:
    def __init__(self, dining_hall: DiningHall, start_time: int, duration: int, distance: float) -> None:
        self.dining_hall: DiningHall = dining_hall
        self.start_time: int = start_time
        self.end_time: int = start_time + duration
        self.distance: float = distance
        
    def to_dict(self) -> dict:
        return {"dining_hall": self.dining_hall.name, "start_time": self.start_time}
        
    def __weight(self):
        return self.distance/MAX_WALKING_DISTANCE * (1-FOOD_WEIGHT) + self.dining_hall.menu.menu_weight() * FOOD_WEIGHT
        
    def __cmp__(self, other: PossibleFoodTime) -> int:
        return -1 if self.__weight() < other.__weight() else int(self.__weight() > other.__weight())

    @staticmethod
    def possible_location_and_time(start_class: Class | Location,
                                   dining_hall: DiningHall, 
                                   end_class: Class) -> tuple[bool, int, float] | tuple[bool, None, None]:
        first_class = isinstance(start_class, Location)
        if first_class:
            start_class.location = start_class
        last_class = isinstance(end_class, Location)
        if last_class:
            end_class.location = end_class
        # Distance from start class to dining hall to end class going straight a -> b
        total_difference_in_distance: int = dining_hall.location.get_distance_miles(end_class.location) + \
                                            start_class.location.get_distance_miles(dining_hall.location) - \
                                            start_class.location.get_distance_miles(end_class.location)
        if total_difference_in_distance < MAX_WALKING_DISTANCE:
            # Time to walk from class to dining hall and vice versa to end class going a ~> b
            time_to_walk_start_class_to_dining_hall: int = start_class.location.get_time_to_walk_hours(dining_hall.location)
            time_to_walk_dining_hall_to_end_class: int = dining_hall.location.get_time_to_walk_hours(end_class.location)
            # Time available to start eating
            available_start_time = start_class.end+BUFFER_TIME+time_to_walk_start_class_to_dining_hall if not first_class else \
                end_class.start-time_to_walk_start_class_to_dining_hall-BUFFER_TIME-MAX_WAIT_FOR_CLASS_TO_START
            # Time available to stop eating
            available_stop_time = end_class.start-BUFFER_TIME-time_to_walk_dining_hall_to_end_class if not last_class else \
                start_class.end+time_to_walk_dining_hall_to_end_class+BUFFER_TIME+MAX_WAIT_FOR_CLASS_TO_START
            # Time to start eating
            eat_start_time: int = dining_hall.find_best_time(available_start_time, available_stop_time, TIME_TO_EAT)
            # Is dining hall open at start time
            # Distance from start class to dining hall to end class going straight a ~> b
            return eat_start_time and eat_start_time - available_stop_time > TIME_TO_EAT and \
                dining_hall.is_open_at_time(eat_start_time, TIME_TO_EAT), \
                eat_start_time, total_difference_in_distance
        return False, None, None

def find_possible_food_times(user: User, classes: list[Class]) -> list[PossibleFoodTime]:
    possible_food_times: list[PossibleFoodTime] = []
    
    for dining_hall in dining_halls:
        # Can user walk to dining hall from dorm
        is_possible, start_time, distance = PossibleFoodTime.possible_location_and_time(user.location, dining_hall, classes[0])
        if is_possible:
                possible_food_times.append(PossibleFoodTime(dining_hall, start_time, TIME_TO_EAT, distance))
        
        # Can user walk to dining hall from class and then to next class
        for class_data, next_class_data in zip(classes[:-1], classes[1:]):
            is_possible, start_time, distance = PossibleFoodTime.possible_location_and_time(class_data, dining_hall, next_class_data)
            if is_possible:
                possible_food_times.append(PossibleFoodTime(dining_hall, start_time, TIME_TO_EAT, distance))
        
        # last class to dorm
        is_possible, start_time, distance = PossibleFoodTime.possible_location_and_time(classes[-1], dining_hall, user.location)
        if is_possible:
                possible_food_times.append(PossibleFoodTime(dining_hall, start_time, TIME_TO_EAT, distance))
        
        # Sort possible_lunch_times
        possible_food_times = sorted(possible_food_times)
    return possible_food_times
        
def plan_route(user: str) -> list:
    user, update_data = firebase_connection.get_user_data(user)
    
    # Initialize list of classes
    week: list[list[Class]] = [[],[],[],[],[],[],[]]
    for class_data in user.classes:
        for day in class_data.days:
            week[day].append(class_data)
            
    # Sort classes by start time
    week = [sorted(day, key=lambda class_data: class_data.start) for day in week]
    
    food_options: list[list[PossibleFoodTime]] = []
    for day in week:
        if not day:
            food_options.append([])
            continue
        
        possible_food_times: list[PossibleFoodTime] = find_possible_food_times(user, day)    
        # Top 3 options
        food_options.append([possible_food_time.to_dict() for possible_food_time in possible_food_times[:3]])
    update_data(food_options)
    

plan_route("Aidan")