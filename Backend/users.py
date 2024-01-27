from __future__ import annotations
from firebase_connection import FirebaseConnection, User, DiningHall, Class, Menu, Food, Location
import numpy as np, math
from numpy import ndarray

MAX_WALKING_DISTANCE = 1.5 # miles
TIME_TO_EAT = 30 # minutes

firebase_connection: FirebaseConnection = FirebaseConnection()
dining_halls: list[DiningHall] = firebase_connection.get_dining_halls()

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
        possible_lunch_times = []
        
        for dining_hall in dining_halls:
            if dining_hall.location.get_distance(user.location) > MAX_WALKING_DISTANCE:
                continue
            

plan_route("Aidan")