from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

students = []

@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)

@app.route("/students", methods=["POST"])
def add_student():
    data = request.json

    new_student = {
        "_id": len(students) + 1,
        "name": data["name"],
        "course": data["course"],
        "attendance": data["attendance"]
    }

    students.append(new_student)

    return jsonify(new_student)

@app.route("/students/<int:id>", methods=["PUT"])
def update_attendance(id):
    data = request.json

    for student in students:
        if student["_id"] == id:
            student["attendance"] = data["attendance"]
            return jsonify(student)

    return jsonify({"message": "Student not found"}), 404

@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    global students

    students = [student for student in students if student["_id"] != id]

    return jsonify({"message": "Student deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=10000)