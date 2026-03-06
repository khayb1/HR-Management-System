import React from "react";

const ApprovalModal = ({
  isOpen,
  title,
  comment,
  setComment,
  onClose,
  onSubmit,
  submitLabel = "Submit",
  submitColor = "green",
  requireComment = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Add comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={() => {
              if (requireComment && !comment.trim()) return;
              onSubmit();
            }}
            disabled={requireComment && !comment.trim()}
            className={`px-4 py-2 text-white rounded ${
              submitColor === "red"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
