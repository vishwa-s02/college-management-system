import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import "./App.css";

function App() {

  // BACKEND URL
  const API = "https://college-management-system-op7o.onrender.com";

  // LOGIN
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // STUDENTS
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);

  // FETCH STUDENTS
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOGIN FUNCTION
  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Wrong username or password");
    }
  };

  // ADD STUDENT
  const addStudent = async () => {

    if (name === "" || course === "") {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await axios.post(`${API}/students`, {
        name,
        course,
        attendance: 0,
      });

      setStudents([...students, response.data]);

      setName("");
      setCourse("");

    } catch (error) {
      console.log(error);
      alert("Failed to add student");
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {

    try {

      await axios.delete(`${API}/students/${id}`);

      const updated = students.filter((student) => student.id !== id);

      setStudents(updated);

    } catch (error) {
      console.log(error);
    }
  };

  // MARK ATTENDANCE
  const markAttendance = async (id) => {

    try {

      await axios.put(`${API}/students/${id}`);

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // EDIT STUDENT
  const editStudent = (student) => {

    setEditingId(student.id);
    setName(student.name);
    setCourse(student.course);
  };

  // UPDATE STUDENT
  const updateStudent = async () => {

    try {

      await axios.put(`${API}/edit/${editingId}`, {
        name,
        course,
      });

      fetchStudents();

      setEditingId(null);
      setName("");
      setCourse("");

    } catch (error) {
      console.log(error);
    }
  };

  // DOWNLOAD PDF
  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text("College Management System", 20, 20);

    const tableColumn = ["Name", "Course", "Attendance"];

    const tableRows = [];

    students.forEach((student) => {

      const row = [
        student.name,
        student.course,
        student.attendance,
      ];

      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("students.pdf");
  };

  // SEARCH
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
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
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>
    );
  }

  // MAIN PAGE
  return (

    <div className="container">

      <h1>
        College Management System 🎓
      </h1>

      <h2>
        Total Students: {students.length}
      </h2>

      {/* PDF BUTTON */}

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
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        {
          editingId ? (
            <button onClick={updateStudent}>
              Update Student
            </button>
          ) : (
            <button onClick={addStudent}>
              Add Student
            </button>
          )
        }

      </div>

      {/* SEARCH */}

      <input
        type="text"
        className="search"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* STUDENTS */}

      <div className="students-grid">

        {
          filteredStudents.map((student) => (

            <div
              className="student-card"
              key={student.id}
            >

              <h2>{student.name}</h2>

              <h3>{student.course}</h3>

              <p>
                Attendance: {student.attendance}
              </p>

              <div className="button-group">

                <button
                  className="attendance-btn"
                  onClick={() => markAttendance(student.id)}
                >
                  Mark Attendance
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editStudent(student)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default App;