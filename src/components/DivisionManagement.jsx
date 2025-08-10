import { Check, ChevronDown, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { divisionAPI } from "../services/api.js";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { ConfirmModal, DivisionModal } from "./ui/modal.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";

// Main component for managing divisions
function DivisionManagement() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState(null);

  const [formData, setFormData] = useState({
    divisionId: "",
    name: "",
    description: "",
    head: "",
    parentOrganization: "",
    budget: "",
    status: "active",
  });

  // Load divisions on component mount
  useEffect(() => {
    loadDivisions();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadDivisions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await divisionAPI.getAll();
      setDivisions(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to load divisions";
      setError(errorMessage);
      console.error("Error loading divisions:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateDivisionId = () => {
    const existingIds = divisions.map((d) => d.divisionId);
    let counter = 1;
    let newId = `DIV-${counter.toString().padStart(3, "0")}`;

    while (existingIds.includes(newId)) {
      counter++;
      newId = `DIV-${counter.toString().padStart(3, "0")}`;
    }

    return newId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      divisionId: "",
      name: "",
      description: "",
      head: "",
      parentOrganization: "",
      budget: "",
      status: "active",
    });
    setEditingDivision(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.divisionId.trim() || !formData.name.trim()) {
        setError("Division ID and Name are required fields");
        return;
      }

      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      if (editingDivision) {
        await divisionAPI.update(editingDivision.id, submitData);
      } else {
        await divisionAPI.create(submitData);
      }

      await loadDivisions();
      setIsModalOpen(false);
      resetForm();
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to save division";
      setError(errorMessage);
      console.error("Error saving division:", err);
    }
  };

  const handleEdit = (division) => {
    setEditingDivision(division);
    setFormData({
      divisionId: division.divisionId,
      name: division.name,
      description: division.description || "",
      head: division.head || "",
      parentOrganization: division.parentOrganization || "",
      budget: division.budget?.toString() || "",
      status: division.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDivisionToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setError(null);
      await divisionAPI.delete(divisionToDelete);
      await loadDivisions();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to delete division";
      setError(errorMessage);
      console.error("Error deleting division:", err);
    } finally {
      setIsConfirmModalOpen(false);
      setDivisionToDelete(null);
    }
  };

  const handleCreate = () => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      divisionId: generateDivisionId(),
    }));
    setIsModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "all":
        return "All Status";
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return "All Status";
    }
  };

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  // Filter divisions based on search and status
  const filteredDivisions = divisions.filter((division) => {
    const matchesSearch =
      searchTerm === "" ||
      division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.head?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || division.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-24 w-24 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Division Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage organizational divisions and their operations.
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Division
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center space-x-2 pb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <h3 className="text-lg font-semibold tracking-tight">
                Search & Filter
              </h3>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  placeholder="Search divisions by name, description, or head..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                />
              </div>
              <div className="relative w-48" ref={filterRef}>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M7 12h10"></path>
                      <path d="M10 18h4"></path>
                    </svg>
                    <span>{getStatusLabel(statusFilter)}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-input rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleFilterSelect("all")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>All Status</span>
                        {statusFilter === "all" && (
                          <Check className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleFilterSelect("active")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>Active</span>
                        {statusFilter === "active" && (
                          <Check className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleFilterSelect("inactive")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>Inactive</span>
                        {statusFilter === "inactive" && (
                          <Check className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Divisions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-semibold">
                    Divisions ({filteredDivisions.length})
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your organizational divisions and their details.
                  </p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDivisions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No divisions match your search criteria."
                  : "No divisions found. Create your first division to get started."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Division ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Head</TableHead>
                      <TableHead>Parent Organization</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDivisions.map((division) => (
                      <TableRow key={division.id}>
                        <TableCell className="font-mono text-sm">
                          {division.divisionId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{division.name}</div>
                            {division.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {division.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{division.head || "-"}</TableCell>
                        <TableCell>
                          {division.parentOrganization || "Global Corp"}
                        </TableCell>
                        <TableCell>{formatCurrency(division.budget)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              division.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              division.status === "active"
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {division.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(division.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(division)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(division.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals are rendered here */}
      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        editingDivision={editingDivision}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this division? This action cannot be undone."
      />
    </div>
  );
}

export default DivisionManagement;
