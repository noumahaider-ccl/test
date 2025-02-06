from flask import Flask, request, jsonify
from datetime import datetime
from app.utils import save_time_logs, load_time_logs
from waitress import serve

# Initialize the Flask application
app = Flask(__name__)

TIME_LOGS_FILE = "time_logs.json"

def clock_in(user_id):
    time_logs = load_time_logs()

    if user_id in time_logs and time_logs[user_id].get("clock_in_time") and not time_logs[user_id].get("clock_out_time"):
        return jsonify({"message": f"User {user_id} is already clocked in."}), 400

    clock_in_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    time_logs[user_id] = {"clock_in_time": clock_in_time, "clock_out_time": None, "total_time": 0}
    save_time_logs(time_logs)

    return jsonify({"message": f"User {user_id} clocked in at {clock_in_time}."}), 200

def clock_out(user_id):
    time_logs = load_time_logs()

    if user_id not in time_logs or time_logs[user_id].get("clock_in_time") is None:
        return jsonify({"message": f"User {user_id} is not clocked in."}), 400

    clock_out_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    clock_in_time = datetime.strptime(time_logs[user_id]["clock_in_time"], "%Y-%m-%d %H:%M:%S")
    clock_out_time_obj = datetime.strptime(clock_out_time, "%Y-%m-%d %H:%M:%S")
    total_time_worked = (clock_out_time_obj - clock_in_time).total_seconds()

    time_logs[user_id]["clock_out_time"] = clock_out_time
    time_logs[user_id]["total_time"] = total_time_worked
    save_time_logs(time_logs)

    return jsonify({"message": f"User {user_id} clocked out at {clock_out_time}.", "total_time_worked": total_time_worked / 3600}), 200

def view_time_log(user_id):
    time_logs = load_time_logs()

    if user_id not in time_logs:
        return jsonify({"message": f"No time log found for user {user_id}."}), 404

    log = time_logs[user_id]
    return jsonify({
        "user_id": user_id,
        "clock_in_time": log.get("clock_in_time"),
        "clock_out_time": log.get("clock_out_time"),
        "total_time_worked": log.get("total_time") / 3600
    }), 200

# Flask routes
@app.route('/clock_in/<user_id>', methods=['POST'])
def api_clock_in(user_id):
    return clock_in(user_id)

@app.route('/clock_out/<user_id>', methods=['POST'])
def api_clock_out(user_id):
    return clock_out(user_id)

@app.route('/view_time_log/<user_id>', methods=['GET'])
def api_view_time_log(user_id):
    return view_time_log(user_id)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Time Tracker API. Use /clock_in/<user_id>, /clock_out/<user_id>, or /view_time_log/<user_id> to interact with the app."}), 200

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)
