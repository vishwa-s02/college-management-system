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
def mark_attendance(id):

    student = students_collection.find_one({"id": id})

    if student:

        new_attendance = student.get("attendance", 0) + 1

        students_collection.update_one(
            {"id": id},
            {
                "$set": {
                    "attendance": new_attendance
                }
            }
        )

        return jsonify({
            "message": "Attendance updated"
        })

    return jsonify({
        "message": "Student not found"
    }), 404
@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    global students

    students = [student for student in students if student["_id"] != id]

    return jsonify({"message": "Student deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=10000)