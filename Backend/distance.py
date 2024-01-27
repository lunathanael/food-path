# import requests
# try:
#     response = requests.get('https://www.google.com')
# except:
#     print("Can\'t connect to google\'s server")
#     raw_input('Press any key to exit')
#     quit()
# import googlemaps
# gmaps = googlemaps.Client(key = "AIzaSyAKTdNuoPDpeBHQsAOv5MNnJEhS8lirgxk")

# def find_walk_time(start: [int, int], end:[int, int]):
#     url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
#     origin = str(start[0]) + ' ' + str(start[1])
#     destination = str(end[0]) + ' ' + str(end[1])
#     matrix = gmaps.distance_matrix(origin, destination, mode = "walking")
#     print(matrix)
#     # matrixdf = json_normalize(matrix, ['rows', 'elements'])
#     # r = requests.get(url+'origings = '+ start + "&destinations = "+ end + "&key = " + api_key)

#     # x = r.json()

#     # print(x)

# find_walk_time([42.7244, 84.4885], [42.7243, 84.4648])

import requests

def get_distance_and_time(api_key, origin, destination, mode="driving"):
    base_url = "https://maps.googleapis.com/maps/api/distancematrix/json"

    params = {
        "origins": f"{origin[0]},{origin[1]}",
        "destinations": f"{destination[0]},{destination[1]}",
        "mode": mode,
        "units": "imperial",
        "key": api_key,
    }

    response = requests.get(base_url, params=params)
    result = response.json()

    if response.status_code == 200 and result["status"] == "OK":
        distance = result["rows"][0]["elements"][0]["distance"]["text"]
        duration = result["rows"][0]["elements"][0]["duration"]["text"]
        return distance, duration
    else:
        print(f"Error: {result['status']} - {result.get('error_message', 'No error message available')}")
        return None, None

# Replace 'YOUR_API_KEY' with your actual Google Maps API key
api_key = "AIzaSyAKTdNuoPDpeBHQsAOv5MNnJEhS8lirgxk"

# Example coordinates for origin and destination
origin_coordinates = (42.72466394079157, -84.48848397509386) 
destination_coordinates = (42.72445719635203, -84.46478303189518)

distance, duration = get_distance_and_time(api_key, origin_coordinates, destination_coordinates)

if distance and duration:
    print(f"Distance: {distance}")
    print(f"Duration: {duration}")
