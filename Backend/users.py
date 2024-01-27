from __future__ import annotations
from firebase_connection import FirebaseConnection, User, DiningHall, Class, Menu, Food, Location
import numpy as np, math
from numpy import ndarray

MAX_WALKING_DISTANCE = 1.5 # miles
TIME_TO_EAT = 30 # minutes
BUFFER_TIME = 10 # minutes
MAX_WAIT_FOR_CLASS_TO_START = 15 # minutes

firebase_connection: FirebaseConnection = FirebaseConnection()
dining_halls: list[DiningHall] = firebase_connection.get_dining_halls()

class PossibleLunchTime:
    def __init__(self, dining_hall: DiningHall, start_time: int, duration: int) -> None:
        self.dining_hall: DiningHall = dining_hall
        self.start_time: int = start_time
        self.end_time: int = start_time + duration

    @staticmethod
    def possible_location_and_time(start_class: Class | Location,
                                   dining_hall: DiningHall, 
                                   end_class: Class) -> tuple[bool, int]:
        first_class = isinstance(start_class, Location)
        # Distance from start class to dining hall to end class going straight a -> b
        distance: int = dining_hall.location.get_distance(end_class.location) + \
            start_class.location.get_distance(dining_hall.location) if first_class else 0
        if distance < MAX_WALKING_DISTANCE:
            # Time to walk from class to dining hall and vice versa to end class going a ~> b
            time_to_walk_start_class_to_dining_hall: int = start_class.location.get_time_to_walk(dining_hall.location) \
                                                if first_class else start_class.get_time_to_walk(dining_hall.location)
            time_to_walk_dining_hall_to_end_class: int = dining_hall.location.get_time_to_walk(end_class.location)
            # Time available to start eating
            available_start_time = start_class.end+BUFFER_TIME+time_to_walk_start_class_to_dining_hall if first_class else \
                end_class.start-time_to_walk_start_class_to_dining_hall-BUFFER_TIME-MAX_WAIT_FOR_CLASS_TO_START
            # Time available to stop eating
            available_stop_time = end_class.start-BUFFER_TIME-time_to_walk_dining_hall_to_end_class
            # Time to start eating
            eat_start_time: int = dining_hall.find_best_time(available_start_time, available_stop_time, TIME_TO_EAT)
            # Is dining hall open at start time
            # Distance from start class to dining hall to end class going straight a ~> b
            return eat_start_time - available_stop_time > TIME_TO_EAT and \
                dining_hall.is_open_at_time(eat_start_time, TIME_TO_EAT) and \
                dining_hall.location.get_path_distance(end_class.location) + \
                start_class.location.get_path_distance(dining_hall.location) if first_class else 0 < MAX_WALKING_DISTANCE, eat_start_time
        return False, None

def plan_route(user: str) -> list:
    user: User = firebase_connection.get_user_data(user)
    
    week: list[list[Class]] = [[],[],[],[],[],[],[]]
    for class_data in user.classes:
        for day in class_data.days:
            week[day].append(class_data)
            
    week = [sorted(day, key=lambda class_data: class_data.start) for day in week]
        
    for day in week:
        if not day:
            continue
        possible_lunch_times: list[PossibleLunchTime] = []
        
        for dining_hall in dining_halls:
            # Can user walk to dining hall from dorm
            is_possible, start_time = PossibleLunchTime.possible_location_and_time(None, dining_hall, user.location, day[0])
            if is_possible:
                    possible_lunch_times.append(PossibleLunchTime(dining_hall, start_time, TIME_TO_EAT))
                
            for class_data, next_class_data in zip(day[:-1], day[1:]):
                is_possible, start_time = PossibleLunchTime.possible_location_and_time(dining_hall, class_data.location, next_class_data)

plan_route("Aidan")