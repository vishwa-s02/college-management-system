import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import "./App.css";

function App() {

  // LOGIN
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // STUDENTS
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");

  // FETCH STUDENTS
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:10000/students"
      );

      setStudents(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  // LOGIN
  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      setLoggedIn(true);
    } else {
      alert("Wrong username or password");
    }
  };

  // ADD STUDENT
  const addStudent = async () => {

    if (name === "" || course === "") {
      alert("Fill all fields");
      return;
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:10000/students",
        {
          name,
          course,
          attendance: 0,
          date: new Date().toLocaleString(),
        }
      );

      setStudents([
        ...students,
        response.data
      ]);

      setName("");
      setCourse("");

    } catch (error) {
      console.log(error);
      alert("Failed to add student");
    }
  };

  // DELETE
  const deleteStudent = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:10000/students/${id}`
      );

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // ATTENDANCE
  const markAttendance = async (student) => {

    try {

      await axios.put(
        `http://127.0.0.1:10000/students/${student._id}`,
        {
          attendance: student.attendance + 1,
          date: new Date().toLocaleString(),
        }
      );

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // EDIT
  const editStudent = async (student) => {

    const newName = prompt(
      "Enter new name",
      student.name
    );

    const newCourse = prompt(
      "Enter new course",
      student.course
    );

    if (!newName || !newCourse) return;

    try {

      await axios.put(
        `http://127.0.0.1:10000/students/${student._id}`,
        {
          name: newName,
          course: newCourse,
          attendance: student.attendance,
          date: student.date,
        }
      );

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // PDF DOWNLOAD
  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "College Management System",
      20,
      20
    );

    autoTable(doc, {

      head: [[
        "Name",
        "Course",
        "Attendance",
        "Last Updated"
      ]],

      body: students.map((student) => [
        student.name,
        student.course,
        student.attendance,
        student.date || "No Date",
      ]),
    });

    doc.save("students.pdf");
  };

  // FILTER
  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // LOGIN PAGE
  if (!loggedIn) {

    return (

      <div className="login-container">

        <div className="login-box">

          <h1>College Login</h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="container">

      <div className="top-bar">

        <h1>
          College Management System 🎓
        </h1>

        <button
          className="logout-btn"
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </button>

      </div>

      {/* DASHBOARD */}

      <div className="dashboard">

        <div className="dash-card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>

        <div className="dash-card">
          <h3>Total Attendance</h3>
          <p>
            {students.reduce(
              (total, student) =>
                total + student.attendance,
              0
            )}
          </p>
        </div>

        <div className="dash-card">
          <h3>Courses</h3>
          <p>
            {
              new Set(
                students.map(
                  (student) => student.course
                )
              ).size
            }
          </p>
        </div>

      </div>

      {/* PDF */}

      <button
        className="pdf-btn"
        onClick={downloadPDF}
      >
        Download PDF
      </button>

      {/* FORM */}

      <div className="form">

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) =>
            setCourse(e.target.value)
          }
        />

        <button onClick={addStudent}>
          Add Student
        </button>

      </div>

      {/* SEARCH */}

      <input
        className="search"
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* STUDENTS */}

      <div className="student-list">

        {filteredStudents.map((student) => (

          <div
            key={student._id}
            className="student-card"
          >

            <h3>{student.name}</h3>

            <p>{student.course}</p>

            <p>
              Attendance: {student.attendance}
            </p>

            <p className="date">
              Last Updated:{" "}
              {student.date || "No Date"}
            </p>

            <button
              className="attendance-btn"
              onClick={() =>
                markAttendance(student)
              }
            >
              Mark Attendance
            </button>

            <button
              className="edit-btn"
              onClick={() =>
                editStudent(student)
              }
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() =>
                deleteStudent(student._id)
              }
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default App;