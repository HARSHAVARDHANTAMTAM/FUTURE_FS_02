import Login from "./components/Login";
import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [
    isAuthenticated,
    setIsAuthenticated
  ] = useState(
    localStorage.getItem("token")
  );

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "",
    notes: ""
  });

  const fetchLeads = async () => {

    const response = await fetch(
      "https://future-fs-02-m4r2.onrender.com/api/leads",
      {
        headers: {
          Authorization:
            localStorage.getItem("token")
        }
      }
    );

    const data = await response.json();

    setLeads(data);

  };

  useEffect(() => {

    fetchLeads();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await fetch(
      "https://future-fs-02-m4r2.onrender.com/api/leads",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            localStorage.getItem("token")
        },

        body: JSON.stringify(formData)
      }
    );

    setFormData({
      name: "",
      email: "",
      source: "",
      notes: ""
    });

    fetchLeads();

  };

  return (

    <>
      {
        !isAuthenticated ? (

          <Login
            setIsAuthenticated={
              setIsAuthenticated
            }
          />

        ) : (

          <div className="container">

            <h1 className="title">
              Mini CRM System
            </h1>

            <button
              className="logout-btn"
              onClick={() => {

                localStorage.removeItem(
                  "token"
                );

                setIsAuthenticated(false);

              }}
            >
              Logout
            </button>

            <div className="stats-container">

              <div className="stat-card">

                <h2>
                  {leads.length}
                </h2>

                <p>Total Leads</p>

              </div>

              <div className="stat-card">

                <h2>
                  {
                    leads.filter(
                      (lead) =>
                        lead.status === "New"
                    ).length
                  }
                </h2>

                <p>New Leads</p>

              </div>

              <div className="stat-card">

                <h2>
                  {
                    leads.filter(
                      (lead) =>
                        lead.status ===
                        "Converted"
                    ).length
                  }
                </h2>

                <p>Converted</p>

              </div>

            </div>

            <input
              type="text"
              placeholder="Search Leads..."
              className="search-input"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Leads
              </option>

              <option value="New">
                New
              </option>

              <option value="Contacted">
                Contacted
              </option>

              <option value="Converted">
                Converted
              </option>

            </select>

            <form
              className="lead-form"
              onSubmit={handleSubmit}
            >

              <input
                type="text"
                name="name"
                placeholder="Client Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Client Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="source"
                placeholder="Lead Source"
                value={formData.source}
                onChange={handleChange}
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>

              <button type="submit">
                Add Lead
              </button>

            </form>

            <div className="leads-container">

              {
                leads
                  .filter((lead) => {

                    const matchesSearch =
                      lead.name
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        );

                    const matchesStatus =
                      filterStatus ===
                        "All" ||
                      lead.status ===
                        filterStatus;

                    return (
                      matchesSearch &&
                      matchesStatus
                    );

                  })
                  .map((lead) => (

                    <div
                      className="lead-card"
                      key={lead._id}
                    >

                      <h2>{lead.name}</h2>

                      <p>{lead.email}</p>

                      <p>
                        Source:
                        {" "}
                        {lead.source}
                      </p>

                      <select
                        value={lead.status}
                        onChange={async (e) => {

                          await fetch(
                            'https://future-fs-02-m4r2.onrender.com/api/leads/${lead._id}',
                            {
                              method: "PUT",

                              headers: {
                                "Content-Type":
                                  "application/json",

                                Authorization:
                                  localStorage.getItem(
                                    "token"
                                  )
                              },

                              body: JSON.stringify({
                                status:
                                  e.target.value
                              })
                            }
                          );

                          fetchLeads();

                        }}
                      >

                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                      </select>

                      <p>{lead.notes}</p>

                      <button
                        className="delete-btn"
                        onClick={async () => {

                          await fetch(
                            `https://future-fs-02-m4r2.onrender.com/api/leads/${lead._id}`,
                            {
                              method: "DELETE",

                              headers: {
                                Authorization:
                                  localStorage.getItem(
                                    "token"
                                  )
                              }
                            }
                          );

                          fetchLeads();

                        }}
                      >
                        Delete
                      </button>

                    </div>

                  ))
              }

            </div>

          </div>

        )
      }
    </>

  );

}

export default App;