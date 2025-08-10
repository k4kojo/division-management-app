import { Input } from "./input.jsx";

// Custom Modal component for creating and editing divisions
const DivisionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  editingDivision,
}) => {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-in fade-in duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {editingDivision ? "Edit Division" : "Create New Division"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Division ID
              </label>
              <Input
                name="divisionId"
                value={formData.divisionId}
                onChange={onInputChange}
                placeholder="DIV-001"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Division Name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <Input
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="Division description"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Head</label>
              <Input
                name="head"
                value={formData.head}
                onChange={onInputChange}
                placeholder="Division head"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Parent Organization
              </label>
              <Input
                name="parentOrganization"
                value={formData.parentOrganization}
                onChange={onInputChange}
                placeholder="Global Corp"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Budget</label>
              <Input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={onInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-gray-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
          <div className="flex gap-2 p-6 pt-10">
            <Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
              {editingDivision ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// Custom Confirmation Modal component
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm animate-in fade-in duration-300">
        <CardHeader>
          <CardTitle>Confirm Action</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{message}</p>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { ConfirmModal, DivisionModal };
